import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: React.ReactNode;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon,
  iconColor = 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20',
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-xl p-3.5 sm:p-5 shadow-xs transition-all duration-200 min-w-0 overflow-hidden">
      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
        <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase truncate">
          {title}
        </span>
        <div className={`p-1.5 sm:p-2.5 rounded-lg border shrink-0 ${iconColor}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline flex-wrap gap-1.5 sm:gap-2 min-w-0">
        <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
          {value}
        </h3>
        {change && (
          <span
            className={`text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${
              isPositive
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10'
                : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 sm:mt-2 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};
