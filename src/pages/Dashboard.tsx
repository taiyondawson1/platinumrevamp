import MyFxBookLogin from "@/components/MyFxBookLogin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorldClocks from "@/components/WorldClocks";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-1 p-6 max-w-[1400px] mx-auto overflow-hidden">
      <div className="flex flex-col gap-8">
        {/* World Clocks */}
        <section className="mb-8 border border-silver/20 p-8">
          <WorldClocks />
        </section>

        {/* Welcome Section */}
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-softWhite">Welcome to Your Dashboard</h1>
          <p className="text-mediumGray text-lg max-w-2xl">
            Manage your trading analysis, expert advisors, and market insights.
            Connect your MyFxBook account to get started.
          </p>
        </section>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="tradehub-card p-6 space-y-4">
            <h3 className="text-xl font-semibold text-softWhite">Expert Advisors</h3>
            <p className="text-mediumGray">Access and manage your automated trading strategies.</p>
            <Button 
              variant="ghost" 
              className="group"
              onClick={() => navigate('/expert-advisors')}
            >
              Explore EAs
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          <Card className="tradehub-card p-6 space-y-4">
            <h3 className="text-xl font-semibold text-softWhite">Trading Analysis</h3>
            <p className="text-mediumGray">View detailed analytics and performance metrics.</p>
            <Button 
              variant="ghost" 
              className="group"
              onClick={() => navigate('/trading')}
            >
              View Analytics
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          <Card className="tradehub-card p-6 space-y-4">
            <h3 className="text-xl font-semibold text-softWhite">Learning Resources</h3>
            <p className="text-mediumGray">Access educational content and trading courses.</p>
            <Button 
              variant="ghost" 
              className="group"
              onClick={() => navigate('/courses')}
            >
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>

        {/* MyFxBook Login Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-softWhite">Connect Your Account</h2>
          <MyFxBookLogin />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;