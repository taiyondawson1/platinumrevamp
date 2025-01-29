import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format, parse } from "date-fns";

interface DailyData {
  date: string;
  balance: number;
  pips: number;
  lots: number;
  floatingPL: number;
  profit: number;
  growthEquity: number;
  floatingPips: number;
}

interface DailyDataResponse {
  error: boolean;
  message: string;
  dataDaily: DailyData[][];
}

interface DailyDataWidgetProps {
  accountId?: string;
}

const DailyDataWidget = ({ accountId }: DailyDataWidgetProps) => {
  const [data, setData] = useState<DailyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
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
        // Get dates for last 12 days instead of 30
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 12);

        const response = await fetch(
          `https://www.myfxbook.com/api/get-data-daily.json?session=${encodeURIComponent(
            session
          )}&id=${encodeURIComponent(accountId)}&start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch daily data");
        }

        const responseData: DailyDataResponse = await response.json();
        console.log("Daily Data Response:", responseData);

        if (!responseData.error) {
          // Flatten the nested array and format dates, limit to 12 rows
          const formattedData = responseData.dataDaily.flat()
            .map(item => ({
              ...item,
              date: format(parse(item.date, 'MM/dd/yyyy', new Date()), 'MMM dd, yyyy')
            }))
            .slice(0, 12); // Limit to 12 rows
          setData(formattedData);
        } else {
          throw new Error(responseData.message || "Failed to fetch daily data");
        }
      } catch (error) {
        console.error("Error fetching daily data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch daily data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accountId, toast]);

  return (
    <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Daily Trading Data</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-4">Loading data...</p>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Pips</TableHead>
                  <TableHead>Lots</TableHead>
                  <TableHead>Floating P/L</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>${item.balance.toFixed(2)}</TableCell>
                    <TableCell>{item.pips.toFixed(1)}</TableCell>
                    <TableCell>{item.lots.toFixed(2)}</TableCell>
                    <TableCell>${item.floatingPL.toFixed(2)}</TableCell>
                    <TableCell>${item.profit.toFixed(2)}</TableCell>
                    <TableCell>{item.growthEquity.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">No data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyDataWidget;