import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
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
                : 'bg-[#2d7a3e]/15 text-[#2d7a3e]',
            Archived: isDark
                ? 'bg-[#808080]/15 text-[#808080]'
                : 'bg-[#8a9a8f]/15 text-[#8a9a8f]'
        };
        return badges[status] || badges.Draft;
    };

    return (
        <DashboardLayout title={currentTimetable?.name || 'Timetable'}>
            {/* Back Button */}
            <div className="mb-6">
                <Link
                    to="/timetables"
                    className={`flex items-center gap-2 text-small transition-smooth ${isDark
                            ? 'text-text-dark-secondary hover:text-text-dark-primary'
                            : 'text-text-light-secondary hover:text-text-light-primary'
                        }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
            </div>

            {/* Timetable Info */}
            {currentTimetable && (
                <div
                    className={`rounded-card p-4 border mb-6 ${isDark
                            ? 'bg-dark-surface border-dark-border-subtle'
                            : 'bg-light-surface border-light-border-subtle'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-small">
                            <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                {currentTimetable.department}
                            </span>
                            <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>•</span>
                            <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                Semester {currentTimetable.semester}
                            </span>
                            <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>•</span>
                            <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                {currentTimetable.academicYear}
                            </span>
                        </div>
                        <span className={`px-3 py-1 rounded-tag text-caption font-medium ${getStatusBadge(currentTimetable.status)}`}>
                            {currentTimetable.status}
                        </span>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-16">
                    <div
                        className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-dark-border-subtle border-t-indigo' : 'border-light-border-subtle border-t-sage'
                            }`}
                    />
                    <p className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                        Loading...
                    </p>
                </div>
            ) : entries.length === 0 ? (
                <div
                    className={`rounded-card p-12 text-center border ${isDark
                            ? 'bg-dark-surface border-dark-border-subtle'
                            : 'bg-light-surface border-light-border-subtle'
                        }`}
                >
                    <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-indigo-light' : 'text-sage'}`} />
                    <h3
                        className={`text-h3 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                            }`}
                    >
                        No sessions
                    </h3>
                </div>
            ) : (
                <TimetableGrid />
            )}
        </DashboardLayout>
    );
};

export default TimetableViewPage;