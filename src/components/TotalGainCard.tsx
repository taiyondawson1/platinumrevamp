
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parse } from "date-fns";

interface TotalGainCardProps {
  accountId?: string;
}

interface GainData {
  date: string;
  value: number;
}

const TotalGainCard = ({ accountId }: TotalGainCardProps) => {
  const [gainData, setGainData] = useState<GainData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTotalGain = async () => {
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

      setIsLoading(true);
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const response = await fetch(
          `https://www.myfxbook.com/api/get-daily-gain.json?session=${encodeURIComponent(
            session
          )}&id=${encodeURIComponent(accountId)}&start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch total gain data");
        }

        const data = await response.json();
        console.log("Total Gain API Response:", data);

        if (!data.error && data.dailyGain) {
          const formattedData = data.dailyGain.flat().map((item: any) => {
            try {
              const parsedDate = parse(item.date, 'MM/dd/yyyy', new Date());
              return {
                date: format(parsedDate, 'MMM dd'),
                value: Number(item.value),
              };
            } catch (error) {
              console.error("Error parsing date:", item.date, error);
              return null;
            }
          }).filter((item): item is GainData => item !== null);
          
          setGainData(formattedData);
        } else {
          throw new Error(data.message || "Failed to fetch total gain data");
        }
      } catch (error) {
        console.error("Error fetching total gain:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch total gain data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalGain();
  }, [accountId, toast]);

  return (
    <div className="rounded-xl bg-[#141522]/40 shadow-[inset_0_1px_4px_rgba(255,255,255,0.1)] hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.1)] transition-all duration-200 border border-white/5">
      <div className="flex items-center justify-center p-4 border-b border-white/5">
        <h3 className="text-sm text-white/70 font-medium">
          Total Gain (30 Days)
        </h3>
      </div>
      <div className="p-4 h-[300px]">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-center text-white/70">Loading...</p>
          </div>
        ) : gainData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gainData}>
              <defs>
                <linearGradient id="gainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="#403E43"
                opacity={0.4}
              />
              <XAxis 
                dataKey="date"
                stroke="#8E9196"
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#8E9196"
                tickLine={false}
                axisLine={false}
                dx={-10}
                tickFormatter={(value) => `${value}%`}
                tick={({ x, y, payload }) => (
                  <text
                    x={x}
                    y={y}
                    dy={3}
                    fill={payload.value >= 0 ? '#39FF14' : '#FF1744'}
                    style={{
                      filter: `drop-shadow(0 0 2px ${payload.value >= 0 ? '#39FF14' : '#FF1744'})`
                    }}
                    textAnchor="end"
                  >
                    {`${payload.value}%`}
                  </text>
                )}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2C',
                  border: '1px solid #403E43',
                  borderRadius: '6px',
                  color: '#fff'
                }}
                formatter={(value: number) => [
                  <span style={{
                    color: value >= 0 ? '#39FF14' : '#FF1744',
                    textShadow: `0 0 5px ${value >= 0 ? '#39FF14' : '#FF1744'}`
                  }}>
                    {`${value.toFixed(2)}%`}
                  </span>,
                  'Gain'
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={gainData[gainData.length - 1]?.value >= 0 ? "#39FF14" : "#FF1744"}
                fillOpacity={1}
                fill="url(#gainGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-center text-white/70">No gain data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalGainCard;
