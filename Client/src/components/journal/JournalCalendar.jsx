import Calendar from "react-calendar";

export default function JournalCalendar({
  selectedDate,
  setSelectedDate,
  journalDates
}) {

  const formatDate = (date) => {
    // using localized timezone to match the heat map fixes
    const d = new Date(date);
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  }

  const todayStr = formatDate(new Date());

  return (
    <div
      className="
      w-full max-w-[300px]
      bg-surface
      border border-borderColor
      rounded-xl
      shadow-soft
      p-4
      transition-all
      "
    >

      <div className="mb-4 mt-2 px-2 flex flex-col">
        <h3 className="text-lg font-semibold text-textPrimary">History</h3>
        <p className="text-xs text-textSecondary">Select a date to view past entries.</p>
      </div>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        maxDate={new Date()}
        minDetail="year"
        showNeighboringMonth={false}
        prev2Label={null}
        next2Label={null}
        prevLabel={"‹"}
        nextLabel={"›"}
        className="w-full border-none"

        tileDisabled={({ date, view }) => {
          if (view !== "month") return false;
          const dateStr = formatDate(date);
          
          // Disable future dates entirely, and dates that are not journal dates (except for today)
          return (date > new Date()) || (!journalDates.includes(dateStr) && dateStr !== todayStr);
        }}

        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const dateStr = formatDate(date);

          if (journalDates.includes(dateStr)) {
            return (
              <div className="journal-indicator mt-1 absolute bottom-1 right-1/2 translate-x-1/2"></div>
            );
          }
          return null;
        }}
      />

    </div>
  );
}