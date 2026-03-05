export default function ThemeInsights({ analysis = [] }) {

  const themes = {};

  analysis.forEach((a) => {

    if (!a?.theme?.primary) return;

    const theme = a.theme.primary;

    themes[theme] = (themes[theme] || 0) + 1;

  });

  const sorted = Object.entries(themes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (!sorted.length) return null;

  return (
    <div className="surface-elevated shadow-soft rounded-lg p-6">

      <h2 className="text-xl font-semibold mb-4">
        Themes in Your Reflections
      </h2>

      <div className="flex flex-wrap gap-3">

        {sorted.map(([theme, count]) => (
          <span
            key={theme}
            className="px-3 py-1 rounded-full bg-primary-soft text-sm capitalize"
          >
            {theme} ({count})
          </span>
        ))}

      </div>

    </div>
  );
}