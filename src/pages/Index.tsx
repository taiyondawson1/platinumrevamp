import TradingChart from "@/components/TradingChart";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";
import ExpertAdvisors from "@/components/ExpertAdvisors";

const Index = () => {
  return (
    <main className="flex-1 p-6 max-w-[1400px] mx-auto ml-16">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="w-[700px]">
            <ExpertAdvisors />
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