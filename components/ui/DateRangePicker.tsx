'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format, addDays, isBefore, isAfter, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  unavailableDates?: string[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  unavailableDates = [],
  minDate = new Date(),
  maxDate = addDays(new Date(), 365),
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateUnavailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return unavailableDates.includes(dateStr);
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, minDate) || isAfter(date, maxDate) || isDateUnavailable(date);
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return isAfter(date, startDate) && isBefore(date, endDate);
  };

  const isDateHovered = (date: Date) => {
    if (!startDate || !hoveredDate) return false;
    if (endDate) return false;
    return isAfter(date, startDate) && isBefore(date, hoveredDate);
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      onDateChange(date, null);
    } else {
      // Complete selection
      if (isBefore(date, startDate)) {
        onDateChange(date, startDate);
      } else {
        onDateChange(startDate, date);
      }
      setIsOpen(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-secondary" />
          {startDate && endDate ? (
            `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
          ) : startDate ? (
            `${format(startDate, 'MMM d, yyyy')} - Select end date`
          ) : (
            'Select dates'
          )}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 z-40 bg-white rounded-lg shadow-lg border border-border p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
                  className="p-2 hover:bg-hover rounded-base"
                >
                  ‹
                </button>
                <h3 className="font-semibold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                  className="p-2 hover:bg-hover rounded-base"
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-secondary p-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="p-2" />;
                  }

                  const isDisabled = isDateDisabled(date);
                  const isStart = startDate && isSameDay(date, startDate);
                  const isEnd = endDate && isSameDay(date, endDate);
                  const isInRange = isDateInRange(date);
                  const isHovered = isDateHovered(date);
                  const isToday = isSameDay(date, new Date());

                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => setHoveredDate(date)}
                      onMouseLeave={() => setHoveredDate(null)}
                      className={cn(
                        'p-2 text-sm rounded-base transition-colors relative',
                        isDisabled && 'opacity-50 cursor-not-allowed',
                        !isDisabled && 'hover:bg-hover cursor-pointer',
                        (isStart || isEnd) && 'bg-accent text-white hover:bg-accent',
                        (isInRange || isHovered) && 'bg-accent/10',
                        isToday && 'font-semibold'
                      )}
                    >
                      {date.getDate()}
                      {isDateUnavailable(date) && !isDisabled && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-border text-xs text-secondary">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-accent rounded-full" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};