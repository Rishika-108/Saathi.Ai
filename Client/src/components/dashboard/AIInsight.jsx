export default function AIInsight({ trajectory, latest, insight }) {

  if (!trajectory) return null;

  let message = "";

  if (!latest) {
    message =
      "Start journaling to unlock emotional insights about your patterns.";
  } else if (insight && insight.narrative) {
    message = insight.narrative;
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
    <div className="surface-elevated shadow-soft rounded-xl p-6 md:col-span-2 border border-borderColor/50 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-xl font-semibold">AI Emotional Insight</h2>
        </div>

        <p className="text-text-secondary leading-relaxed mb-6 italic">
          "{message}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 border-t border-borderColor/30 pt-6">
        {/* Stability Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-textSecondary">Stability Index</span>
            <span className={trajectory.stability_score > 0.6 ? 'text-success' : 'text-primary'}>
              {Math.round(trajectory.stability_score * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${trajectory.stability_score > 0.6 ? 'bg-success' : 'bg-primary'}`}
              style={{ width: `${trajectory.stability_score * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-textMuted">Consistency of your emotional states over time.</p>
        </div>

        {/* Sentiment Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-textSecondary">Sentiment Balance</span>
            <span className={trajectory.weighted_sentiment >= 0 ? 'text-success' : 'text-error'}>
              {trajectory.weighted_sentiment >= 0 ? 'Positive' : 'Strain Detected'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-background rounded-full overflow-hidden flex items-center justify-center relative">
             {/* Center line */}
            <div className="absolute w-px h-full bg-textMuted/20 left-1/2" />
            <div 
              className={`h-full transition-all duration-1000 ${trajectory.weighted_sentiment >= 0 ? 'bg-success' : 'bg-error'}`}
              style={{ 
                width: `${Math.abs(trajectory.weighted_sentiment) * 50}%`,
                marginLeft: trajectory.weighted_sentiment >= 0 ? '50%' : '0',
                marginRight: trajectory.weighted_sentiment < 0 ? '50%' : '0'
              }}
            />
          </div>
          <p className="text-[10px] text-textMuted">Overall tone of your recent reflections.</p>
        </div>
      </div>
    </div>
  );
}