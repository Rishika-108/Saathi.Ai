export default function EmotionSnapshot({ trajectory, latest }) {

  const sentiment =
    trajectory.weighted_sentiment > 0.3
      ? "Positive"
      : trajectory.weighted_sentiment < -0.3
      ? "Negative"
      : "Balanced";

  const insight = latest
    ? `Recent reflections highlight "${latest.theme.primary}". Your emotional stability remains ${
        trajectory.stability_score > 0.7 ? "strong" : "moderate"
      }.`
    : "Write a reflection to start tracking your emotional patterns.";

  return (
    <div className="surface-elevated shadow-elevated rounded-lg p-8 grid md:grid-cols-3 gap-6">

      {/* Emotional State */}

      <div>

        <p className="text-sm text-text-secondary">
          Dominant Emotion
        </p>

        <h2 className="text-2xl font-semibold capitalize mt-1">
          {trajectory.dominant_emotion}
        </h2>

      </div>

      <div>

        <p className="text-sm text-text-secondary">
          Mood Trend
        </p>

        <h2 className="text-2xl font-semibold mt-1">
          {sentiment}
        </h2>

      </div>

      <div>

        <p className="text-sm text-text-secondary">
          Emotional Stability
        </p>

        <h2 className="text-2xl font-semibold mt-1">
          {trajectory.stability_score > 0.7 ? "Stable" : "Fluctuating"}
        </h2>

      </div>

      {/* AI Insight */}

      <div className="md:col-span-3 border-t border-borderColor pt-6">

        <p className="text-sm text-text-secondary">
          AI Insight
        </p>

        <p className="mt-2 text-text-primary">
          {insight}
        </p>

      </div>

    </div>
  );
}