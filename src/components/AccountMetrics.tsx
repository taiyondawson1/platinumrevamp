import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AccountMetric {
  balance: number;
  equity: number;
  floating: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  openPositions: number;
  timestamp: string;
}

const AccountMetrics = ({ accountId }: { accountId: string }) => {
  const { toast } = useToast();

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['account-metrics', accountId],
    queryFn: async () => {
      try {
        // This is a mock fetch - replace with your actual API endpoint
        const response = await fetch(`/api/account-metrics/${accountId}`);
        if (!response.ok) throw new Error('Failed to fetch account metrics');
        return response.json() as Promise<AccountMetric>;
      } catch (err) {
        console.error('Error fetching account metrics:', err);
        toast({
          title: "Error",
          description: "Failed to fetch account metrics. Please try again later.",
          variant: "destructive",
        });
        throw err;
      }
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return <MetricsSkeleton />;
  }

  if (error || !metrics) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-darkBlue/40 backdrop-blur-sm border-mediumGray/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-softWhite">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-softWhite">${metrics.balance.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card className="bg-darkBlue/40 backdrop-blur-sm border-mediumGray/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-softWhite">Equity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-softWhite">${metrics.equity.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card className="bg-darkBlue/40 backdrop-blur-sm border-mediumGray/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-softWhite">Floating P/L</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metrics.floating >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${metrics.floating.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-darkBlue/40 backdrop-blur-sm border-mediumGray/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-softWhite">Margin Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-softWhite">{metrics.marginLevel.toFixed(2)}%</div>
        </CardContent>
      </Card>

      <Card className="bg-darkBlue/40 backdrop-blur-sm border-mediumGray/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-softWhite">Free Margin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-softWhite">${metrics.freeMargin.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card className="bg-darkBlue/40 backdrop-blur-sm border-mediumGray/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-softWhite">Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-softWhite">{metrics.openPositions}</div>
        </CardContent>
      </Card>
    </div>
  );
};

const MetricsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="bg-darkBlue/40 backdrop-blur-sm border-mediumGray/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[120px]" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default AccountMetrics;