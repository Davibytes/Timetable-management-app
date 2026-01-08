import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Send, Archive, Trash2, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTimetable } from '../context/TimetableContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
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
            toast.error('Failed to delete timetable');
        }
    };

    const handlePublish = async (id, name) => {
        if (!window.confirm(`Publish "${name}"? Students will see it.`)) return;
        try {
            await publishTimetable(id);
            toast.success('Timetable published');
            await loadTimetables(filters);
        } catch (err) {
            toast.error('Failed to publish timetable');
        }
    };

    const handleUnpublish = async (id, name) => {
        if (!window.confirm(`Unpublish "${name}"?`)) return;
        try {
            await unpublishTimetable(id);
            toast.success('Timetable unpublished');
            await loadTimetables(filters);
        } catch (err) {
            toast.error('Failed to unpublish timetable');
        }
    };

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
        <DashboardLayout title="Timetables">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-3 border ${isDark ? 'bg-dark-surface border-dark-border-subtle' : 'bg-light-surface border-light-border-subtle'}`}>
                        <Filter className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'} />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={filters.department}
                            onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
                            className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white' : 'bg-white border-[#e8ebe6] text-[#1f2d1f]'}`}
                        >
                            <option value="">All departments</option>
                            {departments.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>

                        <select
                            value={filters.semester}
                            onChange={e => setFilters(f => ({ ...f, semester: e.target.value }))}
                            className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white' : 'bg-white border-[#e8ebe6] text-[#1f2d1f]'}`}
                        >
                            <option value="">All semesters</option>
                            {[1,2,3,4,5,6,7,8].map(s => (
                                <option key={s} value={s}>Semester {s}</option>
                            ))}
                        </select>

                        <select
                            value={filters.status}
                            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                            className={`px-3 py-2 rounded-lg border ${isDark ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white' : 'bg-white border-[#e8ebe6] text-[#1f2d1f]'}`}
                        >
                            <option value="">All statuses</option>
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                            <option value="Archived">Archived</option>
                        </select>

                        <Button variant="secondary" onClick={handleApplyFilters}>Apply</Button>
                        <Button variant="secondary" onClick={handleReset}>Reset</Button>
                    </div>
                </div>

                {canCreate && (
                    <div>
                        <Button variant="primary" onClick={() => navigate('/timetables/generate')}>Generate Timetable</Button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-dark-border-subtle border-t-indigo' : 'border-light-border-subtle border-t-sage'}`} />
                    <p className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>Loading timetables...</p>
                </div>
            ) : timetables.length === 0 ? (
                <div className={`rounded-card p-12 text-center border ${isDark ? 'bg-dark-surface border-dark-border-subtle' : 'bg-light-surface border-light-border-subtle'}`}>
                    <h3 className={isDark ? 'text-text-dark-primary' : 'text-text-light-primary'}>No timetables found</h3>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {timetables.map(t => (
                        <div key={t._id} className={`rounded-card p-6 border ${isDark ? 'bg-dark-surface border-dark-border-subtle' : 'bg-light-surface border-light-border-subtle'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className={isDark ? 'text-text-dark-primary' : 'text-text-light-primary'}>{t.name}</h3>
                                    <span className={`px-3 py-1 rounded-tag text-caption font-medium ${getStatusBadge(t.status)}`}>{t.status}</span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4 text-small">
                                <div><strong className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>Department:</strong> <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>{t.department}</span></div>
                                <div><strong className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>Semester:</strong> <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>Semester {t.semester}</span></div>
                            </div>

                            <div className={`flex items-center gap-2 pt-4 border-t ${isDark ? 'border-dark-border-subtle' : 'border-light-border-subtle'}`}>
                                <button onClick={() => handleView(t._id)} aria-label="View timetable" className={`p-2 rounded-button ${isDark ? 'text-text-dark-secondary hover:text-text-dark-primary hover:bg-white/10' : 'text-text-light-secondary hover:text-text-light-primary hover:bg-black/5'}`}>
                                    <Eye className="w-4 h-4" />
                                </button>

                                {canCreate && (
                                    <>
                                        {t.status === 'Draft' && (
                                            <button onClick={() => handlePublish(t._id, t.name)} aria-label="Publish timetable" className={`p-2 rounded-button ${isDark ? 'text-text-dark-secondary hover:text-[#4caf50] hover:bg-[#4caf50]/10' : 'text-text-light-secondary hover:text-[#2d7a3e] hover:bg-[#2d7a3e]/10'}`}>
                                                <Send className="w-4 h-4" />
                                            </button>
                                        )}

                                        {t.status === 'Published' && (
                                            <button onClick={() => handleUnpublish(t._id, t.name)} aria-label="Unpublish timetable" className={`p-2 rounded-button ${isDark ? 'text-text-dark-secondary hover:text-[#ff9800] hover:bg-[#ff9800]/10' : 'text-text-light-secondary hover:text-[#b8860b] hover:bg-[#b8860b]/10'}`}>
                                                <Archive className="w-4 h-4" />
                                            </button>
                                        )}

                                        {t.status !== 'Published' && (
                                            <button onClick={() => handleDelete(t._id, t.name)} aria-label="Delete timetable" className={`p-2 rounded-button ${isDark ? 'text-text-dark-secondary hover:text-semantic-dark-error hover:bg-semantic-dark-error/10' : 'text-text-light-secondary hover:text-semantic-light-error hover:bg-semantic-light-error/10'}`}>
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
