import { useTheme } from '../context/ThemeContext';

const StatsCard = ({ title, value, icon: Icon, trend }) => {
    const { isDark } = useTheme();

    return (
        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    {trend && (
                        <p className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend > 0 ? '+' : ''}{trend}% from last month
                        </p>
                    )}
                </div>
                {Icon && <Icon className="h-8 w-8 text-gray-400" />}
            </div>
        </div>
    );
};

export default StatsCard;