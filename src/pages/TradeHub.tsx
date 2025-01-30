import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import MetaTraderConnection from "@/components/MetaTraderConnection";
import DailyGainChart from "@/components/DailyGainChart";
import DailyDataWidget from "@/components/DailyDataWidget";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import HistoryTable from "@/components/HistoryTable";
import { Card } from "@/components/ui/card";
import StatsGrid from "@/components/StatsGrid";

const TradeHub = () => {
  const { data: openTrades = [] } = useQuery({
    queryKey: ["openTrades"],
    queryFn: async () => {
      // Simulated data for open trades
      return [];
    },
  });

  const { data: tradeHistory = [] } = useQuery({
    queryKey: ["tradeHistory"],
    queryFn: async () => {
      // Simulated data for trade history
      return [];
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <MetaTraderConnection />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DailyGainChart />
          <Card className="w-full bg-[#141522]/40 border-[#2A2D3E]">
            <ScrollArea className="h-[400px] w-full">
              <DailyDataWidget />
            </ScrollArea>
          </Card>
        </div>

        <StatsGrid />
        
        <OpenOrdersTable orders={openTrades} />
        <HistoryTable history={tradeHistory} />
      </div>
    </div>
  );
};

export default TradeHub;
