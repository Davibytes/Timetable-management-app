import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
    const { isDark } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
    }, [isSidebarCollapsed]);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [children]);

    const handleToggleMobile = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleToggleCollapse = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

    return (
        <div className={`min-h-screen flex ${isDark ? 'bg-dark-canvas' : 'bg-light-canvas'}`}>
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                onToggleMobile={handleToggleMobile}
                onToggleCollapse={handleToggleCollapse}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <Navbar
                    title={title}
                    onToggleSidebar={handleToggleMobile}
                    isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;