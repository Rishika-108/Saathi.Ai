export default function ReflectionInsight({ insight }) {
  if (!insight || !insight.title || !insight.narrative) {
    return (
      <div className="surface-elevated shadow-soft rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Latest Reflection Insight</h2>
        <p className="text-text-secondary">No deep reflection insights available yet.</p>
      </div>
    );
  }

  return (
    <div className="surface-elevated shadow-soft rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">Deep Insight</h2>
      <h3 className="text-lg text-primary font-medium mb-4">"{insight.title}"</h3>
      <p className="text-sm text-text-secondary leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
        {insight.narrative}
      </p>
    </div>
  );
}