import { ChevronLeft, LayoutDashboard, BookOpen, DoorOpen, Calendar, Settings, LogOut, User, Users, BarChart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getNavigationItems } from '../utils/rbac';
import ChronosLogo from '../components/ChronosLogo';
import Button from '../components/Button';

const ICON_MAP = {
    LayoutDashboard,
    BookOpen,
    DoorOpen,
    Calendar,
    Users,
    BarChart,
    Settings
};

const Sidebar = ({ isOpen, isCollapsed, onToggleMobile, onToggleCollapse }) => {
    const { isDark } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const handleLogout = async () => {
        await logout();
        toast.info('Logged out successfully');
        navigate('/login');
    };

    const navigationItems = getNavigationItems(user);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
                    onClick={onToggleMobile}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 border-r transition-all duration-300 ${isDark
                        ? 'bg-dark-canvas border-dark-border-subtle'
                        : 'bg-light-canvas border-light-border-subtle'
                    } ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 ${isCollapsed ? 'lg:w-20' : 'lg:w-72'
                    } w-72`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-dark-border-subtle' : 'border-light-border-subtle'
                        }`}>
                        <div className={`transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                            }`}>
                            <ChronosLogo />
                        </div>

                        {/* Collapse Button - Desktop Only */}
                        <button
                            onClick={onToggleCollapse}
                            className={`hidden lg:block p-2 rounded-button transition-smooth ${isDark
                                    ? 'text-text-dark-secondary hover:bg-white/10'
                                    : 'text-text-light-secondary hover:bg-black/5'
                                } ${isCollapsed ? 'mx-auto' : ''}`}
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <ChevronLeft
                                className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigationItems.map((item) => {
                            const Icon = ICON_MAP[item.icon];
                            const isActive = location.pathname === item.path;

                            return (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        if (window.innerWidth < 1024) {
                                            onToggleMobile();
                                        }
                                    }}
                                    className={`w-full px-4 py-3 rounded-button flex items-center gap-3 text-small font-medium transition-smooth ${isActive
                                            ? isDark
                                                ? 'bg-indigo/15 text-indigo-light border-l-2 border-indigo'
                                                : 'bg-sage/10 text-sage border-l-2 border-sage'
                                            : isDark
                                                ? 'text-text-dark-secondary hover:bg-white/5'
                                                : 'text-text-light-secondary hover:bg-black/5'
                                        } ${isCollapsed ? 'lg:justify-center' : ''}`}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span
                                        className={`transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div
                        className={`p-4 border-t ${isDark ? 'border-dark-border-subtle' : 'border-light-border-subtle'
                            }`}
                    >
                        <div
                            className={`flex items-center gap-3 mb-3 ${isCollapsed ? 'lg:flex-col lg:gap-2' : ''
                                }`}
                        >
                            <div
                                className={`flex items-center justify-center flex-shrink-0 rounded-full ${isDark ? 'bg-dark-elevated' : 'bg-light-elevated'
                                    } ${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'}`}
                            >
                                <User
                                    className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'} ${isDark ? 'text-indigo-light' : 'text-sage'
                                        }`}
                                />
                            </div>
                            <div
                                className={`flex-1 min-w-0 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                                    }`}
                            >
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
                                    {user?.role?.toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            size="small"
                            fullWidth={!isCollapsed}
                            icon={<LogOut className="w-4 h-4" />}
                            iconPosition={isCollapsed ? 'left' : 'left'}
                            onClick={handleLogout}
                            className={isCollapsed ? 'lg:w-full lg:justify-center' : ''}
                        >
                            <span
                                className={`transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                                    }`}
                            >
                                Logout
                            </span>
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;