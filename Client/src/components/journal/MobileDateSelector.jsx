import React, { useRef, useEffect } from "react";

export default function MobileDateSelector({
  selectedDate,
  setSelectedDate,
  journalDates
}) {

  const scrollContainerRef = useRef(null);

  const formatDate = (date) => {
    const d = new Date(date);
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  }

  // Generate an array of dates from say, 30 days ago to today
  const generateDateRange = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      dates.push(d);
    }
    return dates;
  };

  const dates = generateDateRange();
  const selectedStr = formatDate(selectedDate);
  const todayStr = formatDate(new Date());

  // Auto-scroll to selected date on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Find the active element button index to roughly scroll to end where "today" is
      const activeElement = scrollContainerRef.current.querySelector('.date-active');
      if (activeElement) {
         activeElement.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
      } else {
         scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
      }
    }
  }, []);

  return (
    <div className="w-full bg-surface border-y border-borderColor shadow-soft py-3 px-1 lg:hidden mb-4">
      <div className="flex items-center justify-between px-3 mb-2">
        <h3 className="text-sm font-semibold text-textPrimary">Journal History</h3>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2 px-3 pb-2 pt-1 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dates.map((date, index) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedStr;
          const hasJournal = journalDates.includes(dateStr);
          const isToday = dateStr === todayStr;

          const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
          const dayNum = date.getDate();

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`
                snap-center shrink-0 flex flex-col items-center justify-center p-2 rounded-xl border min-w-[56px] min-h-[64px] transition-all
                ${isSelected 
                  ? "bg-primary text-white border-primary shadow-md date-active scale-105" 
                  : "bg-surface-elevated border-borderColor text-textSecondary hover:border-primary/40"}
                ${!isSelected && hasJournal ? "bg-primary/5 border-primary/20" : ""}
                ${isToday && !isSelected ? "border-primary text-primary font-medium" : ""}
              `}
            >
              <span className={`text-[11px] uppercase tracking-wider mb-1 ${isSelected ? "text-white/80" : "text-textSecondary"}`}>
                {dayName}
              </span>
              <span className={`text-lg font-bold ${isSelected ? "text-white" : "text-textPrimary"}`}>
                {dayNum}
              </span>
              
              {/* Activity Indicator */}
              <div className="h-1.5 flex items-end justify-center w-full mt-1">
                 {hasJournal && (
                   <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-primary"}`}></span>
                 )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
