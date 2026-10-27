import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const variantStyles = {
    default: 'bg-bg-secondary text-text-secondary border border-border',
    success: 'bg-[#E8F5EF] text-[#168568] border border-[#168568]/20',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-600 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  };

  const currentStyle = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors ${currentStyle} ${className}`}
    >
      {children}
    </span>
  );
}
