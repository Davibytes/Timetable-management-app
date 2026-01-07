import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { courseAPI } from '../services/api';
import { canManageContent, canEditCourse } from '../utils/rbac';
import DashboardLayout from '../components/DashboardLayout';
import CourseForm from '../components/CourseForm';
import CourseDetailModal from '../components/CourseDetailModal';
import Button from '../components/Button';

const CoursesPage = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const toast = useToast();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const canCreate = canManageContent(user);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await courseAPI.getAll();
            setCourses(response.data.data.courses);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await courseAPI.delete(id);
            toast.success('Course deleted successfully');
            fetchCourses();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete course');
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setIsFormOpen(true);
    };

    const handleViewDetails = (course) => {
        setSelectedCourse(course);
        setIsDetailOpen(true);
    };

    const handleFormSuccess = () => {
        toast.success(editingCourse ? 'Course updated successfully' : 'Course created successfully');
        setEditingCourse(null);
        fetchCourses();
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="Courses">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                {canCreate && (
                    <Button
                        variant="primary"
                        icon={<Plus className="w-5 h-5" />}
                        onClick={() => {
                            setEditingCourse(null);
                            setIsFormOpen(true);
                        }}
                    >
                        Add Course
                    </Button>
                )}
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'
                            }`}
                    />
                    <input
                        type="text"
                        placeholder="Search courses by name, code, or department"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-input border transition-smooth ${isDark
                                ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary placeholder:text-text-dark-muted focus-ring-dark'
                                : 'bg-light-surface border-light-border-subtle text-text-light-primary placeholder:text-text-light-muted focus-ring-light'
                            }`}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <div
                        className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-dark-border-subtle border-t-indigo' : 'border-light-border-subtle border-t-sage'
                            }`}
                    />
                    <p className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                        Loading courses...
                    </p>
                </div>
            ) : filteredCourses.length === 0 ? (
                <div
                    className={`rounded-card p-12 text-center border ${isDark
                            ? 'bg-dark-surface border-dark-border-subtle'
                            : 'bg-light-surface border-light-border-subtle'
                        }`}
                >
                    <BookOpen className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-indigo-light' : 'text-sage'}`} />
                    <h3
                        className={`text-h3 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                            }`}
                    >
                        {searchTerm ? 'No courses found' : 'No courses yet'}
                    </h3>
                    <p
                        className={`text-body max-w-md mx-auto mb-6 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                            }`}
                    >
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : canCreate
                                ? 'Get started by adding your first course'
                                : 'No courses available at the moment'}
                    </p>
                    {!searchTerm && canCreate && (
                        <Button
                            variant="primary"
                            icon={<Plus className="w-5 h-5" />}
                            onClick={() => {
                                setEditingCourse(null);
                                setIsFormOpen(true);
                            }}
                        >
                            Add Course
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => {
                        const canEdit = canEditCourse(user, course);
                        const showActions = canEdit;

                        return (
                            <div
                                key={course._id}
                                className={`rounded-card p-6 border transition-smooth-300 cursor-pointer ${isDark
                                        ? 'bg-dark-surface border-dark-border-subtle shadow-card-dark card-hover-dark'
                                        : 'bg-light-surface border-light-border-subtle shadow-card-light card-hover-light'
                                    }`}
                                onClick={() => handleViewDetails(course)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className={`text-h4 font-comfortaa font-semibold mb-1 truncate ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                                }`}
                                        >
                                            {course.code || 'N/A'}
                                        </h3>
                                        <p
                                            className={`text-body mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                                }`}
                                        >
                                            {course.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-small">
                                        <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                            Department:
                                        </span>
                                        <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                            {course.department}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-small">
                                        <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                            Semester:
                                        </span>
                                        <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                            {course.semester}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-small">
                                        <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                            Credits:
                                        </span>
                                        <span className={isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}>
                                            {course.credits}
                                        </span>
                                    </div>
                                </div>

                                {showActions && (
                                    <div className="flex items-center gap-2 pt-4 border-t border-current opacity-20">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(course);
                                            }}
                                            className={`p-2 rounded-button transition-smooth ${isDark
                                                    ? 'text-text-dark-secondary hover:text-text-dark-primary hover:bg-white/10'
                                                    : 'text-text-light-secondary hover:text-text-light-primary hover:bg-black/5'
                                                }`}
                                            aria-label="Edit course"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(course._id, course.name);
                                            }}
                                            className={`p-2 rounded-button transition-smooth ${isDark
                                                    ? 'text-text-dark-secondary hover:text-semantic-dark-error hover:bg-semantic-dark-error/10'
                                                    : 'text-text-light-secondary hover:text-semantic-light-error hover:bg-semantic-light-error/10'
                                                }`}
                                            aria-label="Delete course"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {canCreate && (
                <CourseForm
                    isOpen={isFormOpen}
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingCourse(null);
                    }}
                    onSuccess={handleFormSuccess}
                    editData={editingCourse}
                />
            )}

            <CourseDetailModal
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedCourse(null);
                }}
                course={selectedCourse}
            />
        </DashboardLayout>
    );
};

export default CoursesPage;