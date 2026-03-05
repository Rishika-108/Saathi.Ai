import Calendar from "react-calendar";

export default function JournalCalendar({
  selectedDate,
  setSelectedDate,
  journalDates
}) {

  const formatDate = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
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

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        maxDate={new Date()}
        showNeighboringMonth={false}
        prev2Label="«"
        next2Label="»"
        className="w-full border-none"

        tileDisabled={({ date, view }) => {

          if (view !== "month") return false;

          const dateStr = formatDate(date);

          return (
            !journalDates.includes(dateStr) &&
            dateStr !== todayStr
          );

        }}

        tileClassName={({ date, view }) => {

          if (view !== "month") return;

          const dateStr = formatDate(date);

          if (journalDates.includes(dateStr)) {
            return "journal-day";
          }

        }}

        tileContent={({ date, view }) => {

          if (view !== "month") return null;

          const dateStr = formatDate(date);

          if (journalDates.includes(dateStr)) {

            return (
              <div className="flex justify-center mt-1.5">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
              </div>
            );

          }

        }}

      />

    </div>
  );
}