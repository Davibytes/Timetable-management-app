import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTimetable } from '../context/TimetableContext';
import { useToast } from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Input from '../components/Input';

const TimetableGenerationPage = () => {
    const { isDark } = useTheme();
    const { createTimetable, loading } = useTimetable();
    const toast = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        department: '',
        semester: 1,
        academicYear: getCurrentAcademicYear(),
        description: ''
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'semester' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.department || !formData.academicYear) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const timetable = await createTimetable(formData);
            toast.success('Timetable created successfully! You can now add sessions.');
            navigate('/timetables');
        } catch (error) {
            console.error('Failed to create timetable:', error);
            toast.error(error.response?.data?.message || 'Failed to create timetable');
        }
    };

    // Get unique departments - hardcoded common ones
    const departments = [
        'Computer Science',
        'Software Engineering',
        'Information Technology',
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Engineering',
        'Business Administration'
    ];

    return (
        <DashboardLayout title="Generate Timetable">
            <div className="max-w-2xl mx-auto">
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
                            Create New Timetable
                        </h1>
                    </div>
                    <p className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                        Create a new timetable framework. You'll be able to add sessions after creation.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                placeholder="e.g., Software Engineering Semester 2 2024-2025"
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
                                    placeholder="Additional notes about this timetable (optional)"
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-input border transition-smooth resize-none ${isDark
                                        ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary placeholder:text-text-dark-muted focus-ring-dark'
                                        : 'bg-light-surface border-light-border-subtle text-text-light-primary placeholder:text-text-light-muted focus-ring-light'
                                        }`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div
                        className={`rounded-card p-4 border ${isDark
                            ? 'bg-[#2196f3]/10 border-[#2196f3]/20'
                            : 'bg-[#2563a8]/10 border-[#2563a8]/20'
                            }`}
                    >
                        <p className={`text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                            After creating the timetable, you'll need to manually add sessions by going to the timetable view.
                            Sessions can be added by selecting courses, rooms, lecturers, and time slots.
                        </p>
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
                            disabled={loading}
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