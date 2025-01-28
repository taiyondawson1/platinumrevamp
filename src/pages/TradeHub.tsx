import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import HistoryTable from "@/components/HistoryTable";
import DailyGainChart from "@/components/DailyGainChart";
import TotalGainCard from "@/components/TotalGainCard";
import CustomWidgetChart from "@/components/CustomWidgetChart";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OpenTrade {
  id: number;
  ticket: number;
  symbol: string;
  action: string;
  openTime: string;
  openPrice: number;
  sl: number;
  tp: number;
  pips: number;
  profit: number;
  commission: number;
  swap: number;
  comment: string;
  lots: number;
}

interface TradeHistory {
  openTime: string;
  closeTime: string;
  symbol: string;
  action: string;
  sizing: {
    type: string;
    value: string;
  };
  openPrice: number;
  closePrice: number;
  tp: number;
  sl: number;
  comment: string;
  pips: number;
  profit: number;
  interest: number;
  commission: number;
}

interface OpenTradesResponse {
  error: boolean;
  message: string;
  trades: OpenTrade[];
}

interface HistoryResponse {
  error: boolean;
  message: string;
  history: TradeHistory[];
}

const TradeHub = () => {
  const location = useLocation();
  const selectedAccount = location.state?.selectedAccount;
  const [openTrades, setOpenTrades] = useState<OpenTrade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAccount?.id) return;

      const session = localStorage.getItem("myfxbook_session");
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No active session found. Please login again.",
        });
        return;
      }

      setIsLoading(true);
      try {
        // Fetch open trades
        console.log("Fetching trades for account:", selectedAccount.id);
        const openTradesResponse = await fetch(
          `https://www.myfxbook.com/api/get-open-trades.json?session=${encodeURIComponent(
            session
          )}&id=${encodeURIComponent(selectedAccount.id)}`
        );

        if (!openTradesResponse.ok) {
          throw new Error("Failed to fetch open trades");
        }

        const openTradesData: OpenTradesResponse = await openTradesResponse.json();
        console.log("Open Trades API Response:", openTradesData);

        // Fetch trade history
        console.log("Fetching trade history for account:", selectedAccount.id);
        const historyResponse = await fetch(
          `https://www.myfxbook.com/api/get-history.json?session=${encodeURIComponent(
            session
          )}&id=${encodeURIComponent(selectedAccount.id)}`
        );

        if (!historyResponse.ok) {
          throw new Error("Failed to fetch trade history");
        }

        const historyData: HistoryResponse = await historyResponse.json();
        console.log("History API Response:", historyData);

        if (!openTradesData.error && !historyData.error) {
          setOpenTrades(openTradesData.trades || []);
          setTradeHistory(historyData.history || []);
        } else {
          throw new Error(openTradesData.message || historyData.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedAccount?.id, toast]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ml-[64px]">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          TradeHub {selectedAccount ? `- ${selectedAccount.name}` : ""}
        </h2>
      </div>
      <div className="grid gap-4">
        {isLoading ? (
          <Card className="w-full">
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">Loading data...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex gap-4 h-full">
              {/* Left side - Charts */}
              <div className="flex-[3] space-y-4">
                <Card className="w-full">
                  <Tabs defaultValue="daily" className="w-full">
                    <TabsList className="ml-4 mt-4">
                      <TabsTrigger value="daily">Daily Gain</TabsTrigger>
                      <TabsTrigger value="total">Total Gain</TabsTrigger>
                    </TabsList>
                    <TabsContent value="daily">
                      <DailyGainChart accountId={selectedAccount?.id?.toString()} />
                    </TabsContent>
                    <TabsContent value="total">
                      <TotalGainCard accountId={selectedAccount?.id?.toString()} />
                    </TabsContent>
                  </Tabs>
                </Card>
                {selectedAccount?.id && (
                  <CustomWidgetChart 
                    accountId={selectedAccount.id.toString()} 
                    width={600}
                    height={300}
                  />
                )}
                <OpenOrdersTable orders={openTrades} />
              </div>
              
              {/* Right side - Trade History */}
              <div className="flex-1 h-full">
                <Card className="h-full">
                  <HistoryTable history={tradeHistory} />
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TradeHub;