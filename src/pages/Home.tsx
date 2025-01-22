import TradingChart from "@/components/TradingChart";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";
import Experts from "@/components/Experts";

const Index = () => {
  return (
    <main className="flex-1 p-6 max-w-[1400px] mx-auto ml-16">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="w-[700px]">
            <Experts />
          </div>
          <div className="w-[425px]">
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