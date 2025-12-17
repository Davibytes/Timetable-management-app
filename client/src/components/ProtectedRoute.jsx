import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const { isDark } = useTheme();

    if (loading) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-dark-canvas' : 'bg-light-canvas'
                    }`}
            >
                <div className="text-center">
                    <div
                        className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${isDark
                                ? 'border-dark-border-subtle border-t-indigo'
                                : 'border-light-border-subtle border-t-sage'
                            }`}
                    ></div>
                    <p
                        className={`text-body ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                            }`}
                    >
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;