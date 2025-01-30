
import { useCallback, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

interface DailyGainProps {
  accountId?: string;
}

interface DailyGainResponse {
  error: boolean;
  message: string;
  dailyGain: {
    date: string;
    gain: number;
  }[];
}

const DailyGainChart = ({ accountId }: DailyGainProps) => {
  const [data, setData] = useState<{ date: string; gain: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDailyGain = useCallback(async () => {
    if (!accountId) return;

    const session = localStorage.getItem("myfxbook_session");
    if (!session) {
      console.error("No session found");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching daily gain for account:", accountId);
      const response = await fetch(
        `https://www.myfxbook.com/api/get-daily-gain.json?session=${encodeURIComponent(
          session
        )}&id=${encodeURIComponent(accountId)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch daily gain data");
      }

      const dailyGainData: DailyGainResponse = await response.json();
      console.log("Daily Gain API Response:", dailyGainData);

      if (!dailyGainData.error) {
        setData(
          dailyGainData.dailyGain.map((item) => ({
            date: item.date,
            gain: item.gain,
          }))
        );
      } else {
        console.error("API Error:", dailyGainData.message);
      }
    } catch (error) {
      console.error("Error fetching daily gain:", error);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchDailyGain();
  }, [fetchDailyGain]);

  return (
    <div className="h-[400px] w-full">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-[#8E9196]">Loading chart data...</p>
        </div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#2A2D3E"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(str) => {
                const date = parseISO(str);
                if (date.toString() === "Invalid Date") {
                  return str;
                }
                return format(date, "MMM d");
              }}
              stroke="#8E9196"
              tick={{ fontSize: 12 }}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#8E9196"
              tick={{ fontSize: 12 }}
              axisLine={false}
              dx={-10}
              tickFormatter={(value) => `${value}k`}
              domain={[-2, 4]}
              ticks={[-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]}
            />
            <Tooltip
              labelFormatter={(label) => {
                const date = parseISO(label);
                return format(date, "MMMM d, yyyy");
              }}
              formatter={(value: number) => [`${value.toFixed(2)}k`, "Gain"]}
              contentStyle={{
                backgroundColor: "#1D1F33",
                border: "1px solid #2A2D3E",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#E2E8F0" }}
              itemStyle={{ color: "#0EA5E9" }}
            />
            <Area
              type="monotone"
              dataKey="gain"
              stroke="#0EA5E9"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#gainGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-[#8E9196]">No data available</p>
        </div>
      )}
    </div>
  );
};

export default DailyGainChart;
