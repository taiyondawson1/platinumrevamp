import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

interface AccountMetric {
  balance: number;
  equity: number;
  floating: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  openPositions: number;
  timestamp: string;
  account_id: string;
}

const AccountMetrics = ({ accountId }: { accountId: string }) => {
  const { toast } = useToast();

  const { data: metrics, isLoading, error, refetch } = useQuery({
    queryKey: ['account-metrics', accountId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('account_metrics')
          .select('*')
          .eq('account_id', accountId)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        return data as AccountMetric;
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
  });

  useEffect(() => {
    const channel = supabase
      .channel('account_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'account_metrics',
          filter: `account_id=eq.${accountId}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [accountId, refetch]);

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