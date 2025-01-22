import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { StatsGrid } from "@/components/StatsGrid";

const Analytics = () => {
  const [accountId, setAccountId] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Demo data - replace with real MT4 API integration
  const demoData = [
    { date: "2024-01-01", value: 10000 },
    { date: "2024-01-15", value: 12000 },
    { date: "2024-01-30", value: 11500 },
    // ... more data points
  ];

  const handleConnect = () => {
    console.log("Connecting account:", accountId);
    setIsConnected(true);
  };

  return (
    <main className="flex-1 ml-16 p-8 space-y-8">
      {!isConnected ? (
        <Card className="p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Connect MT4 Account</h2>
          <div className="space-y-4">
            <Input
              placeholder="Enter MT4 Account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
            <Button onClick={handleConnect} className="w-full">
              Connect Account
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Balance" value="$11,500" />
            <MetricCard label="Total Result" value="+15%" trend="up" />
            <MetricCard label="Today's Result" value="-2.5%" trend="down" />
            <MetricCard label="Active Orders" value="3" />
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Equity Curve</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demoData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <StatsGrid />
        </>
      )}
    </main>
  );
};

export default Analytics;