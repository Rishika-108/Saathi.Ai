import { useState, useMemo, useEffect } from "react";
import JournalPage from "./JournalPage";
import { useApp } from "../../context/AppContext";

const MAX_LINES = 15;
const APPROX_CHARS_PER_LINE = 60;

export default function JournalBook({ initialText = "", readOnly = false }) {

  const { createJournal } = useApp();

  const [journalText, setJournalText] = useState(
    initialText ||
    (typeof window !== "undefined"
      ? localStorage.getItem("saathi_journal") || ""
      : "")
  );

  const [pageIndex, setPageIndex] = useState(0);

  /* autosave draft (disabled in view mode) */
  useEffect(() => {

    if (readOnly) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("saathi_journal", journalText);
    }

  }, [journalText, readOnly]);

  /* update text when date changes */
  useEffect(() => {

    if (initialText !== undefined) {

      setJournalText(initialText);
      setPageIndex(0);

    }

  }, [initialText]);

  const pages = useMemo(() => {

    const rawLines = journalText.split("\n");
    const visualLines = [];

    rawLines.forEach(line => {

      if (line === "") {
        visualLines.push("");
        return;
      }

      let start = 0;

      while (start < line.length) {

        visualLines.push(
          line.slice(start, start + APPROX_CHARS_PER_LINE)
        );

        start += APPROX_CHARS_PER_LINE;

      }

    });

    const result = [];

    for (let i = 0; i < visualLines.length; i += MAX_LINES) {

      result.push(
        visualLines.slice(i, i + MAX_LINES).join("\n")
      );

    }

    if (result.length === 0) result.push("");

    return result;

  }, [journalText]);

  /* prevent invalid page index */
  useEffect(() => {

    if (pageIndex > pages.length - 1) {
      setPageIndex(pages.length - 1);
    }

  }, [pages.length, pageIndex]);

  const currentPage = pages[pageIndex] || "";

  const handleChange = (value) => {

    if (readOnly) return;

    const allPages = [...pages];
    allPages[pageIndex] = value;

    setJournalText(allPages.join("\n"));

  };

  /* keyboard navigation */
  useEffect(() => {

    const handler = (e) => {

      if (e.ctrlKey && e.key === "ArrowRight") {

        if (pageIndex < pages.length - 1)
          setPageIndex(p => p + 1);

      }

      if (e.ctrlKey && e.key === "ArrowLeft") {

        if (pageIndex > 0)
          setPageIndex(p => p - 1);

      }

    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);

  }, [pageIndex, pages.length]);

  const nextPage = () => {

    if (pageIndex < pages.length - 1) {
      setPageIndex(pageIndex + 1);
    }

  };

  const prevPage = () => {

    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }

  };

  const handleSubmit = async () => {

    if (readOnly) {
      alert("Journal already exists for this date.");
      return;
    }

    if (!journalText.trim()) {
      alert("Journal cannot be empty");
      return;
    }

    if (journalText.length < 20) {
      alert("Write at least a few lines before submitting.");
      return;
    }

    try {

      const res = await createJournal(journalText);

      console.log("Journal API response:", res);

      alert("Journal submitted successfully!");

      setJournalText("");
      setPageIndex(0);

      if (typeof window !== "undefined") {
        localStorage.removeItem("saathi_journal");
      }

    } catch (err) {

      console.error("Journal submission failed:", err);
      alert("Failed to submit journal");

    }

  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">

      <div className="transition-all duration-300">

        <JournalPage
          value={currentPage}
          onChange={(e) => handleChange(e.target.value)}
          readOnly={readOnly}
        />

      </div>

      <div className="flex justify-between items-center">

        <button
          onClick={prevPage}
          disabled={pageIndex === 0}
          className="
          px-4 py-2 border border-borderColor rounded-md
          text-textSecondary disabled:opacity-40
          "
        >
          Previous
        </button>

        <span className="text-sm text-textSecondary">
          Page {pageIndex + 1} / {pages.length}
        </span>

        <button
          onClick={nextPage}
          disabled={pageIndex === pages.length - 1}
          className="
          px-4 py-2 border border-borderColor rounded-md
          text-textSecondary disabled:opacity-40
          "
        >
          Next
        </button>

      </div>

      {!readOnly && (
        <div className="flex justify-end">

          <button
            onClick={handleSubmit}
            className="
            px-6 py-2 rounded-md bg-primary text-white
            shadow-soft hover:opacity-90
            "
          >
            Submit Journal
          </button>

        </div>
      )}

    </div>
  );

}