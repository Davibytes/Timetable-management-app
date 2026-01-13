import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTimetable } from '../context/TimetableContext';
import { useToast } from '../components/Toast';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';

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
            await createTimetable(formData);
            toast.success('Timetable created successfully!');
            navigate('/timetables');
        } catch (error) {
            console.error('Failed to create timetable:', error);
            toast.error(error.response?.data?.message || 'Failed to create timetable');
        }
    };

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
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div
                        className={`rounded-card p-6 border ${isDark
                                ? 'bg-dark-surface border-dark-border-subtle'
                                : 'bg-light-surface border-light-border-subtle'
                            }`}
                    >
                        <div className="space-y-4">
                            <Input
                                label="Timetable Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Software Engineering Sem 2 2024-2025"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Dropdown
                                    label="Department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    options={[
                                        { value: '', label: 'Select department' },
                                        ...departments.map(d => ({ value: d, label: d }))
                                    ]}
                                    placeholder="Select department"
                                    required
                                />

                                <Dropdown
                                    label="Semester"
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleChange}
                                    options={[
                                        { value: 1, label: 'Semester 1' },
                                        { value: 2, label: 'Semester 2' },
                                        { value: 3, label: 'Semester 3' },
                                        { value: 4, label: 'Semester 4' }
                                    ]}
                                    required
                                />
                            </div>

                            <Input
                                label="Academic Year"
                                type="text"
                                name="academicYear"
                                value={formData.academicYear}
                                onChange={handleChange}
                                placeholder="2024-2025"
                                required
                            />

                            <div>
                                <label
                                    className={`block text-small font-medium mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                        }`}
                                >
                                    Description (optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Additional notes"
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-input border transition-smooth resize-none ${isDark
                                            ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary placeholder:text-text-dark-muted focus-ring-dark'
                                            : 'bg-light-surface border-light-border-subtle text-text-light-primary placeholder:text-text-light-muted focus-ring-light'
                                        }`}
                                />
                            </div>
                        </div>
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