import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({ href, children, className = '' }) => {
  const baseClasses = 'text-gray-700 hover:text-blue-600 transition-colors duration-300';
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;
  
  return (
    <a href={href} className={combinedClasses}>
      {children}
    </a>
  );
};