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

// Weekdays to render
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
        WEEKDAYS.forEach(d => map[d].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)));
        return map;
    }, [entries, gridStart, gridEnd, filters]);

    // Client-side conflict detection
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
            const columns = [];
            const placements = [];

            list.forEach(entry => {
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
        const hour = Math.floor(t / 60).toString().padStart(2, '0');
        const min = (t % 60).toString().padStart(2, '0');
        timeSlots.push(`${hour}:${min}`);
    }

    return (
        <div className="w-full space-y-6">
            <TimetableFilters />

            <div className={`w-full overflow-x-auto border rounded-card ${isDark
                    ? 'bg-dark-surface border-dark-border-subtle'
                    : 'bg-light-surface border-light-border-subtle'
                }`}>
                {/* Header Row */}
                <div className="grid grid-cols-7 min-w-[900px]">
                    <div className={`border-r p-4 text-small font-comfortaa font-semibold ${isDark
                            ? 'bg-dark-elevated border-dark-border-subtle text-text-dark-primary'
                            : 'bg-light-elevated border-light-border-subtle text-text-light-primary'
                        }`}>
                        Time
                    </div>
                    {WEEKDAYS.map(day => (
                        <div
                            key={day}
                            className={`p-4 text-small font-comfortaa font-semibold border-r text-center ${isDark
                                    ? 'bg-dark-elevated border-dark-border-subtle text-text-dark-primary'
                                    : 'bg-light-elevated border-light-border-subtle text-text-light-primary'
                                }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid Body */}
                <div className="grid grid-cols-7 min-w-[900px] relative">
                    {/* Time column with labels */}
                    <div className={`border-r sticky left-0 z-10 ${isDark ? 'bg-dark-surface' : 'bg-light-surface'
                        }`}>
                        <div className="relative" style={{ height: `${(gridEnd - gridStart) * pixelsPerMinute}px` }}>
                            {timeSlots.map((t, idx) => (
                                <div
                                    key={t}
                                    className={`text-caption flex items-start pl-3 border-b ${isDark
                                            ? 'text-text-dark-muted border-dark-border-subtle'
                                            : 'text-text-light-muted border-light-border-subtle'
                                        }`}
                                    style={{ height: `${(slotMinutes / 60) * 40}px` }}
                                >
                                    <span className="mt-1">{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Day columns */}
                    {WEEKDAYS.map(day => (
                        <div
                            key={day}
                            className={`border-r p-0 relative ${isDark ? 'border-dark-border-subtle' : 'border-light-border-subtle'
                                }`}
                        >
                            <div className="relative" style={{ height: `${(gridEnd - gridStart) * pixelsPerMinute}px` }}>
                                {/* background slot lines */}
                                {timeSlots.map((t, idx) => (
                                    <div
                                        key={t}
                                        className={`border-b transition-smooth ${isDark
                                                ? 'border-dark-border-subtle hover:bg-white/5'
                                                : 'border-light-border-subtle hover:bg-black/5'
                                            }`}
                                        style={{ height: `${(slotMinutes / 60) * 40}px` }}
                                    />
                                ))}

                                {/* entries for this day */}
                                {(dayEntries[day] || []).map(entry => {
                                    const entryStart = Math.max(timeToMinutes(entry.startTime), gridStart);
                                    const entryEnd = Math.min(timeToMinutes(entry.endTime), gridEnd);
                                    const top = (entryStart - gridStart) * pixelsPerMinute;
                                    const height = Math.max(18, (entryEnd - entryStart) * pixelsPerMinute);

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
        </div>
    );
};

export default TimetableGrid;
