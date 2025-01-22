import TradingChart from "@/components/TradingChart";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";
import MarketHours from "@/components/MarketHours";

const Index = () => {
  return (
    <main className="flex-1 p-8">
      <MarketHours />
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[600px]">
          <TradingChart />
        </div>
        <div className="w-[425px]">
          <TechnicalAnalysisWidget />
        </div>
      </div>
    </main>
  );
};

export default Index;