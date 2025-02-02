
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorldClocks from "@/components/WorldClocks";
import PositionSizeCalculator from "@/components/PositionSizeCalculator";
import DailyHabits from "@/components/DailyHabits";
import ToolsBar from "@/components/ToolsBar";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-1 p-4 lg:p-6 max-w-[1200px] mx-auto overflow-x-hidden">
      <div className="flex flex-col gap-4 lg:gap-6">
        {/* Welcome Section */}
        <section className="space-y-2 lg:space-y-4">
          <h1 className="text-2xl lg:text-4xl font-bold text-softWhite">Welcome to Your Dashboard</h1>
          <p className="text-base lg:text-lg text-mediumGray max-w-2xl">
            Manage your trading analysis, expert advisors, and market insights.
            Connect your MyFxBook account to get started.
          </p>
        </section>

        {/* Tools Bar */}
        <ToolsBar />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="!rounded-none bg-darkBlue/40 border-silver/20 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-4 lg:p-6 space-y-3">
            <h3 className="text-lg lg:text-xl font-semibold text-softWhite">Expert Advisors</h3>
            <p className="text-sm lg:text-base text-mediumGray">Access and manage your automated trading strategies.</p>
            <Button 
              variant="ghost" 
              className="group !rounded-none"
              onClick={() => navigate('/expert-advisors')}
            >
              Explore EAs
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          <Card className="!rounded-none bg-darkBlue/40 border-silver/20 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-4 lg:p-6 space-y-3">
            <h3 className="text-lg lg:text-xl font-semibold text-softWhite">Trading Analysis</h3>
            <p className="text-sm lg:text-base text-mediumGray">View detailed analytics and performance metrics.</p>
            <Button 
              variant="ghost" 
              className="group !rounded-none"
              onClick={() => navigate('/connect-myfxbook')}
            >
              View Analytics
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          <Card className="!rounded-none bg-darkBlue/40 border-silver/20 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-4 lg:p-6 space-y-3">
            <h3 className="text-lg lg:text-xl font-semibold text-softWhite">Learning Resources</h3>
            <p className="text-sm lg:text-base text-mediumGray">Access educational content and trading courses.</p>
            <Button 
              variant="ghost" 
              className="group !rounded-none"
              onClick={() => navigate('/courses')}
            >
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>

        {/* World Clocks and Position Size Calculator Section */}
        <div className="flex flex-col lg:flex-row h-[300px] lg:h-[340px]">
          <section className="flex-1 border border-silver/20 bg-darkBase/40 !rounded-none">
            <WorldClocks />
          </section>
          
          <div className="w-full lg:w-[325px] border-l border-silver/20 !rounded-none">
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
