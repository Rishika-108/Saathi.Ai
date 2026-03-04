import Calendar from "react-calendar";

export default function JournalCalendar({
  selectedDate,
  setSelectedDate,
  journalDates
}) {

  return (
    <div
  className="
  w-full max-w-[280px]
  bg-surface
  border border-borderColor
  rounded-lg
  shadow-soft
  p-4
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

        tileClassName={({ date, view }) => {

          if (view !== "month") return;

          const dateStr = date.toISOString().slice(0,10);

          if (journalDates.includes(dateStr)) {
            return "journal-day";
          }

        }}

        tileContent={({ date, view }) => {

          if (view !== "month") return null;

          const dateStr = date.toISOString().slice(0,10);

          if (journalDates.includes(dateStr)) {

            return (
              <div className="flex justify-center mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              </div>
            );

          }

        }}
      />
    </div>
  );
}