export default function AIInsight({ trajectory, latest }) {

  if (!trajectory) return null;

  let message = "";

  if (!latest) {
    message =
      "Start journaling to unlock emotional insights about your patterns.";
  } else {

    const theme = latest?.theme?.primary || "personal reflections";

    if (trajectory.weighted_sentiment > 0.3) {

      message = `Your recent reflections around "${theme}" suggest improving emotional balance. Keep nurturing the habits that support your growth.`;

    } else if (trajectory.weighted_sentiment < -0.3) {

      message = `Your reflections show some emotional strain related to "${theme}". Consider expressing these feelings more frequently or connecting with a supportive peer.`;

    } else {

      message = `Your emotional trajectory appears relatively stable. The recurring theme "${theme}" may be an important area for personal reflection.`;

    }

  }

  return (
    <div className="surface-elevated shadow-soft rounded-lg p-6 md:col-span-2">

      <h2 className="text-xl font-semibold mb-3">
        AI Emotional Insight
      </h2>

      <p className="text-text-secondary leading-relaxed">
        {message}
      </p>

    </div>
  );
}