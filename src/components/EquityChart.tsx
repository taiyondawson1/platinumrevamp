import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parse } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface EquityChartProps {
  accountId?: string;
}

interface EquityData {
  date: string;
  equity: number;
}

const EquityChart = ({ accountId }: EquityChartProps) => {
  const [equityData, setEquityData] = useState<EquityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEquityData = async () => {
      if (!accountId) return;

      const session = localStorage.getItem("myfxbook_session");
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No active session found. Please login again.",
        });
        return;
      }

      try {
        // Get dates for last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const response = await fetch(
          `https://www.myfxbook.com/api/get-history.json?session=${encodeURIComponent(
            session
          )}&id=${encodeURIComponent(accountId)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch history data");
        }

        const data = await response.json();
        console.log("History Data Response:", data);

        if (!data.error && data.history) {
          // Sort trades by date and calculate running equity
          const sortedTrades = data.history
            .sort((a: any, b: any) => {
              const dateA = parse(a.openTime, 'MM/dd/yyyy HH:mm', new Date());
              const dateB = parse(b.openTime, 'MM/dd/yyyy HH:mm', new Date());
              return dateA.getTime() - dateB.getTime();
            });

          let runningEquity = 10000; // Starting equity (you might want to fetch this from account info)
          const equityPoints = sortedTrades.map((trade: any) => {
            runningEquity += trade.profit;
            return {
              date: format(parse(trade.closeTime, 'MM/dd/yyyy HH:mm', new Date()), 'yyyy-MM-dd'),
              equity: runningEquity
            };
          });

          setEquityData(equityPoints);
        }
      } catch (error) {
        console.error("Error fetching history data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch history data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquityData();
  }, [accountId, toast]);

  return (
    <Card className="w-full mt-4 bg-darkBlue/40 border-mediumGray/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-softWhite">Equity Chart</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center bg-darkBlue/40">
            <p className="text-softWhite">Loading data...</p>
          </div>
        ) : equityData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) => format(new Date(str), 'MMM dd')}
                  stroke="#fff"
                />
                <YAxis stroke="#fff" />
                <Tooltip
                  labelFormatter={(label) => format(new Date(label as string), 'MMM dd, yyyy')}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Equity']}
                />
                <Line
                  type="monotone"
                  dataKey="equity"
                  stroke="#4CAF50"
                  dot={false}
                  name="Equity"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center bg-darkBlue/40">
            <p className="text-softWhite">No equity data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EquityChart;