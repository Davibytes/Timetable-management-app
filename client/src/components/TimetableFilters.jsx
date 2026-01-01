import React, { useMemo } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { useTheme } from '../context/ThemeContext';

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
        return Array.from(map.values()).sort((a,b) => a.code.localeCompare(b.code));
    }, [entries]);

    const rooms = useMemo(() => {
        const s = new Set();
        entries.forEach(e => { if (e.roomId?.name) s.add(e.roomId.name); else if (e.roomId) s.add(e.roomId); });
        return Array.from(s).sort();
    }, [entries]);

    const lecturers = useMemo(() => {
        const s = new Set();
        entries.forEach(e => { if (e.lecturerId?.firstName) s.add(`${e.lecturerId.firstName} ${e.lecturerId.lastName}`); else if (e.lecturerId) s.add(e.lecturerId); });
        return Array.from(s).sort();
    }, [entries]);

    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

    const inputClass = isDark
        ? 'w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder:text-[#808080] focus:border-[#6731b7] focus:ring-2 focus:ring-[#6731b7]/20 transition-all outline-none'
        : 'w-full px-4 py-3 bg-white border border-[#e8ebe6] rounded-lg text-[#1f2d1f] placeholder:text-[#8a9a8f] focus:border-[#5a7a5f] focus:ring-2 focus:ring-[#5a7a5f]/20 transition-all outline-none';

    return (
        <div className={`rounded-card p-4 border ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-white border-[#e8ebe6]'}`}>
            <h3 className={`text-h4 font-comfortaa font-semibold mb-3 ${isDark ? 'text-white' : 'text-[#1f2d1f]'}`}>Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                    <label className="block text-small font-medium mb-2">Department</label>
                    <select className={inputClass} value={filters.department || ''} onChange={e => updateFilters({ department: e.target.value })}>
                        <option value="">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-small font-medium mb-2">Course</label>
                    <select className={inputClass} value={filters.selectedCourse || ''} onChange={e => updateFilters({ selectedCourse: e.target.value })}>
                        <option value="">All Courses</option>
                        {courses.map(c => <option key={c.code} value={c.code}>{c.code} {c.name ? `- ${c.name}` : ''}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-small font-medium mb-2">Room</label>
                    <select className={inputClass} value={filters.room || ''} onChange={e => updateFilters({ room: e.target.value })}>
                        <option value="">All Rooms</option>
                        {rooms.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-small font-medium mb-2">Lecturer</label>
                    <select className={inputClass} value={filters.lecturer || ''} onChange={e => updateFilters({ lecturer: e.target.value })}>
                        <option value="">All Lecturers</option>
                        {lecturers.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-small font-medium mb-2">Day</label>
                    <select className={inputClass} value={filters.dayOfWeek || ''} onChange={e => updateFilters({ dayOfWeek: e.target.value })}>
                        <option value="">All Days</option>
                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                <div className="flex items-end gap-2">
                    <button type="button" className="px-4 py-2 rounded-lg bg-[#6731b7] text-white" onClick={() => updateFilters({})}>Apply</button>
                    <button type="button" className="px-4 py-2 rounded-lg border" onClick={() => { resetFilters(); updateFilters({}); }}>Clear</button>
                </div>
            </div>
        </div>
    );
};

export default TimetableFilters;
