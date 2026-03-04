import React from "react";

export default function JournalPage({ value, onChange, readOnly = false }) {

  const lineHeight = 31;
  const topPadding = 18;

  return (
    <div
      className="
      relative bg-surface border border-borderColor rounded-lg shadow-soft
      w-full h-[540px] overflow-hidden transition-all duration-300
      "
    >

      {/* notebook margin */}
      <div
        className="absolute left-[56px] top-0 bottom-0 w-[2px]"
        style={{ background: "var(--border)" }}
      />

      <textarea
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        placeholder="Start writing your thoughts..."
        className="
        w-full h-full resize-none bg-transparent outline-none
        text-textPrimary
        pl-[72px] pr-8 pb-8 overflow-hidden
        focus:ring-0
        
        "
        style={{
          lineHeight: `${lineHeight}px`,
          paddingTop: `${topPadding}px`,
          backgroundImage: `
            repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent ${lineHeight - 1}px,
              var(--border) ${lineHeight}px
            )
          `,
          backgroundSize: `100% ${lineHeight}px`,
          backgroundPositionY: `${topPadding}px`
        }}
      />

    </div>
  );
}