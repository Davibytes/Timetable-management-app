import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-button transition-smooth ${isDark
                    ? 'text-text-dark-secondary hover:bg-white/10'
                    : 'text-text-light-secondary hover:bg-black/5'
                }`}
            aria-label="Toggle theme"
        >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
};

export default ThemeToggle;