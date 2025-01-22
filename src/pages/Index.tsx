import Sidebar from "@/components/Sidebar";
import MetricCard from "@/components/MetricCard";
import TradingChart from "@/components/TradingChart";
import StatsGrid from "@/components/StatsGrid";

const Index = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-16 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard label="Account Balance" value="$25,430.00" />
          <MetricCard
            label="Today's P&L"
            value="+$1,234.00"
            trend="up"
          />
          <MetricCard
            label="Total P&L"
            value="+$5,430.00"
            trend="up"
          />
        </div>

        <div className="mb-8">
          <TradingChart />
        </div>

        <StatsGrid />
      </main>
    </div>
  );
};

export default Index;