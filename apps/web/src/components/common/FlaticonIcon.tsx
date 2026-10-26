import React from 'react';

export type FlaticonVariant = 'rr' | 'br' | 'sr' | 'tr'; // regular rounded, bold rounded, solid rounded, thin rounded

export interface FlaticonIconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  variant?: FlaticonVariant;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const FlaticonIcon: React.FC<FlaticonIconProps> = ({
  name,
  variant = 'rr',
  className = '',
  size,
  ...props
}) => {
  // Strip any accidental 'fi-' or 'fi-rr-' prefix if passed
  const cleanName = name.replace(/^fi-(rr|br|sr|tr|brands)-/, '').replace(/^fi-/, '');
  const prefix = `fi-${variant}`;

  const sizeClasses = {
    xs: 'text-[11px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };
  const sizeClass = size ? sizeClasses[size] : '';

  return (
    <i
      className={`fi ${prefix}-${cleanName} ${sizeClass} inline-flex items-center justify-center leading-none ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

export default FlaticonIcon;
