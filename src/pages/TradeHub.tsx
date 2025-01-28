import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import HistoryTable from "@/components/HistoryTable";
import DailyGainChart from "@/components/DailyGainChart";
import TotalGainCard from "@/components/TotalGainCard";
import CustomWidget from "@/components/CustomWidget";
import GainWidget from "@/components/GainWidget";
import CommunityOutlookWidget from "@/components/CommunityOutlookWidget";
import DailyDataWidget from "@/components/DailyDataWidget";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";
import US30AnalysisWidget from "@/components/US30AnalysisWidget";
import BitcoinAnalysisWidget from "@/components/BitcoinAnalysisWidget";
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
    <>
      <div className="flex-1 space-y-3 p-4 md:p-6 pt-4 ml-[94px] mx-[25%] flex flex-col items-center">
        {isLoading ? (
          <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
            <CardContent className="py-4">
              <p className="text-center text-softWhite">Loading data...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-3 w-full">
              <div className="flex gap-3 justify-center flex-wrap">
                <TechnicalAnalysisWidget />
                <US30AnalysisWidget />
                <BitcoinAnalysisWidget />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TotalGainCard accountId={selectedAccount?.id?.toString()} />
                <GainWidget accountId={selectedAccount?.id?.toString()} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
                  <Tabs defaultValue="daily" className="w-full">
                    <TabsList className="ml-4 mt-3 bg-darkBlue/60">
                      <TabsTrigger value="daily" className="text-softWhite data-[state=active]:bg-darkBlue/80">
                        Daily Gain
                      </TabsTrigger>
                      <TabsTrigger value="total" className="text-softWhite data-[state=active]:bg-darkBlue/80">
                        Total Gain
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="daily">
                      <DailyGainChart accountId={selectedAccount?.id?.toString()} />
                    </TabsContent>
                    <TabsContent value="total">
                      <CustomWidget 
                        session={localStorage.getItem("myfxbook_session") || ""}
                        accountId={selectedAccount?.id?.toString()}
                        width={600}
                        height={300}
                      />
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
              <CommunityOutlookWidget />
              <DailyDataWidget accountId={selectedAccount?.id?.toString()} />
              <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
                <CardContent className="p-0">
                  <OpenOrdersTable orders={openTrades} />
                </CardContent>
              </Card>
              <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
                <CardContent className="p-0">
                  <HistoryTable history={tradeHistory} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TradeHub;