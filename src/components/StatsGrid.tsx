
const StatsGrid = () => {
  const stats = [
    { label: "Win Rate", value: "68%", amount: "$1,234.56" },
    { label: "Profit Factor", value: "2.4", amount: "$1,234.56" },
    { label: "Max Drawdown", value: "-12%", amount: "$1,234.56" },
    { label: "Sharpe Ratio", value: "1.8", amount: "$1,234.56" },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="w-full bg-darkBlue/40 border-mediumGray/20 rounded-none p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="text-lg text-softWhite/70 font-medium">{stat.label}</div>
            <div className="text-2xl font-bold text-softWhite mt-1">{stat.value}</div>
            <div className="text-sm text-softWhite/50 mt-1">{stat.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
