import React, { useMemo, useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { useTheme } from '../context/ThemeContext';
import { Filter, X } from 'lucide-react';
import Dropdown from './Dropdown';

const TimetableFilters = () => {
    const { entries = [], filters, updateFilters, resetFilters } = useTimetable();
    const { isDark } = useTheme();
    const [showFilters, setShowFilters] = useState(false);

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

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const hasActiveFilters = filters.department || filters.selectedCourse || filters.room || filters.lecturer || filters.dayOfWeek;

    return (
        <div className="mb-6">
            {/* Filter Toggle Button */}
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-button transition-smooth ${showFilters || hasActiveFilters
                            ? isDark
                                ? 'bg-indigo/15 text-indigo-light'
                                : 'bg-sage/10 text-sage'
                            : isDark
                                ? 'text-text-dark-secondary hover:bg-white/5'
                                : 'text-text-light-secondary hover:bg-black/5'
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    <span className="text-small">Filters</span>
                    {hasActiveFilters && (
                        <span
                            className={`w-2 h-2 rounded-full ${isDark ? 'bg-indigo-light' : 'bg-sage'
                                }`}
                        />
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={() => {
                            resetFilters();
                            updateFilters({});
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-button text-small transition-smooth ${isDark
                                ? 'text-text-dark-muted hover:text-text-dark-primary hover:bg-white/5'
                                : 'text-text-light-muted hover:text-text-light-primary hover:bg-black/5'
                            }`}
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>

            {/* Collapsible Filter Panel */}
            {showFilters && (
                <div
                    className={`rounded-card p-4 border ${isDark
                            ? 'bg-dark-surface border-dark-border-subtle'
                            : 'bg-light-surface border-light-border-subtle'
                        }`}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                        <Dropdown
                            value={filters.department || ''}
                            onChange={e => updateFilters({ department: e.target.value })}
                            options={[
                                { value: '', label: 'All Departments' },
                                ...departments.map(d => ({ value: d, label: d }))
                            ]}
                        />

                        <Dropdown
                            value={filters.selectedCourse || ''}
                            onChange={e => updateFilters({ selectedCourse: e.target.value })}
                            options={[
                                { value: '', label: 'All Courses' },
                                ...courses.map(c => ({
                                    value: c.code,
                                    label: `${c.code}${c.name ? ` - ${c.name}` : ''}`
                                }))
                            ]}
                        />

                        <Dropdown
                            value={filters.room || ''}
                            onChange={e => updateFilters({ room: e.target.value })}
                            options={[
                                { value: '', label: 'All Rooms' },
                                ...rooms.map(r => ({ value: r, label: r }))
                            ]}
                        />

                        <Dropdown
                            value={filters.lecturer || ''}
                            onChange={e => updateFilters({ lecturer: e.target.value })}
                            options={[
                                { value: '', label: 'All Lecturers' },
                                ...lecturers.map(l => ({ value: l, label: l }))
                            ]}
                        />

                        <Dropdown
                            value={filters.dayOfWeek || ''}
                            onChange={e => updateFilters({ dayOfWeek: e.target.value })}
                            options={[
                                { value: '', label: 'All Days' },
                                ...days.map(d => ({ value: d, label: d }))
                            ]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimetableFilters;