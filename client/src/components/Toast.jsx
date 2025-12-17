import { createContext, useContext, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info'),
        warning: (msg) => addToast(msg, 'warning'),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-md">
                {toasts.map(({ id, message, type }) => (
                    <Toast key={id} message={message} type={type} onClose={() => removeToast(id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, type, onClose }) => {
    const { isDark } = useTheme();

    const containerStyles = isDark
        ? 'min-w-[360px] bg-dark-elevated border border-dark-border-prominent rounded-xl p-4 shadow-dropdown-dark'
        : 'min-w-[360px] bg-light-surface border border-light-border-subtle rounded-xl p-4 shadow-dropdown-light';

    const icons = {
        success: isDark ? (
            <CheckCircle className="w-5 h-5 text-semantic-dark-success flex-shrink-0" />
        ) : (
            <CheckCircle className="w-5 h-5 text-semantic-light-success flex-shrink-0" />
        ),
        error: isDark ? (
            <AlertCircle className="w-5 h-5 text-semantic-dark-error flex-shrink-0" />
        ) : (
            <AlertCircle className="w-5 h-5 text-semantic-light-error flex-shrink-0" />
        ),
        info: isDark ? (
            <Info className="w-5 h-5 text-semantic-dark-info flex-shrink-0" />
        ) : (
            <Info className="w-5 h-5 text-semantic-light-info flex-shrink-0" />
        ),
        warning: isDark ? (
            <AlertTriangle className="w-5 h-5 text-semantic-dark-warning flex-shrink-0" />
        ) : (
            <AlertTriangle className="w-5 h-5 text-semantic-light-warning flex-shrink-0" />
        ),
    };

    const titles = {
        success: 'Success',
        error: 'Error',
        info: 'Info',
        warning: 'Warning',
    };

    return (
        <div className={`${containerStyles} flex items-start gap-3 animate-slide-in-right`}>
            {icons[type]}
            <div className="flex-1">
                <h4
                    className={`text-small font-comfortaa font-semibold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                        }`}
                >
                    {titles[type]}
                </h4>
                <p
                    className={`text-caption ${isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                        }`}
                >
                    {message}
                </p>
            </div>
            <button
                onClick={onClose}
                className={`transition-smooth ${isDark
                        ? 'text-text-dark-muted hover:text-text-dark-primary'
                        : 'text-text-light-muted hover:text-text-light-primary'
                    }`}
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};