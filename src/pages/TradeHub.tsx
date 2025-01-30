
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import HistoryTable from "@/components/HistoryTable";
import DailyGainChart from "@/components/DailyGainChart";
import DailyDataWidget from "@/components/DailyDataWidget";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTradeData } from "@/hooks/useTradeData";
import { calculateRecentMetrics, calculateTradingMetrics } from "@/utils/metricsCalculator";
import MetricsGrid from "@/components/MetricsGrid";

const TradeHub = () => {
  const location = useLocation();
  const selectedAccount = location.state?.selectedAccount;
  const { openTrades, tradeHistory, isLoading } = useTradeData(selectedAccount?.id);

  const recentMetrics = calculateRecentMetrics(tradeHistory, openTrades, selectedAccount?.balance);
  const tradingMetrics = calculateTradingMetrics(tradeHistory, selectedAccount?.balance, recentMetrics.maxDrawdown);

  return (
    <div className="flex-1 space-y-4 px-[200px] py-4 md:py-8 bg-[#0A0B0F] min-h-screen">
      {isLoading ? (
        <Card className="bg-[#141522]/40 border-[#2A2D3E] backdrop-blur-sm shadow-lg rounded-lg">
          <div className="py-4">
            <p className="text-center text-[#E2E8F0]">Loading data...</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <MetricsGrid
            recentMetrics={recentMetrics}
            tradingMetrics={tradingMetrics}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4 rounded-lg" style={{ height: '400px' }}>
                <DailyGainChart accountId={selectedAccount?.id?.toString()} />
              </Card>
            </div>
            <div className="md:col-span-1">
              <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4 rounded-lg" style={{ height: '400px' }}>
                <ScrollArea className="h-full pr-4">
                  <DailyDataWidget accountId={selectedAccount?.id?.toString()} />
                </ScrollArea>
              </Card>
            </div>
          </div>

          <Card className="bg-[#141522]/40 border-[#2A2D3E] p-4 rounded-lg">
            <HistoryTable history={tradeHistory} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default TradeHub;
