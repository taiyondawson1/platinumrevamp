import TradingChart from "@/components/TradingChart";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";

const Index = () => {
  return (
    <main className="flex-1 p-8">
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