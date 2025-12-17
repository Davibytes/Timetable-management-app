import { useTheme } from '../context/ThemeContext';

const ChronosLogo = ({ size = 'default', showTagline = false }) => {
    const { isDark } = useTheme();

    const sizes = {
        small: { grid: 'w-8 h-5', text: 'text-lg', tagline: 'text-xs' },
        default: { grid: 'w-10 h-6', text: 'text-2xl', tagline: 'text-small' },
        large: { grid: 'w-16 h-10', text: 'text-4xl', tagline: 'text-body' },
        hero: { grid: 'w-20 h-12', text: 'text-5xl', tagline: 'text-body-lg' },
    };

    const { grid, text, tagline } = sizes[size] || sizes.default;

    // Dark mode colors
    const darkColors = {
        primary: 'bg-[#6731b7]',
        secondary: 'bg-[#c3c3c3]',
        tertiary: 'bg-white',
    };

    // Light mode colors
    const lightColors = {
        primary: 'bg-[#5a7a5f]',
        secondary: 'bg-[#7591a3]',
        tertiary: 'bg-[#1f2d1f]',
    };

    const colors = isDark ? darkColors : lightColors;

    return (
        <div className="flex flex-col items-center gap-3">
            {/* 5x3 Grid Pattern */}
            <div className={`grid grid-cols-5 gap-0.5 ${grid}`}>
                {/* Row 1 */}
                <div className={`${colors.primary} rounded-sm`}></div>
                <div className={`${colors.primary} rounded-sm`}></div>
                <div className={`${colors.primary} rounded-sm`}></div>
                <div className={`${colors.secondary} rounded-sm`}></div>
                <div className={`${colors.tertiary} rounded-sm`}></div>

                {/* Row 2 */}
                <div className={`${colors.primary} rounded-sm`}></div>
                <div className={`${colors.tertiary} rounded-sm`}></div>
                <div className={`${colors.primary} rounded-sm`}></div>
                <div className={`${colors.secondary} rounded-sm`}></div>
                <div className={`${colors.tertiary} rounded-sm`}></div>

                {/* Row 3 */}
                <div className={`${colors.tertiary} rounded-sm`}></div>
                <div className={`${colors.primary} rounded-sm`}></div>
                <div className={`${colors.secondary} rounded-sm`}></div>
                <div className={`${colors.primary} rounded-sm`}></div>
                <div className={`${colors.tertiary} rounded-sm`}></div>
            </div>

            {/* Wordmark */}
            <div className="text-center">
                <h1
                    className={`${text} font-dongle font-bold ${isDark ? 'text-text-dark-primary' : 'text-text-light-primary'
                        }`}
                >
                    CHRONOS
                </h1>

                {showTagline && (
                    <p
                        className={`${tagline} ${isDark ? 'text-text-dark-muted' : 'text-text-light-muted'
                            }`}
                    >
                        Automated Timetable Management
                    </p>
                )}
            </div>
        </div>
    );
};

export default ChronosLogo;