import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const lineStyle = {
  p10: { name: "P10", stroke: "#94A3B8", dash: "6 5" },
  p50: { name: "P50", stroke: "#1E3A8A", dash: undefined },
  p90: { name: "P90", stroke: "#94A3B8", dash: "6 5" },
};

function getScenarioStroke(key, activeScenario) {
  if (key === activeScenario) return "#1E3A8A";
  return lineStyle[key].stroke;
}

export default function ForecastChart({ data, activeScenario = "p50" }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 12, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#475569", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 12 }}
            tickLine={false}
            unit=" MW"
            width={72}
          />
          <Tooltip
            contentStyle={{
              borderColor: "#CBD5E1",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
            }}
            formatter={(value, name) => {
              if (Array.isArray(value)) {
                return [`${value[0]}-${value[1]} MW`, name];
              }

              return [`${Math.round(value)} MW`, name];
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="range"
            name="Forecast band"
            fill="#1E3A8A"
            fillOpacity={0.12}
            stroke="none"
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="p10"
            name="P10"
            stroke={getScenarioStroke("p10", activeScenario)}
            strokeDasharray={lineStyle.p10.dash}
            strokeWidth={activeScenario === "p10" ? 4 : 2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="p50"
            name="P50"
            stroke={getScenarioStroke("p50", activeScenario)}
            strokeWidth={activeScenario === "p50" ? 4 : 2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="p90"
            name="P90"
            stroke={getScenarioStroke("p90", activeScenario)}
            strokeDasharray={lineStyle.p90.dash}
            strokeWidth={activeScenario === "p90" ? 4 : 2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
