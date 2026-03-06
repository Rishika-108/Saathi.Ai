import { useEffect, useState, useMemo, useCallback } from "react";
import { useApp } from "../context/AppContext";
import JournalBook from "../components/journal/JournalBook";
import JournalCalendar from "../components/journal/JournalCalendar";
import { motion, AnimatePresence } from "framer-motion";

export default function Journal() {

  const { getJournals, user } = useApp();

  const [journals, setJournals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    try {

      const res = await getJournals();

      if (res?.journals) {
        setJournals(res.journals);
      }

    } catch (err) {

      console.error("Journal load error:", err);

    } finally {
      setLoading(false);
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

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >

          <h1 className="text-2xl md:text-3xl font-semibold text-textPrimary">
            Your Journal
          </h1>

          <p className="text-sm text-textSecondary">
            Reflect on your thoughts and revisit past entries.
          </p>

        </motion.div>

        <div className="flex-1 grid gap-6 lg:grid-cols-[1fr_300px] overflow-hidden">
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full bg-surface-elevated border border-borderColor rounded-xl shadow-soft"
              >
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary border-opacity-30 border-t-primary mb-4"></div>
                 <p className="text-textSecondary text-sm">Loading your journal...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col overflow-hidden"
              >

                <JournalBook
                  journals={journalsForDay}
                  allowWriting={allowWriting}
                  selectedDate={selectedDate}
                  refreshJournals={loadJournals}
                />

              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block h-full"
          >

            <JournalCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              journalDates={journalDates}
            />

          </motion.div>

        </div>

      </div>

    </div>
  );
}