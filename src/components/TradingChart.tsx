import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";

interface PriceData {
  timestamp: string;
  price: number;
}

const fetchGoldPrice = async (): Promise<PriceData> => {
  // Using a free API for gold prices
  const response = await fetch('https://api.metals.live/v1/spot/gold');
  const data = await response.json();
  return {
    timestamp: new Date().toISOString(),
    price: data[0].price
  };
};

const TradingChart = () => {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);

  const { data: latestPrice } = useQuery({
    queryKey: ['goldPrice'],
    queryFn: fetchGoldPrice,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  useEffect(() => {
    if (latestPrice) {
      setPriceHistory(prev => {
        const newHistory = [...prev, latestPrice];
        // Keep last 30 data points
        return newHistory.slice(-30);
      });
    }
  }, [latestPrice]);

  console.log("Latest gold price data:", latestPrice);
  console.log("Price history:", priceHistory);

  return (
    <div className="chart-container h-[400px] bg-black/20 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">XAUUSD Live Price</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceHistory}>
          <XAxis
            dataKey="timestamp"
            stroke="#cccccc"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis
            stroke="#cccccc"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "1px solid rgba(0,255,255,0.2)",
              borderRadius: "8px",
            }}
            labelFormatter={(value) => new Date(value).toLocaleString()}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#00ffff"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingChart;
