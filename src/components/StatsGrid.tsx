import { MetricCard } from "./MetricCard";

const StatsGrid = () => {
  const stats = [
    { label: "Win Rate", value: "68%" },
    { label: "Profit Factor", value: "2.4" },
    { label: "Max Drawdown", value: "-12%" },
    { label: "Sharpe Ratio", value: "1.8" },
    { label: "Total Trades", value: "156" },
    { label: "Avg Win", value: "$450" },
    { label: "Avg Loss", value: "$180" },
    { label: "Recovery Factor", value: "3.2" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <MetricCard 
          key={stat.label} 
          label={stat.label} 
          value={stat.value}
        />
      ))}
    </div>
  );
};

export default StatsGrid;