import { Menu, X, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const Navbar = ({ title, onToggleSidebar, isSidebarOpen }) => {
    const { isDark } = useTheme();

    return (
        <header
            className={`sticky top-0 z-30 border-b ${isDark
                    ? 'bg-dark-surface/80 border-dark-border-subtle backdrop-blur-nav'
                    : 'bg-light-surface/80 border-light-border-subtle backdrop-blur-nav'
                }`}
        >
            <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={onToggleSidebar}
                        className={`lg:hidden p-2 rounded-button transition-smooth ${isDark
                                ? 'text-text-dark-secondary hover:bg-white/10'
                                : 'text-text-light-secondary hover:bg-black/5'
                            }`}
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>

                    {/* Page Title */}
                    <h1
                        className={`text-h3 font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                            }`}
                    >
                        {title}
                    </h1>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Notifications Button */}
                    <button
                        className={`p-2.5 rounded-button transition-smooth relative ${isDark
                                ? 'text-text-dark-secondary hover:bg-white/10'
                                : 'text-text-light-secondary hover:bg-black/5'
                            }`}
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {/* Notification Badge */}
                        <span
                            className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${isDark ? 'bg-semantic-dark-error' : 'bg-semantic-light-error'
                                }`}
                        />
                    </button>

                    {/* Theme Toggle */}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Navbar;