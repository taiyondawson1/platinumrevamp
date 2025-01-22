import TradingChart from "@/components/TradingChart";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";

const Index = () => {
  return (
    <main className="flex-1 p-6 max-w-[1400px] mx-auto ml-16">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-start">
          <div className="flex-1">
          </div>
          <div className="mt-32">
            <TechnicalAnalysisWidget />
          </div>
        </div>
        <div className="flex-1">
          <TradingChart />
        </div>
      </div>
    </main>
  );
};

export default Index;