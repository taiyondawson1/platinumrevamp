
import { RecentMetrics, TradingMetrics } from "@/types/trading";
import MetricCard from "@/components/MetricCard";

interface MetricsGridProps {
  recentMetrics: RecentMetrics;
  tradingMetrics: TradingMetrics;
}

const MetricsGrid = ({ recentMetrics, tradingMetrics }: MetricsGridProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Result 5 days ago"
          value={`${recentMetrics.percentageGain.toFixed(2)}%`}
          className="p-4"
        />
        <MetricCard
          label="Closed drawdown 5 days ago"
          value={`${recentMetrics.maxDrawdown.toFixed(2)}%`}
          className="p-4"
        />
        <MetricCard
          label="Float"
          value={`$${recentMetrics.floatingPL.toFixed(2)}`}
          className="p-4"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Average Win"
          value={`$${Math.abs(tradingMetrics.avgWin).toFixed(2)}`}
          className="p-4"
        />
        <MetricCard
          label="Average Loss"
          value={`$${Math.abs(tradingMetrics.avgLoss).toFixed(2)}`}
          className="p-4"
        />
        <MetricCard
          label="Win Rate"
          value={`${tradingMetrics.winRate.toFixed(1)}%`}
          className="p-4"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Total Results"
          value={`$${tradingMetrics.totalResults.toFixed(2)}`}
          className="p-4"
        />
        <MetricCard
          label="Total Balance"
          value={`$${tradingMetrics.totalBalance.toFixed(2)}`}
          className="p-4"
        />
        <MetricCard
          label="Profit Factor"
          value={tradingMetrics.profitFactor.toFixed(2)}
          className="p-4"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Max Closed DD"
          value={`${tradingMetrics.maxClosedDrawdown.toFixed(2)}%`}
          className="p-4"
        />
        <MetricCard
          label="Total Orders"
          value={tradingMetrics.totalOrders.toString()}
          className="p-4"
        />
        <MetricCard
          label="Last Trade Take"
          value={`$${tradingMetrics.lastTradeTake.toFixed(2)}`}
          className="p-4"
        />
      </div>
    </div>
  );
};

export default MetricsGrid;
