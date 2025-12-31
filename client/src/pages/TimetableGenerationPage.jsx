import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Minus, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTimetable } from '../context/TimetableContext';
import { useToast } from '../components/Toast';
import { courseAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Input from '../components/Input';

const TimetableGenerationPage = () => {
    const { isDark } = useTheme();
    const { createTimetable, loading } = useTimetable();
    const toast = useToast();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        semester: 1,
        academicYear: getCurrentAcademicYear(),
        description: ''
    });
    const [selectedCourses, setSelectedCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    // Get current academic year in format YYYY-YYYY
    function getCurrentAcademicYear() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        if (month >= 10) {
            return `${year}-${year + 1}`;
        } else {
            return `${year - 1}-${year}`;
        }
    }

    const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
            const response = await courseAPI.getAll({ isActive: true });
            setCourses(response.data.data.courses);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoadingCourses(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'semester' ? parseInt(value) : value
        }));
    };

    const handleCourseToggle = (courseId) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.department || !formData.academicYear) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (selectedCourses.length === 0) {
            toast.error('Please select at least one course');
            return;
        }

        try {
            const timetable = await createTimetable({
                ...formData,
                courses: selectedCourses
            });

            toast.success('Timetable created successfully!');
            navigate('/timetables');
        } catch (error) {
            console.error('Failed to create timetable:', error);
            toast.error(error.response?.data?.message || 'Failed to create timetable');
        }
    };

    // Filter courses by selected department and semester
    const filteredCourses = courses.filter(course => {
        const matchesDept = !formData.department || course.department === formData.department;
        const matchesSem = course.semester === formData.semester;
        return matchesDept && matchesSem;
    });

    // Get unique departments from courses
    const departments = [...new Set(courses.map(c => c.department))].sort();

    return (
        <DashboardLayout title="Generate Timetable">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className={`p-2 rounded-button ${isDark ? 'bg-indigo/15 text-indigo-light' : 'bg-sage/10 text-sage'
                                }`}
                        >
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h1
                            className={`text-h2 font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                }`}
                        >
                            Generate New Timetable
                        </h1>
                    </div>
                    <p className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                        Create a new academic timetable by selecting courses and configuring constraints
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div
                        className={`rounded-card p-6 border ${isDark
                                ? 'bg-dark-surface border-dark-border-subtle'
                                : 'bg-light-surface border-light-border-subtle'
                            }`}
                    >
                        <h2
                            className={`text-h4 font-comfortaa font-semibold mb-4 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                }`}
                        >
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <Input
                                label="Timetable Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Software Engineering Semester 2"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className={`block text-small font-medium mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                            }`}
                                    >
                                        Department <span className={isDark ? 'text-semantic-dark-error' : 'text-semantic-light-error'}>*</span>
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-input border transition-smooth ${isDark
                                                ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary focus-ring-dark'
                                                : 'bg-light-surface border-light-border-subtle text-text-light-primary focus-ring-light'
                                            }`}
                                        required
                                    >
                                        <option value="">Select department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        className={`block text-small font-medium mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                            }`}
                                    >
                                        Semester <span className={isDark ? 'text-semantic-dark-error' : 'text-semantic-light-error'}>*</span>
                                    </label>
                                    <select
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-input border transition-smooth ${isDark
                                                ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary focus-ring-dark'
                                                : 'bg-light-surface border-light-border-subtle text-text-light-primary focus-ring-light'
                                            }`}
                                        required
                                    >
                                        <option value={1}>Semester 1</option>
                                        <option value={2}>Semester 2</option>
                                        <option value={3}>Semester 3</option>
                                        <option value={4}>Semester 4</option>
                                    </select>
                                </div>
                            </div>

                            <Input
                                label="Academic Year"
                                type="text"
                                name="academicYear"
                                value={formData.academicYear}
                                onChange={handleChange}
                                placeholder="e.g., 2024-2025"
                                required
                            />

                            <div>
                                <label
                                    className={`block text-small font-medium mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                        }`}
                                >
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Additional notes about this timetable"
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-input border transition-smooth resize-none ${isDark
                                            ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary placeholder:text-text-dark-muted focus-ring-dark'
                                            : 'bg-light-surface border-light-border-subtle text-text-light-primary placeholder:text-text-light-muted focus-ring-light'
                                        }`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Course Selection */}
                    <div
                        className={`rounded-card p-6 border ${isDark
                                ? 'bg-dark-surface border-dark-border-subtle'
                                : 'bg-light-surface border-light-border-subtle'
                            }`}
                    >
                        <h2
                            className={`text-h4 font-comfortaa font-semibold mb-4 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                }`}
                        >
                            Select Courses
                        </h2>

                        {loadingCourses ? (
                            <div className="text-center py-8">
                                <div
                                    className={`w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-2 ${isDark ? 'border-dark-border-subtle border-t-indigo' : 'border-light-border-subtle border-t-sage'
                                        }`}
                                />
                                <p className={`text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                                    Loading courses...
                                </p>
                            </div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="text-center py-8">
                                <p className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                                    {formData.department
                                        ? `No courses available for ${formData.department} - Semester ${formData.semester}`
                                        : 'Please select a department to view available courses'}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className={`text-small mb-4 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                                    {selectedCourses.length} of {filteredCourses.length} courses selected
                                </p>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredCourses.map(course => (
                                        <label
                                            key={course._id}
                                            className={`flex items-center gap-3 p-4 rounded-button border cursor-pointer transition-smooth ${selectedCourses.includes(course._id)
                                                    ? isDark
                                                        ? 'bg-indigo/15 border-indigo text-indigo-light'
                                                        : 'bg-sage/10 border-sage text-sage'
                                                    : isDark
                                                        ? 'bg-dark-elevated border-dark-border-subtle hover:border-dark-border-prominent'
                                                        : 'bg-light-elevated border-light-border-subtle hover:border-light-border-prominent'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCourses.includes(course._id)}
                                                onChange={() => handleCourseToggle(course._id)}
                                                className="w-4 h-4 rounded accent-current"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-body font-medium">
                                                        {course.code}
                                                    </span>
                                                    <span className={`text-caption ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}`}>
                                                        •
                                                    </span>
                                                    <span className="text-small">
                                                        {course.name}
                                                    </span>
                                                </div>
                                                <div className={`text-caption ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}`}>
                                                    {course.credits} credits • {course.duration} minutes
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/timetables')}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading || selectedCourses.length === 0}
                            icon={<ArrowRight className="w-5 h-5" />}
                            iconPosition="right"
                        >
                            {loading ? 'Creating...' : 'Create Timetable'}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default TimetableGenerationPage;