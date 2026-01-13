import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Send, Archive, Trash2, Plus, Filter, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTimetable } from '../context/TimetableContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import { canManageContent } from '../utils/rbac';

const TimetableListPage = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const {
        timetables,
        loading,
        fetchTimetables,
        fetchTimetable,
        fetchEntries,
        deleteTimetable,
        publishTimetable,
        unpublishTimetable
    } = useTimetable();

    const canCreate = canManageContent(user);

    const [filters, setFilters] = useState({ department: '', semester: '', status: '' });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadTimetables();
    }, []);

    const loadTimetables = async (params = {}) => {
        try {
            await fetchTimetables(params);
        } catch (err) {
            console.error('Failed to load timetables', err);
            toast.error('Failed to load timetables');
        }
    };

    const departments = useMemo(() => {
        const set = new Set(timetables.map(t => t.department).filter(Boolean));
        return Array.from(set).sort();
    }, [timetables]);

    const handleApplyFilters = async () => {
        const params = {};
        if (filters.department) params.department = filters.department;
        if (filters.semester) params.semester = filters.semester;
        if (filters.status) params.status = filters.status;
        await loadTimetables(params);
    };

    const handleReset = async () => {
        setFilters({ department: '', semester: '', status: '' });
        await loadTimetables();
    };

    const handleView = async (id) => {
        try {
            await fetchTimetable(id);
            await fetchEntries(id);
            navigate(`/timetables/view/${id}`);
        } catch (err) {
            toast.error('Failed to open timetable');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"?`)) return;
        try {
            await deleteTimetable(id);
            toast.success('Timetable deleted');
            await loadTimetables(filters);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete timetable');
        }
    };

    const handlePublish = async (id, name) => {
        if (!window.confirm(`Publish "${name}"? Students will see it.`)) return;
        try {
            await publishTimetable(id);
            toast.success('Timetable published');
            await loadTimetables(filters);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to publish timetable');
        }
    };

    const handleUnpublish = async (id, name) => {
        if (!window.confirm(`Unpublish "${name}"?`)) return;
        try {
            await unpublishTimetable(id);
            toast.success('Timetable unpublished');
            await loadTimetables(filters);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to unpublish timetable');
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

    const hasActiveFilters = filters.department || filters.semester || filters.status;

    return (
        <DashboardLayout title="Timetables">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
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

                    <span className={`text-small ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}`}>
                        {timetables.length} total
                    </span>
                </div>

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

            {/* Collapsible Filters */}
            {showFilters && (
                <div
                    className={`rounded-card p-4 border mb-6 ${isDark
                            ? 'bg-dark-surface border-dark-border-subtle'
                            : 'bg-light-surface border-light-border-subtle'
                        }`}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <Dropdown
                            value={filters.department}
                            onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
                            options={[
                                { value: '', label: 'All departments' },
                                ...departments.map(d => ({ value: d, label: d }))
                            ]}
                        />

                        <Dropdown
                            value={filters.semester}
                            onChange={e => setFilters(f => ({ ...f, semester: e.target.value }))}
                            options={[
                                { value: '', label: 'All semesters' },
                                { value: '1', label: 'Semester 1' },
                                { value: '2', label: 'Semester 2' },
                                { value: '3', label: 'Semester 3' },
                                { value: '4', label: 'Semester 4' }
                            ]}
                        />

                        <Dropdown
                            value={filters.status}
                            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                            options={[
                                { value: '', label: 'All statuses' },
                                { value: 'Draft', label: 'Draft' },
                                { value: 'Published', label: 'Published' },
                                { value: 'Archived', label: 'Archived' }
                            ]}
                        />

                        <div className="flex items-end gap-2">
                            <Button variant="secondary" onClick={handleApplyFilters} fullWidth size="small">
                                Apply
                            </Button>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleReset}
                                    className={`p-2 rounded-button transition-smooth ${isDark
                                            ? 'text-text-dark-muted hover:text-text-dark-primary hover:bg-white/5'
                                            : 'text-text-light-muted hover:text-text-light-primary hover:bg-black/5'
                                        }`}
                                    aria-label="Reset filters"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
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
            ) : timetables.length === 0 ? (
                <div
                    className={`rounded-card p-12 text-center border ${isDark
                            ? 'bg-dark-surface border-dark-border-subtle'
                            : 'bg-light-surface border-light-border-subtle'
                        }`}
                >
                    <h3
                        className={`text-h3 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                            }`}
                    >
                        No timetables
                    </h3>
                    {canCreate && (
                        <Button
                            variant="primary"
                            icon={<Plus className="w-5 h-5" />}
                            onClick={() => navigate('/timetables/generate')}
                            className="mt-4"
                        >
                            Generate Timetable
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {timetables.map(t => (
                        <div
                            key={t._id}
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
                                        {t.name}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-tag text-caption font-medium ${getStatusBadge(t.status)}`}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-small">
                                    <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                        {t.department}
                                    </span>
                                    <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>•</span>
                                    <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                        Semester {t.semester}
                                    </span>
                                </div>
                                <div className="text-small">
                                    <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                        {t.academicYear}
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`flex items-center gap-2 pt-4 border-t ${isDark ? 'border-dark-border-subtle' : 'border-light-border-subtle'
                                    }`}
                            >
                                <button
                                    onClick={() => handleView(t._id)}
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
                                        {t.status === 'Draft' && (
                                            <button
                                                onClick={() => handlePublish(t._id, t.name)}
                                                className={`p-2 rounded-button transition-smooth ${isDark
                                                        ? 'text-text-dark-secondary hover:text-[#4caf50] hover:bg-[#4caf50]/10'
                                                        : 'text-text-light-secondary hover:text-[#2d7a3e] hover:bg-[#2d7a3e]/10'
                                                    }`}
                                                aria-label="Publish timetable"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        )}

                                        {t.status === 'Published' && (
                                            <button
                                                onClick={() => handleUnpublish(t._id, t.name)}
                                                className={`p-2 rounded-button transition-smooth ${isDark
                                                        ? 'text-text-dark-secondary hover:text-[#ff9800] hover:bg-[#ff9800]/10'
                                                        : 'text-text-light-secondary hover:text-[#b8860b] hover:bg-[#b8860b]/10'
                                                    }`}
                                                aria-label="Unpublish timetable"
                                            >
                                                <Archive className="w-4 h-4" />
                                            </button>
                                        )}

                                        {t.status !== 'Published' && (
                                            <button
                                                onClick={() => handleDelete(t._id, t.name)}
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
};

export default TimetableListPage;