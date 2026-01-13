import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Dropdown = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select option',
    required = false,
    disabled = false,
    error,
    className = '',
    ...props
}) => {
    const { isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue, name: props.name } });
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    const labelStyles = isDark
        ? 'block text-small font-medium text-text-dark-primary mb-2'
        : 'block text-small font-medium text-text-light-primary mb-2';

    const buttonStyles = isDark
        ? 'w-full px-4 py-3 bg-dark-surface border border-dark-border-subtle rounded-input text-text-dark-primary focus-ring-dark transition-smooth text-left flex items-center justify-between'
        : 'w-full px-4 py-3 bg-light-surface border border-light-border-subtle rounded-input text-text-light-primary focus-ring-light transition-smooth text-left flex items-center justify-between';

    const errorStyles = error
        ? isDark
            ? 'border-semantic-dark-error focus:ring-semantic-dark-error/20'
            : 'border-semantic-light-error focus:ring-semantic-light-error/20'
        : '';

    const dropdownMenuStyles = isDark
        ? 'absolute z-50 w-full mt-2 bg-dark-elevated border border-dark-border-prominent rounded-input shadow-dropdown-dark max-h-60 overflow-y-auto'
        : 'absolute z-50 w-full mt-2 bg-light-surface border border-light-border-subtle rounded-input shadow-dropdown-light max-h-60 overflow-y-auto';

    const optionStyles = (isSelected) => isDark
        ? `px-4 py-3 cursor-pointer transition-smooth flex items-center justify-between ${isSelected ? 'bg-indigo/15 text-indigo-light' : 'text-text-dark-secondary hover:bg-white/5'}`
        : `px-4 py-3 cursor-pointer transition-smooth flex items-center justify-between ${isSelected ? 'bg-sage/10 text-sage' : 'text-text-light-secondary hover:bg-black/5'}`;

    const errorTextStyles = isDark
        ? 'mt-1 text-caption text-semantic-dark-error'
        : 'mt-1 text-caption text-semantic-light-error';

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className={labelStyles}>
                    {label}
                    {required && <span className={isDark ? 'text-semantic-dark-error' : 'text-semantic-light-error'}> *</span>}
                </label>
            )}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`${buttonStyles} ${errorStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={!selectedOption ? (isDark ? 'text-text-dark-muted' : 'text-text-light-muted') : ''}>
                    {displayText}
                </span>
                <ChevronDown
                    className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}`}
                />
            </button>

            {isOpen && (
                <div className={dropdownMenuStyles} role="listbox">
                    {options.length === 0 ? (
                        <div className={`px-4 py-3 text-small ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'}`}>
                            No options available
                        </div>
                    ) : (
                        options.map((option) => {
                            const isSelected = option.value === value;
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={optionStyles(isSelected)}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    <span className="text-small">{option.label}</span>
                                    {isSelected && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {error && <p className={errorTextStyles}>{error}</p>}
        </div>
    );
};

export default Dropdown;