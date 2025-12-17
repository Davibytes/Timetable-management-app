import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    icon,
    className = '',
    ...props
}) => {
    const { isDark } = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const baseStyles = isDark
        ? 'w-full px-4 py-3 bg-dark-surface border border-dark-border-subtle rounded-input text-text-dark-primary placeholder:text-text-dark-muted focus-ring-dark transition-smooth'
        : 'w-full px-4 py-3 bg-light-surface border border-light-border-subtle rounded-input text-text-light-primary placeholder:text-text-light-muted focus-ring-light transition-smooth';

    const errorStyles = error
        ? isDark
            ? 'border-semantic-dark-error focus:ring-semantic-dark-error/20'
            : 'border-semantic-light-error focus:ring-semantic-light-error/20'
        : '';

    const labelStyles = isDark
        ? 'block text-small font-medium text-text-dark-primary mb-2'
        : 'block text-small font-medium text-text-light-primary mb-2';

    const errorTextStyles = isDark
        ? 'mt-1 text-caption text-semantic-dark-error'
        : 'mt-1 text-caption text-semantic-light-error';

    return (
        <div className={className}>
            {label && (
                <label htmlFor={name} className={labelStyles}>
                    {label}
                    {required && <span className={isDark ? 'text-semantic-dark-error' : 'text-semantic-light-error'}> *</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <span className={isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}>{icon}</span>
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`${baseStyles} ${errorStyles} ${icon ? 'pl-10' : ''} ${isPassword ? 'pr-12' : ''}`}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-text-dark-muted hover:text-text-dark-primary' : 'text-text-light-muted hover:text-text-light-primary'
                            } transition-smooth`}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>

            {error && <p className={errorTextStyles}>{error}</p>}
        </div>
    );
};

export default Input;