import React from 'react';

interface StatsCardProps {
    title: string;
    value: number | string;
    subtitle: string;
    icon: React.ReactNode;
    gradient: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    gradient
}) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {title}
                </h3>
                <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mt-2`}>
                    {value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {subtitle}
                </p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <div className="w-6 h-6 text-white">
                    {icon}
                </div>
            </div>
        </div>
    </div>
);

export default StatsCard;
