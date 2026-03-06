export default function HealthScore({ trajectory }) {

  if (!trajectory) return null;

  const score = Math.round(
    (trajectory.stability_score * 50) +
    ((trajectory.weighted_sentiment + 1) * 25)
  );

  const label =
    score > 75
      ? "Balanced"
      : score > 50
      ? "Stable"
      : score > 30
      ? "Needs Attention"
      : "At Risk";

  return (
    <div className="surface-elevated shadow-elevated rounded-lg p-6 flex flex-col items-center justify-center">

      <p className="text-text-secondary text-sm mb-2">
        Emotional Health Score
      </p>

      <div className="text-5xl font-semibold text-primary">
        {score}
      </div>

      <p className="mt-2 text-sm text-text-secondary">
        {label}
      </p>

    </div>
  );
}