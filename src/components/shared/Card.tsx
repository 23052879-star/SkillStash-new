import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  hover = false
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700';
  const hoverClasses = hover ? 'transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg' : '';
  const combinedClasses = `${baseClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};