export default function ReflectionInsight({ entry }) {

  if (!entry || !entry.emotion || !entry.sentiment) {
    return (
      <div className="surface-elevated shadow-soft rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">
          Latest Reflection
        </h2>

        <p className="text-text-secondary">
          No reflection insights available yet.
        </p>
      </div>
    );
  }

  const emotion = entry.emotion?.dominant || "unknown";
  const sentiment = entry.sentiment?.label || "unknown";
  const theme = entry.theme?.primary || "personal reflection";
  const risk = entry.risk?.level || "unknown";

  return (
    <div className="surface-elevated shadow-soft rounded-lg p-6">

      <h2 className="text-xl font-semibold mb-4">
        Latest Reflection Insight
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <div>
          <p className="text-text-secondary">Emotion</p>
          <p className="capitalize font-medium">
            {emotion}
          </p>
        </div>

        <div>
          <p className="text-text-secondary">Sentiment</p>
          <p className="capitalize font-medium">
            {sentiment}
          </p>
        </div>

        <div>
          <p className="text-text-secondary">Theme</p>
          <p className="capitalize font-medium">
            {theme}
          </p>
        </div>

        <div>
          <p className="text-text-secondary">Risk Level</p>
          <p className="capitalize font-medium">
            {risk}
          </p>
        </div>

      </div>

    </div>
  );
}