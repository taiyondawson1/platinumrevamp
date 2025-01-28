import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from "date-fns";

interface DailyGainProps {
  accountId?: string;
}

interface DailyGainData {
  date: string;
  value: number;
}

const DailyGainChart = ({ accountId }: DailyGainProps) => {
  const [dailyGainData, setDailyGainData] = useState<DailyGainData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDailyGain = async () => {
      if (!accountId) return;

      const session = localStorage.getItem("myfxbook_session");
      if (!session) return;

      setIsLoading(true);
      try {
        // Get dates for last 30 days
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);

        const startStr = format(start, 'yyyy-MM-dd');
        const endStr = format(end, 'yyyy-MM-dd');

        const response = await fetch(
          `https://www.myfxbook.com/api/get-daily-gain.json?session=${encodeURIComponent(
            session
          )}&id=${encodeURIComponent(accountId)}&start=${startStr}&end=${endStr}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch daily gain data");
        }

        const data = await response.json();
        console.log("Daily Gain API Response:", data);

        if (!data.error && data.dailyGain) {
          const formattedData = Object.entries(data.dailyGain).map(([date, value]) => ({
            date,
            value: Number(value),
          }));
          setDailyGainData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching daily gain data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyGain();
  }, [accountId]);

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-softWhite">Daily Gain</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-softWhite">Loading data...</p>
          </div>
        ) : dailyGainData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyGainData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                  stroke="#fff"
                />
                <YAxis stroke="#fff" />
                <Tooltip
                  labelFormatter={(date) => format(parseISO(date as string), 'MMM dd, yyyy')}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Gain']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  dot={false}
                  name="Daily Gain"
                  style={{ stroke: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center bg-darkBlue/40">
            <p className="text-softWhite">No daily gain data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyGainChart;