import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

interface OpenTradesResponse {
  error: boolean;
  message: string;
  trades: OpenTrade[];
}

const TradeHub = () => {
  const location = useLocation();
  const selectedAccount = location.state?.selectedAccount;
  const [openTrades, setOpenTrades] = useState<OpenTrade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOpenTrades = async () => {
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
        const response = await fetch(
          `https://www.myfxbook.com/api/get-open-trades.json?session=${encodeURIComponent(
            session
          )}&id=${encodeURIComponent(selectedAccount.id)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch open trades");
        }

        const data: OpenTradesResponse = await response.json();

        if (!data.error) {
          setOpenTrades(data.trades || []);
        } else {
          throw new Error(data.message || "Failed to fetch open trades");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch open trades",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpenTrades();
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
              <p className="text-center text-muted-foreground">Loading open trades...</p>
            </CardContent>
          </Card>
        ) : (
          <OpenOrdersTable orders={openTrades} />
        )}
      </div>
    </div>
  );
};

export default TradeHub;