import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    LogOut,
    User,
    Clock,
    BookOpen,
    LayoutDashboard,
    DoorOpen,
    Settings,
    Menu,
    X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import ChronosLogo from '../components/ChronosLogo';
import ThemeToggle from '../components/ThemeToggle';
import Button from '../components/Button';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { isDark } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        toast.info('Logged out successfully');
        navigate('/login');
    };

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
                : 'bg-sage/10 text-sage border-sage/30',
        };
        return badges[role] || badges.student;
    };

    return (
        <div className={`min-h-screen flex ${isDark ? 'bg-dark-canvas' : 'bg-light-canvas'}`}>
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 border-r transition-transform duration-300 ${isDark
                        ? 'bg-dark-canvas border-dark-border-subtle'
                        : 'bg-light-canvas border-light-border-subtle'
                    } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-dark-border-subtle">
                        <ChronosLogo />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        <SidebarItem
                            isDark={isDark}
                            icon={<LayoutDashboard className="w-5 h-5" />}
                            label="Dashboard"
                            active={true}
                        />
                        <SidebarItem
                            isDark={isDark}
                            icon={<BookOpen className="w-5 h-5" />}
                            label="Courses"
                            active={false}
                        />
                        <SidebarItem
                            isDark={isDark}
                            icon={<DoorOpen className="w-5 h-5" />}
                            label="Rooms"
                            active={false}
                        />
                        <SidebarItem
                            isDark={isDark}
                            icon={<Calendar className="w-5 h-5" />}
                            label="Timetables"
                            active={false}
                        />
                        <SidebarItem
                            isDark={isDark}
                            icon={<Settings className="w-5 h-5" />}
                            label="Settings"
                            active={false}
                        />
                    </nav>

                    {/* User Section */}
                    <div
                        className={`p-4 border-t ${isDark ? 'border-dark-border-subtle' : 'border-light-border-subtle'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-dark-elevated' : 'bg-light-elevated'
                                    }`}
                            >
                                <User
                                    className={`w-5 h-5 ${isDark ? 'text-indigo-light' : 'text-sage'
                                        }`}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-small font-medium truncate ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                        }`}
                                >
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p
                                    className={`text-caption truncate ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'
                                        }`}
                                >
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            size="small"
                            fullWidth
                            icon={<LogOut className="w-4 h-4" />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header
                    className={`sticky top-0 z-30 border-b ${isDark
                            ? 'bg-dark-surface/80 border-dark-border-subtle backdrop-blur-nav'
                            : 'bg-light-surface/80 border-light-border-subtle backdrop-blur-nav'
                        }`}
                >
                    <div className="px-6 py-4 flex justify-between items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`lg:hidden p-2 rounded-button ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                                }`}
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>

                        <div className="hidden lg:block">
                            <h1
                                className={`text-h3 font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                    }`}
                            >
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-12">
                    {/* Welcome Section */}
                    <div className="mb-12">
                        <h2
                            className={`text-h1 font-comfortaa font-bold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                }`}
                        >
                            Welcome back, {user?.firstName}!
                        </h2>
                        <p
                            className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                }`}
                        >
                            Manage your academic schedules efficiently
                        </p>
                    </div>

                    {/* User Info Card */}
                    <div
                        className={`rounded-card p-8 mb-8 border ${isDark
                                ? 'bg-dark-surface border-dark-border-subtle shadow-card-dark'
                                : 'bg-light-surface border-light-border-subtle shadow-card-light'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-dark-canvas' : 'bg-light-canvas'
                                        }`}
                                >
                                    <User
                                        className={`w-8 h-8 ${isDark ? 'text-indigo-light' : 'text-sage'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <h2
                                        className={`text-h3 font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                            }`}
                                    >
                                        {user?.firstName} {user?.lastName}
                                    </h2>
                                    <p
                                        className={`text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                            }`}
                                    >
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`px-4 py-2 rounded-button text-small font-medium border ${getRoleBadge(
                                    user?.role
                                )}`}
                            >
                                {user?.role?.toUpperCase()}
                            </span>
                        </div>

                        {user?.department && (
                            <div
                                className={`pt-6 border-t ${isDark ? 'border-dark-border-subtle' : 'border-light-border-subtle'
                                    }`}
                            >
                                <p
                                    className={`text-small mb-1 ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                        }`}
                                >
                                    Department
                                </p>
                                <p
                                    className={`text-body font-medium ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                        }`}
                                >
                                    {user.department}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            isDark={isDark}
                            icon={<Calendar className="w-6 h-6" />}
                            title="Timetables"
                            value="0"
                            description="Active schedules"
                        />
                        <StatCard
                            isDark={isDark}
                            icon={<Clock className="w-6 h-6" />}
                            title="Sessions"
                            value="0"
                            description="This week"
                        />
                        <StatCard
                            isDark={isDark}
                            icon={<BookOpen className="w-6 h-6" />}
                            title="Courses"
                            value="0"
                            description="Enrolled"
                        />
                    </div>

                    {/* Coming Soon Section */}
                    <div
                        className={`rounded-card p-12 text-center border ${isDark
                                ? 'bg-dark-surface border-dark-border-subtle'
                                : 'bg-light-surface border-light-border-subtle'
                            }`}
                    >
                        <Calendar
                            className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-indigo-light' : 'text-sage'
                                }`}
                        />
                        <h3
                            className={`text-h3 font-comfortaa font-semibold mb-2 ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                                }`}
                        >
                            Full Dashboard Coming Soon
                        </h3>
                        <p
                            className={`text-body max-w-md mx-auto ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                                }`}
                        >
                            Timetable management, conflict detection, and scheduling features are under development.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Sidebar Item Component
const SidebarItem = ({ isDark, icon, label, active }) => (
    <button
        className={`w-full px-4 py-3 rounded-button flex items-center gap-3 text-small font-medium transition-smooth ${active
                ? isDark
                    ? 'bg-indigo/15 text-indigo-light border-l-2 border-indigo'
                    : 'bg-sage/10 text-sage border-l-2 border-sage'
                : isDark
                    ? 'text-text-dark-secondary hover:bg-white/5'
                    : 'text-text-light-secondary hover:bg-black/5'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

// Stat Card Component
const StatCard = ({ isDark, icon, title, value, description }) => (
    <div
        className={`rounded-card p-6 border transition-smooth-300 ${isDark
                ? 'bg-dark-surface border-dark-border-subtle shadow-card-dark card-hover-dark'
                : 'bg-light-surface border-light-border-subtle shadow-card-light card-hover-light'
            }`}
    >
        <div className="flex items-center gap-3 mb-4">
            <div className={isDark ? 'text-indigo-light' : 'text-sage'}>{icon}</div>
            <h3
                className={`text-body-lg font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                    }`}
            >
                {title}
            </h3>
        </div>
        <p
            className={`text-hero font-comfortaa font-bold mb-1 leading-hero ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                }`}
        >
            {value}
        </p>
        <p
            className={`text-small ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                }`}
        >
            {description}
        </p>
    </div>
);

export default DashboardPage;