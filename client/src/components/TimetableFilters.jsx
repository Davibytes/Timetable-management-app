import React, { useMemo } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { useTheme } from '../context/ThemeContext';
import { X } from 'lucide-react';

const TimetableFilters = () => {
    const { entries = [], filters, updateFilters, resetFilters } = useTimetable();
    const { isDark } = useTheme();

    const departments = useMemo(() => {
        const s = new Set();
        entries.forEach(e => {
            const dep = e.courseId?.department;
            if (dep) s.add(dep);
        });
        return Array.from(s).sort();
    }, [entries]);

    const courses = useMemo(() => {
        const map = entries.reduce((acc, e) => {
            const c = e.courseId?.code || e.courseId;
            if (c && !acc.has(c)) acc.set(c, { code: c, name: e.courseId?.name });
            return acc;
        }, new Map());
        return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
    }, [entries]);

    const rooms = useMemo(() => {
        const s = new Set();
        entries.forEach(e => {
            if (e.roomId?.name) s.add(e.roomId.name);
            else if (e.roomId) s.add(e.roomId);
        });
        return Array.from(s).sort();
    }, [entries]);

    const lecturers = useMemo(() => {
        const s = new Set();
        entries.forEach(e => {
            if (e.lecturerId?.firstName) s.add(`${e.lecturerId.firstName} ${e.lecturerId.lastName}`);
            else if (e.lecturerId) s.add(e.lecturerId);
        });
        return Array.from(s).sort();
    }, [entries]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const inputClass = isDark
        ? 'w-full px-4 py-3 bg-dark-surface border border-dark-border-subtle rounded-input text-text-dark-primary placeholder:text-text-dark-muted focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-smooth outline-none'
        : 'w-full px-4 py-3 bg-light-surface border border-light-border-subtle rounded-input text-text-light-primary placeholder:text-text-light-muted focus:border-sage focus:ring-2 focus:ring-sage/20 transition-smooth outline-none';

    const labelClass = isDark ? 'text-text-dark-primary' : 'text-text-light-primary';

    const hasActiveFilters = filters.department || filters.selectedCourse || filters.room || filters.lecturer || filters.dayOfWeek;

    return (
        <div className={`rounded-card p-6 border ${isDark ? 'bg-dark-surface border-dark-border-subtle' : 'bg-light-surface border-light-border-subtle'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-h4 font-comfortaa font-semibold ${labelClass}`}>
                    Filters
                </h3>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() => {
                            resetFilters();
                            updateFilters({});
                        }}
                        className={`flex items-center gap-2 text-small transition-smooth ${isDark
                                ? 'text-text-dark-secondary hover:text-text-dark-primary'
                                : 'text-text-light-secondary hover:text-text-light-primary'
                            }`}
                    >
                        <X className="w-4 h-4" />
                        Clear All
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className={`block text-small font-medium mb-2 ${labelClass}`}>
                        Department
                    </label>
                    <select
                        className={inputClass}
                        value={filters.department || ''}
                        onChange={e => updateFilters({ department: e.target.value })}
                    >
                        <option value="">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                <div>
                    <label className={`block text-small font-medium mb-2 ${labelClass}`}>
                        Course
                    </label>
                    <select
                        className={inputClass}
                        value={filters.selectedCourse || ''}
                        onChange={e => updateFilters({ selectedCourse: e.target.value })}
                    >
                        <option value="">All Courses</option>
                        {courses.map(c => (
                            <option key={c.code} value={c.code}>
                                {c.code} {c.name ? `- ${c.name}` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className={`block text-small font-medium mb-2 ${labelClass}`}>
                        Room
                    </label>
                    <select
                        className={inputClass}
                        value={filters.room || ''}
                        onChange={e => updateFilters({ room: e.target.value })}
                    >
                        <option value="">All Rooms</option>
                        {rooms.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div>
                    <label className={`block text-small font-medium mb-2 ${labelClass}`}>
                        Lecturer
                    </label>
                    <select
                        className={inputClass}
                        value={filters.lecturer || ''}
                        onChange={e => updateFilters({ lecturer: e.target.value })}
                    >
                        <option value="">All Lecturers</option>
                        {lecturers.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>

                <div>
                    <label className={`block text-small font-medium mb-2 ${labelClass}`}>
                        Day of Week
                    </label>
                    <select
                        className={inputClass}
                        value={filters.dayOfWeek || ''}
                        onChange={e => updateFilters({ dayOfWeek: e.target.value })}
                    >
                        <option value="">All Days</option>
                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TimetableFilters;
