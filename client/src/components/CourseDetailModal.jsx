import { X, BookOpen, User, Calendar, Award, Clock, Building } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CourseDetailModal = ({ isOpen, onClose, course }) => {
    const { isDark } = useTheme();

    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={`fixed inset-0 ${isDark ? 'bg-black/85' : 'bg-black/50'} backdrop-blur-nav`}
                onClick={onClose}
            />

            <div
                className={`relative w-full max-w-2xl rounded-elevated p-8 animate-scale-in max-h-[90vh] overflow-y-auto ${isDark
                        ? 'bg-dark-surface border border-dark-border-prominent shadow-modal-dark'
                        : 'bg-light-surface border border-light-border-subtle shadow-modal-light'
                    }`}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-current opacity-20">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className={`p-2 rounded-button ${isDark ? 'bg-indigo/15 text-indigo-light' : 'bg-sage/10 text-sage'
                                    }`}
                            >
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h2
                                    className={`text-h3 font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                        }`}
                                >
                                    {course.code || 'N/A'}
                                </h2>
                                <p
                                    className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                        }`}
                                >
                                    {course.name}
                                </p>
                            </div>
                        </div>
                    </div>
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

                {/* Content */}
                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-6">
                        <InfoItem
                            isDark={isDark}
                            icon={<Building className="w-5 h-5" />}
                            label="Department"
                            value={course.department}
                        />
                        <InfoItem
                            isDark={isDark}
                            icon={<Calendar className="w-5 h-5" />}
                            label="Semester"
                            value={`Semester ${course.semester}`}
                        />
                        <InfoItem
                            isDark={isDark}
                            icon={<Award className="w-5 h-5" />}
                            label="Credits"
                            value={`${course.credits} credits`}
                        />
                        <InfoItem
                            isDark={isDark}
                            icon={<Clock className="w-5 h-5" />}
                            label="Duration"
                            value={`${course.duration} minutes`}
                        />
                    </div>

                    {/* Lecturer Information */}
                    {course.lecturerId && (
                        <div
                            className={`rounded-card p-4 border ${isDark
                                    ? 'bg-dark-elevated border-dark-border-subtle'
                                    : 'bg-light-elevated border-light-border-subtle'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-button ${isDark ? 'bg-dark-canvas' : 'bg-light-canvas'
                                        }`}
                                >
                                    <User className={`w-5 h-5 ${isDark ? 'text-indigo-light' : 'text-sage'}`} />
                                </div>
                                <div>
                                    <p
                                        className={`text-caption ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'
                                            }`}
                                    >
                                        Lecturer
                                    </p>
                                    <p
                                        className={`text-body font-medium ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                            }`}
                                    >
                                        {course.lecturerId.firstName} {course.lecturerId.lastName}
                                    </p>
                                    <p
                                        className={`text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                            }`}
                                    >
                                        {course.lecturerId.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {course.description && (
                        <div>
                            <h3
                                className={`text-body font-medium mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                    }`}
                            >
                                Description
                            </h3>
                            <p
                                className={`text-body leading-relaxed ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                    }`}
                            >
                                {course.description}
                            </p>
                        </div>
                    )}

                    {/* Metadata */}
                    <div
                        className={`rounded-card p-4 border ${isDark
                                ? 'bg-dark-elevated border-dark-border-subtle'
                                : 'bg-light-elevated border-light-border-subtle'
                            }`}
                    >
                        <div className="grid grid-cols-2 gap-4 text-small">
                            <div>
                                <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                    Created:
                                </span>
                                <span
                                    className={`ml-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                        }`}
                                >
                                    {new Date(course.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div>
                                <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>
                                    Updated:
                                </span>
                                <span
                                    className={`ml-2 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                        }`}
                                >
                                    {new Date(course.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ isDark, icon, label, value }) => (
    <div>
        <div className="flex items-center gap-2 mb-1">
            <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>{icon}</span>
            <p className={`text-caption ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}`}>
                {label}
            </p>
        </div>
        <p className={`text-body font-medium ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'}`}>
            {value}
        </p>
    </div>
);

export default CourseDetailModal;