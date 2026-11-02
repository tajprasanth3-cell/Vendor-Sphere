import React from 'react';
import { getStatusBadgeStyle } from '../../config';

interface BadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  label,
  size = 'md',
  showDot = true,
}) => {
  const style = getStatusBadgeStyle(status);
  const formattedLabel = label || status.replace(/_/g, ' ').toUpperCase();

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full uppercase tracking-wider border transition-all duration-150 ${sizeClasses} ${style}`}
    >
      {showDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
      )}
      {formattedLabel}
    </span>
  );
};
