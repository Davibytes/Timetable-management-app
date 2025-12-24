const Timetable = require('../models/timetableModel');
const TimetableEntry = require('../models/timetableEntryModel');
const Room = require('../models/roomModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Utility: convert HH:MM to minutes
function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

// Check overlap between two time ranges on same day
function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
}

const DEFAULT_WORKLOAD_THRESHOLD = 20 * 60; // minutes per week (20 hours)

const conflictService = {
    analyzeTimetable: async (timetableId, options = {}) => {
        const entries = await TimetableEntry.find({ timetableId })
            .populate('courseId')
            .populate('roomId')
            .populate('lecturerId');

        const report = {
            totalEntries: entries.length,
            lecturerConflicts: [],
            roomConflicts: [],
            capacityIssues: [],
            workloadWarnings: []
        };

        // Build per-day lists for faster checking
        const byDay = {};
        entries.forEach(e => {
            if (!byDay[e.dayOfWeek]) byDay[e.dayOfWeek] = [];
            byDay[e.dayOfWeek].push(e);
        });

        // Detect room and lecturer conflicts by day
        for (const day of Object.keys(byDay)) {
            const dayEntries = byDay[day];
            for (let i = 0; i < dayEntries.length; i++) {
                const a = dayEntries[i];
                const aStart = timeToMinutes(a.startTime);
                const aEnd = timeToMinutes(a.endTime);

                for (let j = i + 1; j < dayEntries.length; j++) {
                    const b = dayEntries[j];
                    const bStart = timeToMinutes(b.startTime);
                    const bEnd = timeToMinutes(b.endTime);

                    if (overlaps(aStart, aEnd, bStart, bEnd)) {
                        if (a.roomId && b.roomId && a.roomId._id.equals(b.roomId._id)) {
                            report.roomConflicts.push({ a, b });
                        }
                        if (a.lecturerId && b.lecturerId && a.lecturerId._id.equals(b.lecturerId._id)) {
                            report.lecturerConflicts.push({ a, b });
                        }
                    }
                }
            }
        }

        // Capacity checks - use provided mapping or Course.expectedStudents if present
        const courseCounts = options.courseStudentCounts || {};
        for (const e of entries) {
            const courseId = e.courseId && e.courseId._id ? e.courseId._id.toString() : null;
            let expected = null;
            if (courseId && courseCounts[courseId] !== undefined) {
                expected = parseInt(courseCounts[courseId]);
            } else if (e.courseId && e.courseId.expectedStudents) {
                expected = e.courseId.expectedStudents;
            }

            if (expected !== null && e.roomId) {
                const room = e.roomId;
                if (room.capacity < expected) {
                    report.capacityIssues.push({ entry: e, roomCapacity: room.capacity, expectedStudents: expected });
                }
            } else if (expected === null) {
                // mark unknown counts if explicitly requested
                if (options.reportUnknownCounts) {
                    report.capacityIssues.push({ entry: e, reason: 'Unknown student count for course' });
                }
            }
        }

        // Lecturer workload analysis
        const workloadMap = {}; // lecturerId -> minutes
        entries.forEach(e => {
            const dur = timeToMinutes(e.endTime) - timeToMinutes(e.startTime);
            const lid = e.lecturerId ? e.lecturerId._id.toString() : 'unknown';
            workloadMap[lid] = (workloadMap[lid] || 0) + dur;
        });

        for (const [lecturerId, minutes] of Object.entries(workloadMap)) {
            const lecturer = entries.find(e => e.lecturerId && e.lecturerId._id.toString() === lecturerId)?.lecturerId || null;
            const threshold = (options.workloadThresholdMinutes || DEFAULT_WORKLOAD_THRESHOLD);
            if (minutes > threshold) {
                report.workloadWarnings.push({ lecturer, minutes, threshold });
            }
        }

        return report;
    },

    validateTimetableForPublish: async (timetableId, options = {}) => {
        const timetable = await Timetable.findById(timetableId);
        if (!timetable) throw new Error('Timetable not found');

        const entries = await TimetableEntry.find({ timetableId });
        if (entries.length === 0) {
            return { valid: false, reasons: ['Timetable has no sessions'] };
        }

        const report = await conflictService.analyzeTimetable(timetableId, options);

        const hasConflicts = report.roomConflicts.length > 0 || report.lecturerConflicts.length > 0 || report.capacityIssues.length > 0;

        return { valid: !hasConflicts, report };
    },

    getLecturerWorkload: async (lecturerId, options = {}) => {
        const filter = {};
        if (options.timetableId) filter.timetableId = options.timetableId;
        filter.lecturerId = lecturerId;

        const entries = await TimetableEntry.find(filter);
        const byWeekMinutes = entries.reduce((acc, e) => {
            const dur = timeToMinutes(e.endTime) - timeToMinutes(e.startTime);
            return acc + dur;
        }, 0);

        const threshold = options.thresholdMinutes || DEFAULT_WORKLOAD_THRESHOLD;

        return { lecturerId, minutes: byWeekMinutes, hours: +(byWeekMinutes / 60).toFixed(2), overload: byWeekMinutes > threshold };
    },

    // Suggest alternative slots for a given entry or a duration & lecturer constraints
    suggestSlots: async (timetableId, { entryId, durationMinutes, courseId, lecturerId, courseStudentCounts } = {}, options = {}) => {
        // Load relevant entries
        const entries = await TimetableEntry.find({ timetableId });
        const rooms = await Room.find({ isActive: true, isAvailable: true });

        let targetEntry = null;
        if (entryId) targetEntry = await TimetableEntry.findById(entryId).populate('courseId roomId lecturerId');
        if (!durationMinutes && targetEntry) {
            durationMinutes = timeToMinutes(targetEntry.endTime) - timeToMinutes(targetEntry.startTime);
        }
        if (!lecturerId && targetEntry) lecturerId = targetEntry.lecturerId ? targetEntry.lecturerId._id.toString() : null;
        if (!courseId && targetEntry) courseId = targetEntry.courseId ? targetEntry.courseId._id.toString() : null;

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const startWindow = options.startWindow || '08:00';
        const endWindow = options.endWindow || '18:00';
        const step = options.stepMinutes || 30;
        const suggestions = [];

        for (const day of days) {
            // Build busy intervals for lecturer and for each room
            const dayEntries = entries.filter(e => e.dayOfWeek === day && (!entryId || e._id.toString() !== entryId));

            const lecturerBusy = dayEntries.filter(e => e.lecturerId && e.lecturerId.toString() === lecturerId).map(e => ({ start: timeToMinutes(e.startTime), end: timeToMinutes(e.endTime) }));

            for (let t = timeToMinutes(startWindow); t + durationMinutes <= timeToMinutes(endWindow); t += step) {
                const slotStart = t;
                const slotEnd = t + durationMinutes;

                // Check lecturer availability
                const lectOverlap = lecturerBusy.some(b => overlaps(slotStart, slotEnd, b.start, b.end));
                if (lectOverlap) continue;

                // For each room check availability and suitability
                for (const room of rooms) {
                    const roomBusy = dayEntries.filter(e => e.roomId && e.roomId.toString() === room._id.toString()).map(e => ({ start: timeToMinutes(e.startTime), end: timeToMinutes(e.endTime) }));
                    if (roomBusy.some(b => overlaps(slotStart, slotEnd, b.start, b.end))) continue;

                    // capacity check if counts known
                    let expected = null;
                    if (courseStudentCounts && courseId && courseStudentCounts[courseId]) expected = courseStudentCounts[courseId];
                    // if no expected, optimistic (accept)
                    if (expected !== null && room.capacity < expected) continue;

                    // suitability by course type if we can resolve course
                    let suitable = true;
                    if (courseId) {
                        const course = await Course.findById(courseId);
                        if (course && room.isSuitableFor && !room.isSuitableFor(course.type || 'Lecture')) {
                            suitable = false;
                        }
                    }
                    if (!suitable) continue;

                    suggestions.push({ day, startTime: `${String(Math.floor(slotStart/60)).padStart(2,'0')}:${String(slotStart%60).padStart(2,'0')}`, endTime: `${String(Math.floor(slotEnd/60)).padStart(2,'0')}:${String(slotEnd%60).padStart(2,'0')}`, room: { _id: room._id, name: room.name, capacity: room.capacity }});

                    if (suggestions.length >= (options.limit || 5)) return suggestions;
                }
            }
        }

        return suggestions;
    }
};

module.exports = conflictService;
