import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, subDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isFuture } from "date-fns";

interface PrayerCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  availableDates?: string[]; // Array of YYYY-MM-DD strings with available prayers
}

export function PrayerCalendar({ selectedDate, onDateSelect, availableDates = [] }: PrayerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentMonth(prev => subDays(startOfMonth(prev), 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => addDays(endOfMonth(prev), 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
  };

  const hasAvailablePrayer = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availableDates.includes(dateStr);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-medium flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Prayer History
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="text-xs"
        >
          Today
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {daysInMonth.map(day => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          const isFutureDay = isFuture(day) && !isCurrentDay;
          const hasPrayer = hasAvailablePrayer(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isFutureDay && onDateSelect(day)}
              disabled={isFutureDay}
              className={`
                aspect-square rounded-md text-sm font-medium transition-all
                ${isSelected 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : hasPrayer
                    ? 'bg-primary/10 text-foreground hover:bg-primary/20'
                    : 'text-muted-foreground hover:bg-muted'
                }
                ${isCurrentDay && !isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                ${isFutureDay ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                ${hasPrayer && !isSelected ? 'font-semibold' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/10" />
          <span>Has prayer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full ring-2 ring-primary" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
