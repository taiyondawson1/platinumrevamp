
import { ArrowRight, BarChart, Bot, BookOpen, Key, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorldClocks from "@/components/WorldClocks";
import PositionSizeCalculator from "@/components/PositionSizeCalculator";
import DailyHabits from "@/components/DailyHabits";
import DashboardGridItem from "@/components/DashboardGridItem";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-1 p-3 sm:p-4 lg:p-6 pt-6 sm:pt-8 lg:pt-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Welcome Section */}
        <section className="space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-softWhite">Welcome to Your Dashboard</h1>
          <p className="text-mediumGray text-xs sm:text-sm md:text-base max-w-2xl">
            Manage your trading analysis, expert advisors, and market insights.
            Connect your MyFxBook account to get started.
          </p>
        </section>

        {/* Dashboard Grid Cards */}
        <ul className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 min-h-[auto] sm:min-h-[25rem] lg:min-h-[30rem]">
          <DashboardGridItem
            area="md:[grid-area:1/1/2/7] lg:[grid-area:1/1/2/5]"
            icon={<Bot className="h-4 w-4 sm:h-5 sm:w-5 text-silver" />}
            title="Expert Advisors"
            description="Access and manage your automated trading strategies."
            path="/expert-advisors"
          />
          <DashboardGridItem
            area="md:[grid-area:1/7/2/13] lg:[grid-area:2/1/3/5]"
            icon={<BarChart className="h-4 w-4 sm:h-5 sm:w-5 text-silver" />}
            title="Trading Analysis"
            description="View detailed analytics and performance metrics."
            path="/connect-myfxbook"
          />
          <DashboardGridItem
            area="md:[grid-area:2/1/3/7] lg:[grid-area:1/5/3/9]"
            icon={<Key className="h-4 w-4 sm:h-5 sm:w-5 text-silver" />}
            title="License Key"
            description="Manage your license key and authorized MT4 accounts."
            path="/license-key"
          />
          <DashboardGridItem
            area="md:[grid-area:2/7/3/13] lg:[grid-area:1/9/2/13]"
            icon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-silver" />}
            title="Learning Resources"
            description="Access educational content and trading courses."
            path="/courses"
          />
          <DashboardGridItem
            area="md:[grid-area:3/1/4/13] lg:[grid-area:2/9/3/13]"
            icon={<Users className="h-4 w-4 sm:h-5 sm:w-5 text-silver" />}
            title="Private Group"
            description="Join our exclusive trading community for insights and support."
            path="/courses"
          />
        </ul>

        {/* World Clocks and Position Size Calculator Section */}
        <div className="flex flex-col lg:flex-row h-auto lg:h-[280px] xl:h-[320px]">
          <section className="flex-1 border border-silver/20 bg-darkBase/40 !rounded-none">
            <WorldClocks />
          </section>
          
          <div className="w-full lg:w-[280px] xl:w-[325px] border-t lg:border-t-0 lg:border-l border-silver/20 !rounded-none">
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
