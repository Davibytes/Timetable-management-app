const TimetableEntry = require('../models/timetableEntryModel');
const Timetable = require('../models/timetableModel');

// Get all timetable entries with filtering
exports.getAllEntries = async (req, res) => {
    try {
        const { timetableId, courseId, roomId, lecturerId, dayOfWeek } = req.query;

        const filter = {};
        if (timetableId) filter.timetableId = timetableId;
        if (courseId) filter.courseId = courseId;
        if (roomId) filter.roomId = roomId;
        if (lecturerId) filter.lecturerId = lecturerId;
        if (dayOfWeek) filter.dayOfWeek = dayOfWeek;

        const entries = await TimetableEntry.find(filter)
            .populate('timetableId', 'name department semester academicYear')
            .populate('courseId', 'code name credits duration')
            .populate('roomId', 'name building floor capacity')
            .populate('lecturerId', 'firstName lastName email')
            .sort({ dayOfWeek: 1, startTime: 1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: { entries }
        });
    } catch (error) {
        console.error('Get entries error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve timetable entries'
        });
    }
};

// Get single timetable entry by ID
exports.getEntryById = async (req, res) => {
    try {
        const entry = await TimetableEntry.findById(req.params.id)
            .populate('timetableId', 'name department semester academicYear')
            .populate('courseId', 'code name credits duration')
            .populate('roomId', 'name building floor capacity equipment')
            .populate('lecturerId', 'firstName lastName email');

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Timetable entry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { entry }
        });
    } catch (error) {
        console.error('Get entry error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve timetable entry'
        });
    }
};

// Create new timetable entry (with conflict detection)
exports.createEntry = async (req, res) => {
    try {
        const { timetableId, courseId, roomId, lecturerId, dayOfWeek, startTime, endTime, type, notes } = req.body;

        // Check if timetable exists and is modifiable
        const timetable = await Timetable.findById(timetableId);
        if (!timetable) {
            return res.status(404).json({
                success: false,
                message: 'Timetable not found'
            });
        }

        if (!timetable.canModify()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot add entries to published or archived timetables. Unpublish first.'
            });
        }

        // Check for conflicts before creating
        const conflicts = await TimetableEntry.findConflicts({
            timetableId,
            courseId,
            roomId,
            lecturerId,
            dayOfWeek,
            startTime,
            endTime
        });

        if (conflicts.lecturer.length > 0 || conflicts.room.length > 0 || conflicts.timetable.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Conflicts detected. Cannot create entry.',
                conflicts: {
                    lecturer: conflicts.lecturer.map(e => ({
                        id: e._id,
                        course: e.courseId,
                        day: e.dayOfWeek,
                        time: `${e.startTime} - ${e.endTime}`
                    })),
                    room: conflicts.room.map(e => ({
                        id: e._id,
                        course: e.courseId,
                        day: e.dayOfWeek,
                        time: `${e.startTime} - ${e.endTime}`
                    })),
                    timetable: conflicts.timetable.map(e => ({
                        id: e._id,
                        room: e.roomId,
                        day: e.dayOfWeek,
                        time: `${e.startTime} - ${e.endTime}`
                    }))
                }
            });
        }

        const entry = await TimetableEntry.create({
            timetableId,
            courseId,
            roomId,
            lecturerId,
            dayOfWeek,
            startTime,
            endTime,
            type,
            notes
        });

        await entry.populate([
            { path: 'timetableId', select: 'name department semester' },
            { path: 'courseId', select: 'code name credits' },
            { path: 'roomId', select: 'name building floor' },
            { path: 'lecturerId', select: 'firstName lastName email' }
        ]);

        await timetable.updateMetadata();

        res.status(201).json({
            success: true,
            message: 'Timetable entry created successfully',
            data: { entry }
        });
    } catch (error) {
        console.error('Create entry error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create timetable entry'
        });
    }
};

// Update timetable entry (with conflict detection)
exports.updateEntry = async (req, res) => {
    try {
        const { timetableId, courseId, roomId, lecturerId, dayOfWeek, startTime, endTime, type, notes } = req.body;

        const entry = await TimetableEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Timetable entry not found'
            });
        }

        // Check if timetable is modifiable
        const timetable = await Timetable.findById(entry.timetableId);
        if (timetable && !timetable.canModify()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify entries in published or archived timetables. Unpublish first.'
            });
        }

        const entryData = {
            _id: entry._id,
            timetableId: timetableId || entry.timetableId,
            courseId: courseId || entry.courseId,
            roomId: roomId || entry.roomId,
            lecturerId: lecturerId || entry.lecturerId,
            dayOfWeek: dayOfWeek || entry.dayOfWeek,
            startTime: startTime || entry.startTime,
            endTime: endTime || entry.endTime
        };

        const conflicts = await TimetableEntry.findConflicts(entryData);

        if (conflicts.lecturer.length > 0 || conflicts.room.length > 0 || conflicts.timetable.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Conflicts detected. Cannot update entry.',
                conflicts: {
                    lecturer: conflicts.lecturer.map(e => ({
                        id: e._id,
                        course: e.courseId,
                        day: e.dayOfWeek,
                        time: `${e.startTime} - ${e.endTime}`
                    })),
                    room: conflicts.room.map(e => ({
                        id: e._id,
                        course: e.courseId,
                        day: e.dayOfWeek,
                        time: `${e.startTime} - ${e.endTime}`
                    })),
                    timetable: conflicts.timetable.map(e => ({
                        id: e._id,
                        room: e.roomId,
                        day: e.dayOfWeek,
                        time: `${e.startTime} - ${e.endTime}`
                    }))
                }
            });
        }

        if (timetableId !== undefined) entry.timetableId = timetableId;
        if (courseId !== undefined) entry.courseId = courseId;
        if (roomId !== undefined) entry.roomId = roomId;
        if (lecturerId !== undefined) entry.lecturerId = lecturerId;
        if (dayOfWeek !== undefined) entry.dayOfWeek = dayOfWeek;
        if (startTime !== undefined) entry.startTime = startTime;
        if (endTime !== undefined) entry.endTime = endTime;
        if (type !== undefined) entry.type = type;
        if (notes !== undefined) entry.notes = notes;

        await entry.save();

        await entry.populate([
            { path: 'timetableId', select: 'name department semester' },
            { path: 'courseId', select: 'code name credits' },
            { path: 'roomId', select: 'name building floor' },
            { path: 'lecturerId', select: 'firstName lastName email' }
        ]);

        if (timetable) {
            await timetable.updateMetadata();
        }

        res.status(200).json({
            success: true,
            message: 'Timetable entry updated successfully',
            data: { entry }
        });
    } catch (error) {
        console.error('Update entry error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update timetable entry'
        });
    }
};

// Delete timetable entry
exports.deleteEntry = async (req, res) => {
    try {
        const entry = await TimetableEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Timetable entry not found'
            });
        }

        const timetable = await Timetable.findById(entry.timetableId);
        if (timetable && !timetable.canModify()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete entries from published or archived timetables. Unpublish first.'
            });
        }

        await entry.deleteOne();

        if (timetable) {
            await timetable.updateMetadata();
        }

        res.status(200).json({
            success: true,
            message: 'Timetable entry deleted successfully'
        });
    } catch (error) {
        console.error('Delete entry error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete timetable entry'
        });
    }
};

// Check for conflicts (utility endpoint)
exports.checkConflicts = async (req, res) => {
    try {
        const { timetableId, courseId, roomId, lecturerId, dayOfWeek, startTime, endTime, entryId } = req.body;

        if (!dayOfWeek || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'dayOfWeek, startTime, and endTime are required'
            });
        }

        const conflicts = await TimetableEntry.findConflicts({
            _id: entryId, // Optional: exclude this entry when checking (for updates)
            timetableId,
            courseId,
            roomId,
            lecturerId,
            dayOfWeek,
            startTime,
            endTime
        });

        const hasConflicts = conflicts.lecturer.length > 0 || conflicts.room.length > 0 || conflicts.timetable.length > 0;

        res.status(200).json({
            success: true,
            hasConflicts,
            conflicts: {
                lecturer: conflicts.lecturer.map(e => ({
                    id: e._id,
                    courseId: e.courseId,
                    day: e.dayOfWeek,
                    time: `${e.startTime} - ${e.endTime}`,
                    room: e.roomId
                })),
                room: conflicts.room.map(e => ({
                    id: e._id,
                    courseId: e.courseId,
                    lecturerId: e.lecturerId,
                    day: e.dayOfWeek,
                    time: `${e.startTime} - ${e.endTime}`
                })),
                timetable: conflicts.timetable.map(e => ({
                    id: e._id,
                    roomId: e.roomId,
                    lecturerId: e.lecturerId,
                    day: e.dayOfWeek,
                    time: `${e.startTime} - ${e.endTime}`
                }))
            }
        });
    } catch (error) {
        console.error('Check conflicts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check conflicts'
        });
    }
};

// Get entries by day of week
exports.getEntriesByDay = async (req, res) => {
    try {
        const { timetableId } = req.params;
        const { dayOfWeek } = req.query;

        if (!dayOfWeek) {
            return res.status(400).json({
                success: false,
                message: 'dayOfWeek query parameter is required'
            });
        }

        const entries = await TimetableEntry.find({
            timetableId,
            dayOfWeek
        })
            .populate('courseId', 'code name credits')
            .populate('roomId', 'name building floor')
            .populate('lecturerId', 'firstName lastName')
            .sort({ startTime: 1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: { entries }
        });
    } catch (error) {
        console.error('Get entries by day error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve entries'
        });
    }
};