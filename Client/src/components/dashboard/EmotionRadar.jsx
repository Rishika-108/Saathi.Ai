import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from "recharts";

export default function EmotionRadar({ vector }) {

  if (!vector) return null;

  const data = Object.entries(vector).map(([emotion, value]) => ({
    emotion,
    value: Number((value * 100).toFixed(1))
  }));

  return (
    <div className="surface-elevated shadow-soft rounded-lg p-6 h-[360px] flex flex-col">

      <h2 className="text-lg font-semibold mb-4">
        Emotional Spectrum
      </h2>

      <div className="flex-1 min-h-[250px]">

        <ResponsiveContainer width="100%" height="100%">

          <RadarChart data={data}>

            <PolarGrid />

            <PolarAngleAxis dataKey="emotion" />

            <Radar
              name="Emotion"
              dataKey="value"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.35}
            />

            <Tooltip />

          </RadarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}