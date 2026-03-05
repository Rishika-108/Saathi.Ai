import { useState, useEffect } from "react";
import JournalPage from "./JournalPage";
import { useApp } from "../../context/AppContext";

const MAX_CHAR = 500;

export default function JournalBook({
  journals = [],
  allowWriting,
  selectedDate,
  refreshJournals,
  onWriteModeChange
}) {

  const { createJournal } = useApp();

  const [journalText, setJournalText] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("saathi_journal") || ""
      : ""
  );

  const [entryIndex, setEntryIndex] = useState(0);
  const [writeMode, setWriteMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalEntries = journals.length;

  useEffect(() => {
    setWriteMode(false)
  }, [selectedDate])

  useEffect(() => {
    if (journals.length > 0) {
      setEntryIndex(0)
    }
  }, [journals])

  useEffect(() => {
    if (onWriteModeChange) {
      onWriteModeChange(writeMode);
    }
  }, [writeMode, onWriteModeChange]);

  const currentEntry = journals[entryIndex];

  useEffect(() => {

    if (!writeMode) return;

    localStorage.setItem("saathi_journal", journalText);

  }, [journalText, writeMode]);

  const handleChange = (value) => {

    if (value.length > MAX_CHAR) return;
    setJournalText(value);

  };

  const nextEntry = () => {

    if (entryIndex < totalEntries - 1) {
      setEntryIndex(entryIndex + 1);
    }

  };

  const prevEntry = () => {

    if (entryIndex > 0) {
      setEntryIndex(entryIndex - 1);
    }

  };

  const handleSubmit = async () => {

    if (!journalText.trim()) {
      alert("Journal cannot be empty");
      return;
    }

    if (journalText.length < 20) {
      alert("Write more before submitting.");
      return;
    }

    try {

      setSaving(true);

      await createJournal(journalText)

      setJournalText("")
      localStorage.removeItem("saathi_journal")

      await refreshJournals()

      setEntryIndex(0)
      setWriteMode(false)
      setSaving(false)

    } catch (err) {

      console.error(err);
      alert("Submission failed");
      setSaving(false);

    }

  };

  const dateLabel = new Date(selectedDate).toDateString();

  const timeLabel =
    currentEntry &&
    new Date(currentEntry.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  return (
    <div className="flex flex-col h-full space-y-4">

      {!writeMode && currentEntry && (

        <div className="bg-surface-elevated border border-borderColor rounded-xl p-4 shadow-soft">

          <div className="flex items-center justify-between">

            <span className="text-xs md:text-sm font-medium text-textPrimary">
              {dateLabel}
            </span>

            <span className="text-xs text-textSecondary">
              {timeLabel}
            </span>

          </div>

        </div>

      )}

      <div
        className={`
        flex-1
        transition-all duration-300 ease-out
        ${writeMode ? "scale-[1.01] shadow-elevated" : ""}
        `}
      >
        <JournalPage
          value={
            writeMode
              ? journalText
              : currentEntry
              ? currentEntry.text
              : journalText
          }
          onChange={(e) => handleChange(e.target.value)}
          readOnly={!writeMode}
        />
      </div>

      {!writeMode && totalEntries > 0 && (

        <div className="flex items-center justify-between">

          <button
            onClick={prevEntry}
            disabled={entryIndex === 0}
            className="px-4 py-2 border border-borderColor rounded-md text-sm text-textSecondary hover:bg-surface-elevated transition-all disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm font-medium tracking-wide text-textSecondary">
            Entry {entryIndex + 1} of {totalEntries}
          </span>

          <button
            onClick={nextEntry}
            disabled={entryIndex === totalEntries - 1}
            className="px-4 py-2 border border-borderColor rounded-md text-sm text-textSecondary hover:bg-surface-elevated transition-all disabled:opacity-40"
          >
            Next
          </button>

        </div>

      )}

      {!writeMode && (

  <div className="flex justify-end">

    <button
      onClick={() => {
        if (!allowWriting) {
          alert("You can only write today's journal.");
          return;
        }
        setWriteMode(true);
      }}
      className="
      px-5 py-2 rounded-md
      bg-primary text-white font-medium
      shadow-soft
      hover:bg-primary-hover
      active:scale-[0.97]
      transition-all
      "
    >
      Write Journal
    </button>

  </div>

)}

      {writeMode && (

        <div className="flex items-center justify-between">

          <span className="text-xs md:text-sm text-textSecondary">
            {journalText.length} / {MAX_CHAR}
          </span>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="
            px-6 py-2 rounded-md
            bg-primary text-white font-medium
            shadow-soft
            hover:bg-primary-hover
            active:scale-[0.97]
            transition-all
            disabled:opacity-60
            "
          >
            {saving ? "Saving..." : "Submit Journal"}
          </button>

        </div>

      )}

    </div>
  );
}