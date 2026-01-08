import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTimetable } from '../context/TimetableContext';
import { useToast } from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';
import TimetableGrid from '../components/TimetableGrid';

const TimetableViewPage = () => {
    const { id } = useParams();
    const { isDark } = useTheme();
    const toast = useToast();

    const { currentTimetable, entries, loading, fetchTimetable, fetchEntries } = useTimetable();

    useEffect(() => {
        const load = async () => {
            try {
                if (id) {
                    await fetchTimetable(id);
                    await fetchEntries(id);
                }
            } catch (err) {
                console.error('Failed to load timetable view', err);
                toast.error('Failed to load timetable');
            }
        };
        load();
    }, [id]);

    const getStatusBadge = (status) => {
        const badges = {
            Draft: isDark
                ? 'bg-[#ff9800]/15 text-[#ff9800]'
                : 'bg-[#b8860b]/15 text-[#b8860b]',
            Published: isDark
                ? 'bg-[#4caf50]/15 text-[#4caf50]'
                : 'bg-[#2d7a3e]/15 text-[#2d7a3e]'
        };
        return badges[status] || (isDark ? 'bg-[#808080]/15 text-[#808080]' : 'bg-[#8a9a8f]/15 text-[#8a9a8f]');
    };

    return (
        <DashboardLayout title={currentTimetable?.name || 'Timetable'}>
            <div className="mb-6">
                {currentTimetable && (
                    <div className={`rounded-card p-6 border ${isDark ? 'bg-dark-surface border-dark-border-subtle' : 'bg-light-surface border-light-border-subtle'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className={`text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                                    {currentTimetable.department} • Semester {currentTimetable.semester} • {currentTimetable.academicYear}
                                </div>
                                <div className="mt-2">
                                    <span className={`px-3 py-1 rounded-tag text-caption font-medium ${getStatusBadge(currentTimetable.status)}`}>
                                        {currentTimetable.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-dark-border-subtle border-t-indigo' : 'border-light-border-subtle border-t-sage'}`} />
                    <p className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>Loading timetable...</p>
                </div>
            ) : entries.length === 0 ? (
                <div className={`rounded-card p-12 text-center border ${isDark ? 'bg-dark-surface border-dark-border-subtle' : 'bg-light-surface border-light-border-subtle'}`}>
                    <h3 className={isDark ? 'text-text-dark-primary' : 'text-text-light-primary'}>No sessions scheduled</h3>
                </div>
            ) : (
                <TimetableGrid />
            )}
        </DashboardLayout>
    );
};

export default TimetableViewPage;
