import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

export default function EmotionDistribution({ vector }) {

  if (!vector) return null;

  const data = Object.entries(vector).map(([emotion, value]) => ({
    name: emotion,
    value: Number((value * 100).toFixed(1))
  }));

  const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#64748b"
  ];

  return (
    <div className="surface-elevated shadow-soft rounded-lg p-6 h-[360px] flex flex-col">

      <h2 className="text-lg font-semibold mb-4">
        Emotion Distribution
      </h2>

      <div className="flex-1 min-h-[250px]">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}