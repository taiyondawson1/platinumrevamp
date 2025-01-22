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
        <div key={stat.label} className="metric-card">
          <div className="metric-value">{stat.value}</div>
          <div className="metric-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;