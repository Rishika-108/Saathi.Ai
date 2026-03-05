import { useEffect, useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import JournalBook from "../components/journal/JournalBook";
import JournalCalendar from "../components/journal/JournalCalendar";

export default function Journal() {

  const { getJournals, user } = useApp();

  const [journals, setJournals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedJournal, setSelectedJournal] = useState("");
  const [viewMode, setViewMode] = useState(false);

  /* consistent date formatter */
  const formatDate = (date) =>
    new Date(date).toISOString().slice(0, 10);

  /* fetch journals only when user exists */
  useEffect(() => {

    if (!user) return;

    let mounted = true;

    const load = async () => {

      try {

        const res = await getJournals();

        if (mounted && res?.journals) {
          setJournals(res.journals);
        } else {
          console.log("Journals not present");
        }

      } catch (err) {

        console.error("Journal load error:", err);

      }

    };

    load();

    return () => {
      mounted = false;
    };

  }, [user]);

  /* calendar highlight dates */
  const journalDates = useMemo(() => {

    return [
      ...new Set(
        journals
          .filter(j => j?.createdAt)
          .map(j => formatDate(j.createdAt))
      )
    ];

  }, [journals]);

  /* update journal when date changes */
  useEffect(() => {

    const dateStr = formatDate(selectedDate);

    const journal = journals.find(j => {

      if (!j?.createdAt) return false;

      const jDate = formatDate(j.createdAt);

      return jDate === dateStr;

    });

    if (journal) {

      setSelectedJournal(journal.text);
      setViewMode(true);

    } else {

      setSelectedJournal("");
      setViewMode(false);

    }

  }, [selectedDate, journals]);

  return (
    <div className="min-h-screen bg-background py-6 px-4">

      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-6">

          <h1 className="text-xl font-semibold text-textPrimary">
            Your Journal
          </h1>

          <p className="text-sm text-textSecondary">
            Select a date to view or continue writing your reflection.
          </p>

        </div>

        {/* Main Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Journal Section */}
          <div className="flex-1 space-y-3">

            <p className="text-sm text-textSecondary">
              Viewing entry for {selectedDate.toDateString()}
            </p>

            {viewMode && (
              <button
                onClick={() => {
                  setSelectedJournal("");
                  setViewMode(false);
                }}
                className="text-sm text-primary hover:underline"
              >
                Write New Journal
              </button>
            )}

            <JournalBook
  initialText={selectedJournal}
  readOnly={viewMode}
/>

          </div>

          {/* Calendar */}
          <div className="w-full lg:w-[280px] shrink-0">

            <JournalCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              journalDates={journalDates}
            />

          </div>

        </div>

      </div>

    </div>
  );
}