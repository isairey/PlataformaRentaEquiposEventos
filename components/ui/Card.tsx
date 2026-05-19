import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false,
  onClick 
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-card transition-shadow duration-200';
  
  if (hover) {
    return (
      <motion.div
        className={cn(
          baseStyles,
          'hover:shadow-hover',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div
      className={cn(
        baseStyles,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};