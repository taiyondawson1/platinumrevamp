
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorldClocks from "@/components/WorldClocks";
import PositionSizeCalculator from "@/components/PositionSizeCalculator";
import DailyHabits from "@/components/DailyHabits";
import ToolsBar from "@/components/ToolsBar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeSubscription } from "@/hooks/use-realtime-subscription";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };

    getUserId();
  }, []);

  // Subscribe to license key updates if userId is available
  useRealtimeSubscription({
    table: 'license_keys',
    event: 'UPDATE',
    filter: 'user_id',
    filterValue: userId || '',
    onDataChange: (payload) => {
      console.log('License key updated:', payload);
      toast({
        title: "License Updated",
        description: "Your license information has been updated.",
      });
    }
  });

  // Subscribe to customer_requests updates
  useRealtimeSubscription({
    table: 'customer_requests',
    event: 'UPDATE',
    onDataChange: (payload) => {
      if (payload.new.status === 'approved') {
        toast({
          title: "Request Approved",
          description: "One of your requests has been approved.",
        });
      } else if (payload.new.status === 'rejected') {
        toast({
          variant: "destructive",
          title: "Request Rejected",
          description: "One of your requests has been rejected.",
        });
      }
    }
  });

  return (
    <main className="flex-1 p-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-softWhite">Welcome to Your Dashboard</h1>
          <p className="text-mediumGray text-lg max-w-2xl">
            Manage your trading analysis, expert advisors, and market insights.
            Connect your MyFxBook account to get started.
          </p>
        </section>

        {/* Tools Bar */}
        <ToolsBar />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="!rounded-none bg-darkBlue/40 border-silver/20 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-softWhite">Expert Advisors</h3>
            <p className="text-mediumGray">Access and manage your automated trading strategies.</p>
            <Button 
              variant="ghost" 
              className="group !rounded-none"
              onClick={() => navigate('/expert-advisors')}
            >
              Explore EAs
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          <Card className="!rounded-none bg-darkBlue/40 border-silver/20 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-softWhite">Trading Analysis</h3>
            <p className="text-mediumGray">View detailed analytics and performance metrics.</p>
            <Button 
              variant="ghost" 
              className="group !rounded-none"
              onClick={() => navigate('/connect-myfxbook')}
            >
              View Analytics
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          <Card className="!rounded-none bg-darkBlue/40 border-silver/20 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-softWhite">Learning Resources</h3>
            <p className="text-mediumGray">Access educational content and trading courses.</p>
            <Button 
              variant="ghost" 
              className="group !rounded-none"
              onClick={() => navigate('/courses')}
            >
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
          
          <Card className="!rounded-none bg-darkBlue/40 border-silver/20 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-softWhite">License Key</h3>
            <p className="text-mediumGray">Manage your license key and authorized MT4 accounts.</p>
            <Button 
              variant="ghost" 
              className="group !rounded-none"
              onClick={() => navigate('/license-key')}
            >
              Manage License
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>

        {/* World Clocks and Position Size Calculator Section */}
        <div className="flex flex-col lg:flex-row h-[340px]">
          <section className="flex-1 border border-silver/20 bg-darkBase/40 !rounded-none">
            <WorldClocks />
          </section>
          
          <div className="w-[325px] border-l border-silver/20 !rounded-none">
            <PositionSizeCalculator />
          </div>
        </div>

        {/* Daily Habits Section */}
        <DailyHabits />
      </div>
    </main>
  );
};

export default Dashboard;
