
import BitcoinAnalysisWidget from "@/components/BitcoinAnalysisWidget";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";
import US30AnalysisWidget from "@/components/US30AnalysisWidget";
import TradingViewTickers from "@/components/TradingViewTickers";

const TradeHub = () => {
  return (
    <div className="flex-1 p-8 pt-6">
      <div className="space-y-4">
        <TradingViewTickers />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <BitcoinAnalysisWidget />
          <TechnicalAnalysisWidget />
          <US30AnalysisWidget />
        </div>
      </div>
    </div>
  );
};

export default TradeHub;
