import { useTheme } from '../context/ThemeContext';

const Button = ({
    children,
    variant = 'primary',
    size = 'default',
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const { isDark } = useTheme();

    const baseStyles = 'font-semibold rounded-button transition-smooth inline-flex items-center justify-center gap-2';

    const sizeStyles = {
        small: 'px-4 py-2 text-small',
        default: 'px-6 py-3 text-body',
        large: 'px-8 py-4 text-body-lg',
    };

    const variantStyles = {
        primary: isDark
            ? 'bg-indigo hover:bg-indigo-velvet text-text-dark-primary shadow-primary-dark btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0'
            : 'bg-sage hover:bg-sage-dark text-white shadow-primary-light btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        secondary: isDark
            ? 'border border-dark-border-prominent text-text-dark-secondary hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed'
            : 'border border-light-border-subtle text-text-light-secondary hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed',
        ghost: isDark
            ? 'text-text-dark-secondary hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed'
            : 'text-text-light-secondary hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
            {...props}
        >
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
        </button>
    );
};

export default Button;