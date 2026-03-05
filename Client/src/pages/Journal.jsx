import { useEffect, useState, useMemo, useCallback } from "react";
import { useApp } from "../context/AppContext";
import JournalBook from "../components/journal/JournalBook";
import JournalCalendar from "../components/journal/JournalCalendar";

export default function Journal() {

  const { getJournals, user } = useApp();

  const [journals, setJournals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const normalizeDate = (date) => {
    const d = new Date(date)
    d.setHours(0,0,0,0)
    return d
  }

  const loadJournals = useCallback(async () => {

    try {

      const res = await getJournals();

      if (res?.journals) {
        setJournals(res.journals);
      }

    } catch (err) {

      console.error("Journal load error:", err);

    }

  }, [getJournals]);

  useEffect(() => {

    if (!user) return;
    loadJournals();

  }, [user, loadJournals]);

  const journalDates = useMemo(() => {

    return [
      ...new Set(
        journals
          .filter(j => j?.createdAt)
          .map(j => formatDate(j.createdAt))
      )
    ];

  }, [journals]);

  const journalsForDay = useMemo(() => {

    const dateStr = formatDate(selectedDate);

    return journals
      .filter(j => formatDate(j.createdAt) === dateStr)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  }, [selectedDate, journals]);

  const todayStr = formatDate(normalizeDate(new Date()));
  const selectedStr = formatDate(normalizeDate(selectedDate));

  const allowWriting = selectedStr === todayStr;

  return (
    <div className="h-[calc(100vh-64px)] bg-background px-4 md:px-6 py-6 flex flex-col">

      <div className="max-w-6xl mx-auto flex flex-col flex-1 w-full">

        <div className="mb-4">

          <h1 className="text-2xl md:text-3xl font-semibold text-textPrimary">
            Your Journal
          </h1>

          <p className="text-sm text-textSecondary">
            Reflect on your thoughts and revisit past entries.
          </p>

        </div>

        <div className="flex-1 grid gap-6 lg:grid-cols-[1fr_300px] overflow-hidden">

          <div className="flex flex-col overflow-hidden">

            <JournalBook
              journals={journalsForDay}
              allowWriting={allowWriting}
              selectedDate={selectedDate}
              refreshJournals={loadJournals}
            />

          </div>

          <div className="hidden lg:block">

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