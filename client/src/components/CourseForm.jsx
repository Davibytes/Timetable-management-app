import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { courseAPI, authAPI } from '../services/api';
import Button from './Button';
import Input from './Input';

const CourseForm = ({ isOpen, onClose, onSuccess, editData = null }) => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [lecturers, setLecturers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        semester: 1,
        credits: 3,
        lecturerId: '',
        duration: 120,
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchLecturers();
            if (editData) {
                setFormData({
                    name: editData.name || '',
                    department: editData.department || '',
                    semester: editData.semester || 1,
                    credits: editData.credits || 3,
                    lecturerId: editData.lecturerId?._id || editData.lecturerId || '',
                    duration: editData.duration || 120,
                    description: editData.description || ''
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editData]);

    const fetchLecturers = async () => {
        try {
            const response = await authAPI.getMe();
            setLecturers([response.data.data.user]);
        } catch (error) {
            console.error('Failed to fetch lecturers:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            department: user?.department || '',
            semester: 1,
            credits: 3,
            lecturerId: user?._id || '',
            duration: 120,
            description: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['semester', 'credits', 'duration'].includes(name) ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editData) {
                await courseAPI.update(editData._id, formData);
            } else {
                await courseAPI.create(formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Course save error:', error);
            alert(error.response?.data?.message || 'Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className={`fixed inset-0 ${isDark ? 'bg-black/85' : 'bg-black/50'} backdrop-blur-nav`}
                onClick={onClose}
            />

            <div
                className={`relative w-full max-w-2xl mx-4 rounded-elevated p-8 animate-scale-in ${isDark
                        ? 'bg-dark-surface border border-dark-border-prominent shadow-modal-dark'
                        : 'bg-light-surface border border-light-border-subtle shadow-modal-light'
                    }`}
            >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-current opacity-20">
                    <h2
                        className={`text-h3 font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                            }`}
                    >
                        {editData ? 'Edit Course' : 'Add New Course'}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-button transition-smooth ${isDark
                                ? 'text-text-dark-muted hover:text-text-dark-primary hover:bg-white/10'
                                : 'text-text-light-muted hover:text-text-light-primary hover:bg-black/5'
                            }`}
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Course Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Introduction to Programming"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Department"
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Computer Science"
                            required
                        />

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

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Credits"
                            type="number"
                            name="credits"
                            value={formData.credits}
                            onChange={handleChange}
                            min={1}
                            max={10}
                            required
                        />

                        <Input
                            label="Duration (minutes)"
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            min={30}
                            max={240}
                            step={30}
                            required
                        />
                    </div>

                    <div>
                        <label
                            className={`block text-small font-medium mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                }`}
                        >
                            Lecturer <span className={isDark ? 'text-semantic-dark-error' : 'text-semantic-light-error'}>*</span>
                        </label>
                        <select
                            name="lecturerId"
                            value={formData.lecturerId}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-input border transition-smooth ${isDark
                                    ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary focus-ring-dark'
                                    : 'bg-light-surface border-light-border-subtle text-text-light-primary focus-ring-light'
                                }`}
                            required
                        >
                            <option value="">Select lecturer</option>
                            {lecturers.map(lecturer => (
                                <option key={lecturer._id} value={lecturer._id}>
                                    {lecturer.firstName} {lecturer.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

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
                            placeholder="Brief course description"
                            rows={3}
                            maxLength={500}
                            className={`w-full px-4 py-3 rounded-input border transition-smooth resize-none ${isDark
                                    ? 'bg-dark-surface border-dark-border-subtle text-text-dark-primary placeholder:text-text-dark-muted focus-ring-dark'
                                    : 'bg-light-surface border-light-border-subtle text-text-light-primary placeholder:text-text-light-muted focus-ring-light'
                                }`}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : editData ? 'Update Course' : 'Create Course'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;