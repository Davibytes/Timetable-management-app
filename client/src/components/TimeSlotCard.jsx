import React from 'react';
import { useTheme } from '../context/ThemeContext';

const COURSE_COLORS = [
    '#6731b7',
    '#523e93',
    '#9975cd',
    '#5a7a5f',
    '#7591a3',
];

// Deterministic color from string (stable across renders)
const getColorFromString = (str) => {
    if (!str) return COURSE_COLORS[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COURSE_COLORS[Math.abs(hash) % COURSE_COLORS.length];
};

const TimeSlotCard = ({ entry, style = {}, conflict = {}, onClick }) => {
    const { isDark } = useTheme();

    const hasConflict = conflict.lecturer || conflict.room || conflict.timetable;

    const conflictClass = isDark
        ? 'border-2 border-[#f44336] bg-[#f44336]/15 animate-pulse'
        : 'border-2 border-[#b44336] bg-[#b44336]/15 animate-pulse';

    // Get stable color based on course
    const colorKey = entry.courseId?._id || entry.courseId?.code || entry.courseId?.name || entry.department || 'default';
    const bgColor = getColorFromString(String(colorKey));

    return (
        <div
            onClick={() => onClick && onClick(entry)}
            className={`rounded-lg p-3 cursor-grab shadow-lg hover:shadow-xl transition-shadow text-white ${hasConflict ? conflictClass : ''
                }`}
            style={{
                background: hasConflict ? undefined : bgColor,
                ...style
            }}
            title={`${entry.courseId?.code || entry.courseId} • ${entry.roomId?.name || entry.roomId || ''} • ${entry.startTime} - ${entry.endTime}`}
        >
            <div className="flex items-start justify-between">
                <div className="truncate font-semibold text-sm md:text-base">
                    {entry.courseId?.code || entry.courseId}
                </div>
                {hasConflict && <div className="ml-2 text-red-800 font-bold">⚠</div>}
            </div>

            <div className="mt-1 text-[11px] opacity-95 md:text-xs">
                <div className="truncate">{entry.roomId?.name || entry.roomId}</div>
                <div className="truncate">{entry.startTime} - {entry.endTime}</div>
            </div>

            {entry.courseId?.department && (
                <div className="mt-2 text-[10px] opacity-90 bg-white/10 rounded px-1 py-0.5 inline-block">
                    {entry.courseId.department}
                </div>
            )}
        </div>
    );
};

export default TimeSlotCard;