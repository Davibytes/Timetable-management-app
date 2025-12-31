import { Calendar, Clock, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../components/DashboardLayout';

const DashboardPage = () => {
    const { user } = useAuth();
    const { isDark } = useTheme();

    const getRoleBadge = (role) => {
        const badges = {
            admin: isDark
                ? 'bg-indigo/15 text-indigo-light border-indigo/30'
                : 'bg-sage/10 text-sage border-sage/30',
            lecturer: isDark
                ? 'bg-indigo/15 text-indigo-light border-indigo/30'
                : 'bg-sage/10 text-sage border-sage/30',
            student: isDark
                ? 'bg-indigo/15 text-indigo-light border-indigo/30'
                : 'bg-sage/10 text-sage border-sage/30'
        };
        return badges[role] || badges.student;
    };

    return (
        <DashboardLayout title="Dashboard">
            {/* Welcome Section */}
            <div className="mb-8 sm:mb-12">
                <h2
                    className={`text-3xl sm:text-4xl lg:text-h1 font-comfortaa font-bold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                        }`}
                >
                    Welcome back, {user?.firstName}!
                </h2>
                <p
                    className={`text-small sm:text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                        }`}
                >
                    Manage your academic schedules efficiently
                </p>
            </div>

            {/* User Info Card */}
            <div
                className={`rounded-card p-6 sm:p-8 mb-6 sm:mb-8 border ${isDark
                        ? 'bg-dark-surface border-dark-border-subtle shadow-card-dark'
                        : 'bg-light-surface border-light-border-subtle shadow-card-light'
                    }`}
            >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-dark-canvas' : 'bg-light-canvas'
                                }`}
                        >
                            <span
                                className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-indigo-light' : 'text-sage'
                                    }`}
                            >
                                {user?.firstName?.charAt(0)}
                                {user?.lastName?.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h2
                                className={`text-xl sm:text-h3 font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                    }`}
                            >
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <p
                                className={`text-caption sm:text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                    }`}
                            >
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <span
                        className={`px-3 sm:px-4 py-2 rounded-button text-caption sm:text-small font-medium border self-start ${getRoleBadge(
                            user?.role
                        )}`}
                    >
                        {user?.role?.toUpperCase()}
                    </span>
                </div>

                {user?.department && (
                    <div
                        className={`pt-4 sm:pt-6 border-t ${isDark ? 'border-dark-border-subtle' : 'border-light-border-subtle'
                            }`}
                    >
                        <p
                            className={`text-caption sm:text-small mb-1 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                }`}
                        >
                            Department
                        </p>
                        <p
                            className={`text-small sm:text-body font-medium ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                }`}
                        >
                            {user.department}
                        </p>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <StatCard
                    isDark={isDark}
                    icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6" />}
                    title="Timetables"
                    value="0"
                    description="Active schedules"
                />
                <StatCard
                    isDark={isDark}
                    icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />}
                    title="Sessions"
                    value="0"
                    description="This week"
                />
                <StatCard
                    isDark={isDark}
                    icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
                    title="Courses"
                    value="0"
                    description="Enrolled"
                />
            </div>

            {/* Coming Soon Section */}
            <div
                className={`rounded-card p-8 sm:p-12 text-center border ${isDark
                        ? 'bg-dark-surface border-dark-border-subtle'
                        : 'bg-light-surface border-light-border-subtle'
                    }`}
            >
                <Calendar
                    className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${isDark ? 'text-indigo-light' : 'text-sage'
                        }`}
                />
                <h3
                    className={`text-xl sm:text-h3 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                        }`}
                >
                    Full Dashboard Coming Soon
                </h3>
                <p
                    className={`text-small sm:text-body max-w-md mx-auto ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                        }`}
                >
                    Timetable management, conflict detection, and scheduling features are under
                    development.
                </p>
            </div>
        </DashboardLayout>
    );
};

// Stat Card Component
const StatCard = ({ isDark, icon, title, value, description }) => (
    <div
        className={`rounded-card p-4 sm:p-6 border transition-smooth-300 ${isDark
                ? 'bg-dark-surface border-dark-border-subtle shadow-card-dark card-hover-dark'
                : 'bg-light-surface border-light-border-subtle shadow-card-light card-hover-light'
            }`}
    >
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className={isDark ? 'text-indigo-light' : 'text-sage'}>{icon}</div>
            <h3
                className={`text-body sm:text-body-lg font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                    }`}
            >
                {title}
            </h3>
        </div>
        <p
            className={`text-3xl sm:text-4xl lg:text-hero font-comfortaa font-bold mb-1 leading-tight ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                }`}
        >
            {value}
        </p>
        <p
            className={`text-caption sm:text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                }`}
        >
            {description}
        </p>
    </div>
);

export default DashboardPage;