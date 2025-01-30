
import TechnicalAnalysisWidget from "./TechnicalAnalysisWidget";
import US30AnalysisWidget from "./US30AnalysisWidget";
import BitcoinAnalysisWidget from "./BitcoinAnalysisWidget";

const TradeAnalytics = () => {
  return (
    <div className="flex gap-3 justify-start w-full overflow-x-auto">
      <TechnicalAnalysisWidget />
      <US30AnalysisWidget />
      <BitcoinAnalysisWidget />
    </div>
  );
};

export default TradeAnalytics;
