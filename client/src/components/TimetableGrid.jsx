import React, { useMemo } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { useTheme } from '../context/ThemeContext';
import TimeSlotCard from './TimeSlotCard';
import TimetableFilters from './TimetableFilters';

// Utility: convert HH:MM to minutes since midnight
const timeToMinutes = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
};

// Check overlap
const overlaps = (a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return false;
    const aStart = timeToMinutes(a.startTime);
    const aEnd = timeToMinutes(a.endTime);
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);
    return aStart < bEnd && bStart < aEnd;
};

// Weekdays to render (time + 6 days)
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetableGrid = ({ start = '07:00', end = '19:00', slotMinutes = 30 }) => {
    const { entries, filters } = useTimetable();
    const { isDark } = useTheme();

    // grid parameters
    const gridStart = timeToMinutes(start);
    const gridEnd = timeToMinutes(end);
    const pixelsPerMinute = 0.667; // ~40px per hour (40/60 = 0.667)

    // Filter entries to those within grid range and days + apply UI filters
    const dayEntries = useMemo(() => {
        const map = {};
        WEEKDAYS.forEach(d => map[d] = []);

        (entries || []).forEach(e => {
            // apply UI filters
            if (filters) {
                if (filters.department && e.courseId?.department !== filters.department) return;
                if (filters.selectedCourse && e.courseId?.code !== filters.selectedCourse) return;
                if (filters.selectedCourse && e.courseId && (e.courseId !== filters.selectedCourse && e.courseId.code !== filters.selectedCourse)) return;
                if (filters.room && ((e.roomId && e.roomId.name && e.roomId.name !== filters.room) && (typeof e.roomId === 'string' && e.roomId !== filters.room))) return;
                if (filters.lecturer && ((e.lecturerId && `${e.lecturerId.firstName || ''} ${e.lecturerId.lastName || ''}`.trim() !== filters.lecturer) && (typeof e.lecturerId === 'string' && e.lecturerId !== filters.lecturer))) return;
                if (filters.dayOfWeek && e.dayOfWeek !== filters.dayOfWeek) return;
            }

            if (!WEEKDAYS.includes(e.dayOfWeek)) return;
            const s = timeToMinutes(e.startTime);
            const en = timeToMinutes(e.endTime);
            if (en <= gridStart || s >= gridEnd) return; // outside
            map[e.dayOfWeek].push(e);
        });

        // sort each day by startTime
        WEEKDAYS.forEach(d => map[d].sort((a,b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)));
        return map;
    }, [entries, gridStart, gridEnd, filters]);

    // Client-side conflict detection: mark lecturer/room/timetable conflicts
    const conflictsMap = useMemo(() => {
        const map = {};
        (entries || []).forEach(e => {
            map[e._id] = { lecturer: false, room: false, timetable: false };
        });

        (entries || []).forEach((e1) => {
            (entries || []).forEach((e2) => {
                if (e1._id === e2._id) return;
                if (e1.dayOfWeek !== e2.dayOfWeek) return;
                if (overlaps(e1, e2)) {
                    // lecturer conflict
                    if (e1.lecturerId && e2.lecturerId && e1.lecturerId === e2.lecturerId) {
                        map[e1._id].lecturer = true;
                    }
                    // room conflict
                    if (e1.roomId && e2.roomId && e1.roomId === e2.roomId) {
                        map[e1._id].room = true;
                    }
                    // timetable (same course) conflict
                    if (e1.courseId && e2.courseId && e1.courseId === e2.courseId) {
                        map[e1._id].timetable = true;
                    }
                }
            });
        });
        return map;
    }, [entries]);

    // For each day compute column slots for overlapping entries
    const layoutMap = useMemo(() => {
        const lm = {};
        WEEKDAYS.forEach(day => {
            const list = dayEntries[day] || [];
            const columns = []; // each column is last entry placed in that column
            const placements = [];

            list.forEach(entry => {
                // find first column with no overlap
                let placed = false;
                for (let i = 0; i < columns.length; i++) {
                    const last = columns[i][columns[i].length - 1];
                    if (!overlaps(last, entry)) {
                        columns[i].push(entry);
                        placements.push({ entry, col: i });
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    columns.push([entry]);
                    placements.push({ entry, col: columns.length - 1 });
                }
            });

            lm[day] = { placements, columnsCount: Math.max(1, columns.length) };
        });
        return lm;
    }, [dayEntries]);


    // Render time rows for left column
    const timeSlots = [];
    for (let t = gridStart; t <= gridEnd; t += slotMinutes) {
        const hour = Math.floor(t / 60).toString().padStart(2,'0');
        const min = (t % 60).toString().padStart(2,'0');
        timeSlots.push(`${hour}:${min}`);
    }

    return (
        <div className={`w-full overflow-x-auto border rounded ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
            <div className="px-4 py-4">
                <TimetableFilters />
            </div>

            <div className="grid grid-cols-7 min-w-[700px] md:min-w-[900px] md:mx-4">
                {/* Time column header */}
                <div className="border-r p-2 text-sm font-semibold bg-gray-50">Time</div>
                {WEEKDAYS.map(day => (
                    <div key={day} className="p-2 text-sm font-semibold border-r bg-gray-50 text-center">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 min-w-[700px] md:min-w-[900px] relative">
                {/* Time column with labels */}
                <div className="border-r p-0 sticky left-0 z-10 bg-white dark:bg-[#1a1a1a]">
                    <div className="relative h-[calc(40px*12)]">
                        {timeSlots.map((t, idx) => (
                            <div key={t} className="h-[40px] text-xs text-gray-600 flex items-start pl-2 border-b" style={{height: `${(slotMinutes/60)*40}px`}}>
                                <span className="mt-1">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Day columns */}
                {WEEKDAYS.map(day => (
                    <div key={day} className="border-r p-0 relative">
                        <div className="relative h-[calc(40px*12)]">
                            {/* background slot lines */}
                            {timeSlots.map((t, idx) => (
                                <div key={t} className="h-[40px] border-b" style={{height: `${(slotMinutes/60)*40}px`}} />
                            ))}

                            {/* entries for this day */}
                            {(dayEntries[day] || []).map(entry => {
                                const entryStart = Math.max(timeToMinutes(entry.startTime), gridStart);
                                const entryEnd = Math.min(timeToMinutes(entry.endTime), gridEnd);
                                const top = (entryStart - gridStart) * pixelsPerMinute;
                                const height = Math.max(18, (entryEnd - entryStart) * pixelsPerMinute); // min height

                                const layout = layoutMap[day] || { columnsCount: 1 };
                                const placement = layout.placements.find(p => p.entry._id === entry._id) || { col: 0 };
                                const widthPercent = 100 / layout.columnsCount;
                                const leftPercent = placement.col * widthPercent;

                                const conflict = conflictsMap[entry._id] || {};

                                const style = {
                                    position: 'absolute',
                                    top: `${top}px`,
                                    height: `${height}px`,
                                    left: `${leftPercent}%`,
                                    width: `calc(${widthPercent}% - 6px)`,
                                    marginLeft: '3px'
                                };

                                return (
                                    <TimeSlotCard
                                        key={entry._id}
                                        entry={entry}
                                        style={style}
                                        conflict={conflict}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimetableGrid;
