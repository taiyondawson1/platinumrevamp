import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import MetricCard from "@/components/MetricCard";
import { Card } from "@/components/ui/card";

const AccountMetrics = () => {
  const [accountId, setAccountId] = useState("");
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid account ID",
        variant: "destructive",
      });
      return;
    }
    
    // For demo purposes, we'll simulate a successful connection
    setIsConnected(true);
    toast({
      title: "Success",
      description: "Account connected successfully",
    });
  };

  return (
    <div className="space-y-6">
      {!isConnected ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Connect Your Trading Account</h2>
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter your account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="bg-darkBlue/50 text-white"
              />
            </div>
            <Button type="submit">Connect Account</Button>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Account Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Balance" value="$25,430.50" trend="up" />
            <MetricCard label="Equity" value="$27,890.20" trend="up" />
            <MetricCard label="Today's P/L" value="+$1,245.30" trend="up" />
            <MetricCard label="Open Positions" value="8" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMetrics;