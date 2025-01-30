
const StatsGrid = () => {
  const stats = [
    { label: "Win Rate", value: "68%" },
    { label: "Profit Factor", value: "2.4" },
    { label: "Max Drawdown", value: "-12%" },
    { label: "Sharpe Ratio", value: "1.8" },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="w-full bg-darkBlue/40 border-mediumGray/20 rounded-none p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-softWhite">{stat.value}</div>
            <div className="text-xl font-bold text-softWhite mt-2">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
