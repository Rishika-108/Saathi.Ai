export default function ReflectionHeatmap({ journals = [] }) {
  const dayCounts = {};

  // count journals per day
  journals.forEach((j) => {
    const date = new Date(j.createdAt).toISOString().slice(0, 10);

    dayCounts[date] = (dayCounts[date] || 0) + 1;
  });

  // generate last 28 days
  const days = [];

  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const key = d.toISOString().slice(0, 10);

    days.push({
      date: key,
      count: dayCounts[key] || 0,
    });
  }
  if (!journals.length) {
    return (
      <div className="surface-elevated shadow-soft rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Reflection Activity</h2>
        <p className="text-text-secondary text-sm">
          Start writing reflections to build your emotional activity map.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-elevated shadow-soft hover:shadow-elevated transition rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Reflection Activity</h2>

        <span className="text-xs text-text-secondary">Last 4 weeks</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(({ date, count }) => {
          let color =
            "bg-surface border border-borderColor text-text-secondary";

          if (count === 1)
            color =
              "bg-primary-soft border border-borderColor text-text-primary";

          if (count === 2)
            color = "bg-primary/70 border border-primary/80 text-white";

          if (count >= 3) color = "bg-primary border border-primary text-white";
          return (
            <div
              key={date}
              title={`${date} — ${count} reflection${count !== 1 ? "s" : ""}`}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-semibold
  transition transform hover:scale-105 hover:shadow-soft
  ${color}`}
            >
              {count > 0 ? count : ""}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-text-secondary">
        <span>Less</span>

        <div className="w-3 h-3 rounded bg-surface border border-borderColor"></div>
        <div className="w-3 h-3 rounded bg-primary-soft"></div>
        <div className="w-3 h-3 rounded bg-primary/60"></div>
        <div className="w-3 h-3 rounded bg-primary"></div>

        <span>More</span>
      </div>
    </div>
  );
}
