import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, ArrowLeft, Eye, Trash2, Send, Archive } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTimetable } from '../context/TimetableContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { canManageContent } from '../utils/rbac';
import DashboardLayout from '../components/DashboardLayout';
import TimetableGrid from '../components/TimetableGrid';
import Button from '../components/Button';

const TimetablesPage = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const {
        timetables,
        currentTimetable,
        entries,
        loading,
        fetchTimetables,
        fetchTimetable,
        fetchEntries,
        deleteTimetable,
        publishTimetable,
        unpublishTimetable,
        setCurrentTimetable
    } = useTimetable();

    const [selectedTimetableId, setSelectedTimetableId] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

    const canCreate = canManageContent(user);

    useEffect(() => {
        loadTimetables();
    }, []);

    const loadTimetables = async () => {
        try {
            await fetchTimetables();
        } catch (error) {
            console.error('Failed to load timetables:', error);
            toast.error('Failed to load timetables');
        }
    };

    const handleViewTimetable = async (id) => {
        try {
            await fetchTimetable(id);
            await fetchEntries(id);
            setSelectedTimetableId(id);
            setViewMode('grid');
        } catch (error) {
            console.error('Failed to load timetable:', error);
            toast.error('Failed to load timetable details');
        }
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedTimetableId(null);
        setCurrentTimetable(null);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await deleteTimetable(id);
            toast.success('Timetable deleted successfully');
            if (selectedTimetableId === id) {
                handleBackToList();
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete timetable');
        }
    };

    const handlePublish = async (id, name) => {
        if (!window.confirm(`Publish "${name}"? Students will be able to view it.`)) return;

        try {
            await publishTimetable(id);
            toast.success('Timetable published successfully');
            await loadTimetables();
        } catch (error) {
            console.error('Publish error:', error);
            toast.error(error.response?.data?.message || 'Failed to publish timetable');
        }
    };

    const handleUnpublish = async (id, name) => {
        if (!window.confirm(`Unpublish "${name}"? It will return to draft status.`)) return;

        try {
            await unpublishTimetable(id);
            toast.success('Timetable unpublished successfully');
            await loadTimetables();
        } catch (error) {
            console.error('Unpublish error:', error);
            toast.error(error.response?.data?.message || 'Failed to unpublish timetable');
        }
    };

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

    // List View
    if (viewMode === 'list') {
        return (
            <DashboardLayout title="Timetables">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    {canCreate && (
                        <Button
                            variant="primary"
                            icon={<Plus className="w-5 h-5" />}
                            onClick={() => navigate('/timetables/generate')}
                        >
                            Generate Timetable
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div
                            className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-dark-border-subtle border-t-indigo' : 'border-light-border-subtle border-t-sage'
                                }`}
                        />
                        <p className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                            Loading timetables...
                        </p>
                    </div>
                ) : timetables.length === 0 ? (
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
                            No timetables yet
                        </h3>
                        <p
                            className={`text-body max-w-md mx-auto mb-6 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                }`}
                        >
                            {canCreate
                                ? 'Get started by generating your first timetable'
                                : 'No timetables available at the moment'}
                        </p>
                        {canCreate && (
                            <Button
                                variant="primary"
                                icon={<Plus className="w-5 h-5" />}
                                onClick={() => navigate('/timetables/generate')}
                            >
                                Generate Timetable
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {timetables.map(timetable => (
                            <div
                                key={timetable._id}
                                className={`rounded-card p-6 border transition-smooth-300 ${isDark
                                    ? 'bg-dark-surface border-dark-border-subtle shadow-card-dark card-hover-dark'
                                    : 'bg-light-surface border-light-border-subtle shadow-card-light card-hover-light'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className={`text-h4 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                                }`}
                                        >
                                            {timetable.name}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-tag text-caption font-medium ${getStatusBadge(timetable.status)}`}
                                        >
                                            {timetable.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-small">
                                        <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                            Department:
                                        </span>
                                        <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                            {timetable.department}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-small">
                                        <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                            Semester:
                                        </span>
                                        <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                            Semester {timetable.semester}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-small">
                                        <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                            Academic Year:
                                        </span>
                                        <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                            {timetable.academicYear}
                                        </span>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-2 pt-4 border-t ${isDark ? 'border-dark-border-subtle' : 'border-light-border-subtle'
                                    }`}>
                                    <button
                                        onClick={() => handleViewTimetable(timetable._id)}
                                        className={`p-2 rounded-button transition-smooth ${isDark
                                            ? 'text-text-dark-secondary hover:text-text-dark-primary hover:bg-white/10'
                                            : 'text-text-light-secondary hover:text-text-light-primary hover:bg-black/5'
                                            }`}
                                        aria-label="View timetable"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>

                                    {canCreate && (
                                        <>
                                            {timetable.status === 'Draft' && (
                                                <button
                                                    onClick={() => handlePublish(timetable._id, timetable.name)}
                                                    className={`p-2 rounded-button transition-smooth ${isDark
                                                        ? 'text-text-dark-secondary hover:text-[#4caf50] hover:bg-[#4caf50]/10'
                                                        : 'text-text-light-secondary hover:text-[#2d7a3e] hover:bg-[#2d7a3e]/10'
                                                        }`}
                                                    aria-label="Publish timetable"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            )}

                                            {timetable.status === 'Published' && (
                                                <button
                                                    onClick={() => handleUnpublish(timetable._id, timetable.name)}
                                                    className={`p-2 rounded-button transition-smooth ${isDark
                                                        ? 'text-text-dark-secondary hover:text-[#ff9800] hover:bg-[#ff9800]/10'
                                                        : 'text-text-light-secondary hover:text-[#b8860b] hover:bg-[#b8860b]/10'
                                                        }`}
                                                    aria-label="Unpublish timetable"
                                                >
                                                    <Archive className="w-4 h-4" />
                                                </button>
                                            )}

                                            {timetable.status !== 'Published' && (
                                                <button
                                                    onClick={() => handleDelete(timetable._id, timetable.name)}
                                                    className={`p-2 rounded-button transition-smooth ${isDark
                                                        ? 'text-text-dark-secondary hover:text-semantic-dark-error hover:bg-semantic-dark-error/10'
                                                        : 'text-text-light-secondary hover:text-semantic-light-error hover:bg-semantic-light-error/10'
                                                        }`}
                                                    aria-label="Delete timetable"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DashboardLayout>
        );
    }

    // Grid View
    return (
        <DashboardLayout title={currentTimetable?.name || 'Timetable'}>
            <div className="mb-6">
                <button
                    onClick={handleBackToList}
                    className={`flex items-center gap-2 text-small transition-smooth mb-4 ${isDark
                        ? 'text-text-dark-secondary hover:text-text-dark-primary'
                        : 'text-text-light-secondary hover:text-text-light-primary'
                        }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Timetables
                </button>

                {currentTimetable && (
                    <div
                        className={`rounded-card p-6 border mb-6 ${isDark
                            ? 'bg-dark-surface border-dark-border-subtle'
                            : 'bg-light-surface border-light-border-subtle'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-4 text-small">
                                    <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                        {currentTimetable.department} • Semester {currentTimetable.semester} • {currentTimetable.academicYear}
                                    </span>
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
                    <div
                        className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-dark-border-subtle border-t-indigo' : 'border-light-border-subtle border-t-sage'
                            }`}
                    />
                    <p className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                        Loading timetable...
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
                        No sessions scheduled
                    </h3>
                    <p
                        className={`text-body max-w-md mx-auto ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                            }`}
                    >
                        This timetable doesn't have any sessions yet
                    </p>
                </div>
            ) : (
                <TimetableGrid />
            )}
        </DashboardLayout>
    );
};

export default TimetablesPage;