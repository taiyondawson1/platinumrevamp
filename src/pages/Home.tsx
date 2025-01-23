import TradingChart from "@/components/TradingChart";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";
import AccountMetrics from "@/components/AccountMetrics";

const Index = () => {
  // Mock connected account ID - replace this with actual account connection logic
  const connectedAccountId = "demo123";

  return (
    <main className="flex-1 p-6 max-w-[1400px] mx-auto ml-[64px]">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-softWhite mb-4">Account Overview</h2>
            <AccountMetrics accountId={connectedAccountId} />
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