import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parse } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [startingEquity, setStartingEquity] = useState(10000);
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

          // Get the first trade's date for starting equity
          if (sortedTrades.length > 0) {
            const firstTrade = sortedTrades[0];
            setStartingEquity(10000); // You might want to fetch this from account info
          }

          // Generate daily equity points
          const firstDate = parse(sortedTrades[0].openTime, 'MM/dd/yyyy HH:mm', new Date());
          const lastDate = new Date();
          const dailyEquityPoints: EquityData[] = [];
          let currentDate = firstDate;
          let runningEquity = startingEquity;

          while (currentDate <= lastDate) {
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            const dayTrades = sortedTrades.filter(trade => 
              format(parse(trade.closeTime, 'MM/dd/yyyy HH:mm', new Date()), 'yyyy-MM-dd') === dateStr
            );

            dayTrades.forEach((trade: any) => {
              runningEquity += trade.profit;
            });

            dailyEquityPoints.push({
              date: dateStr,
              equity: runningEquity
            });

            currentDate.setDate(currentDate.getDate() + 1);
          }

          setEquityData(dailyEquityPoints);
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
  }, [accountId, toast, startingEquity]);

  // Calculate Y-axis domain with 5% increments
  const calculateYAxisDomain = () => {
    if (equityData.length === 0) return [0, 100];
    
    const minEquity = Math.min(...equityData.map(d => d.equity));
    const maxEquity = Math.max(...equityData.map(d => d.equity));
    
    // Calculate percentage range
    const minPercent = ((minEquity / startingEquity) - 1) * 100;
    const maxPercent = ((maxEquity / startingEquity) - 1) * 100;
    
    // Round to nearest 5% below and above
    const minRounded = Math.floor(minPercent / 5) * 5;
    const maxRounded = Math.ceil(maxPercent / 5) * 5;
    
    // Convert percentages back to absolute values
    return [
      startingEquity * (1 + minRounded / 100),
      startingEquity * (1 + maxRounded / 100)
    ];
  };

  // Generate ticks for Y-axis in 5% increments
  const generateYAxisTicks = () => {
    const [min, max] = calculateYAxisDomain();
    const minPercent = ((min / startingEquity) - 1) * 100;
    const maxPercent = ((max / startingEquity) - 1) * 100;
    const ticks = [];
    
    for (let i = minPercent; i <= maxPercent; i += 5) {
      ticks.push(startingEquity * (1 + i / 100));
    }
    
    return ticks;
  };

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
          <ScrollArea className="h-[300px] w-full">
            <div style={{ width: `${Math.max(800, equityData.length * 50)}px`, height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={equityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(str) => format(new Date(str), 'MMM dd')}
                    stroke="#fff"
                    interval={Math.floor(equityData.length / 10)}
                  />
                  <YAxis
                    stroke="#fff"
                    domain={calculateYAxisDomain()}
                    ticks={generateYAxisTicks()}
                    tickFormatter={(value) => `${((value / startingEquity - 1) * 100).toFixed(1)}%`}
                  />
                  <Tooltip
                    labelFormatter={(label) => format(new Date(label as string), 'MMM dd, yyyy')}
                    formatter={(value: number) => [
                      `$${value.toFixed(2)} (${((value / startingEquity - 1) * 100).toFixed(1)}%)`,
                      'Equity'
                    ]}
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
          </ScrollArea>
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