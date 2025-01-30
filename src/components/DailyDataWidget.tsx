
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

export interface DailyData {
  date: string;
  symbol: string;
  profit: number;
}

export const fetchDailyData = async (): Promise<DailyData[]> => {
  // Simulated API response
  return [
    { date: '2024-01-30', symbol: 'EURUSD', profit: 120.50 },
    { date: '2024-01-29', symbol: 'GBPUSD', profit: 85.75 },
    { date: '2024-01-28', symbol: 'USDJPY', profit: -45.20 },
  ];
};

const DailyDataWidget: React.FC = () => {
  const { data = [] } = useQuery({
    queryKey: ['dailyData'],
    queryFn: fetchDailyData
  });

  return (
    <Card className="w-full h-[400px]">
      <ScrollArea className="h-full daily-data-widget">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Daily Trading Data</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2">Date</th>
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Profit</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: DailyData, index: number) => (
                <tr key={index} className="border-t border-border">
                  <td className="py-2">{format(new Date(item.date), 'MMM dd')}</td>
                  <td className="py-2">{item.symbol}</td>
                  <td className="py-2">${item.profit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default DailyDataWidget;
