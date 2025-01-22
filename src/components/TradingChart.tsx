import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "2024-01", value: 10000 },
  { date: "2024-02", value: 12000 },
  { date: "2024-03", value: 11500 },
  { date: "2024-04", value: 13500 },
  { date: "2024-05", value: 15000 },
  { date: "2024-06", value: 14000 },
];

const TradingChart = () => {
  return (
    <div className="chart-container h-[400px]">
      <h2 className="text-xl font-bold mb-4">Account Growth</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#cccccc"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#cccccc"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(0,255,255,0.2)",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00ffff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingChart;