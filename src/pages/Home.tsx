import TradingChart from "@/components/TradingChart";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";
import AccountMetrics from "@/components/AccountMetrics";
import MT4ConnectionForm from "@/components/MT4ConnectionForm";
import { useState } from "react";

const Index = () => {
  const [connectedAccountId, setConnectedAccountId] = useState<string | null>(null);

  return (
    <main className="flex-1 p-6 max-w-[1400px] mx-auto ml-[64px]">
      <div className="flex flex-col gap-4">
        {connectedAccountId ? (
          <>
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
          </>
        ) : (
          <div className="mt-8">
            <MT4ConnectionForm />
          </div>
        )}
      </div>
    </main>
  );
};

export default Index;