import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function EmotionalTrend({ analysis = [] }) {

  const data = analysis
    .filter(a => a?.metadata?.timestamp && a?.sentiment?.score !== undefined)
    .map(a => ({
      date: new Date(a.metadata.timestamp).toLocaleDateString(),
      sentiment: Number(a.sentiment.score.toFixed(2))
    }));

  if (!data.length) return null;

  return (
    <div className="surface-elevated shadow-soft rounded-lg p-6 h-[360px] flex flex-col ">

      <h2 className="text-lg font-semibold mb-4">
        Emotional Trend
      </h2>

      <div className="flex-1 min-h-[250px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis domain={[-1, 1]} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}