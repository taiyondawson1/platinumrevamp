
import { ArrowRight, BarChart, Bot, BookOpen, Key, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorldClocks from "@/components/WorldClocks";
import PositionSizeCalculator from "@/components/PositionSizeCalculator";
import DailyHabits from "@/components/DailyHabits";
import DashboardGridItem from "@/components/DashboardGridItem";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-1 p-2 sm:p-3 md:p-4 lg:p-5 pt-3 sm:pt-4 lg:pt-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
        {/* Welcome Section */}
        <section className="space-y-1 sm:space-y-2">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-softWhite">Welcome to Your Dashboard</h1>
          <p className="text-mediumGray text-xs sm:text-sm max-w-2xl mx-auto sm:mx-0">
            Manage your trading analysis, expert advisors, and market insights.
            Connect your MyFxBook account to get started.
          </p>
        </section>

        {/* Dashboard Grid Cards */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2 md:gap-3 min-h-[auto] sm:min-h-[20rem] lg:min-h-[25rem]">
          <DashboardGridItem
            area="sm:col-span-1 md:[grid-area:1/1/2/7] lg:[grid-area:1/1/2/5]"
            icon={<Bot className="h-4 w-4 text-silver" />}
            title="Expert Advisors"
            description="Access and manage your automated trading strategies."
            path="/expert-advisors"
          />
          <DashboardGridItem
            area="sm:col-span-1 md:[grid-area:1/7/2/13] lg:[grid-area:2/1/3/5]"
            icon={<BarChart className="h-4 w-4 text-silver" />}
            title="Trading Analysis"
            description="View detailed analytics and performance metrics."
            path="/connect-myfxbook"
          />
          <DashboardGridItem
            area="sm:col-span-1 md:[grid-area:2/1/3/7] lg:[grid-area:1/5/3/9]"
            icon={<Key className="h-4 w-4 text-silver" />}
            title="License Key"
            description="Manage your license key and authorized MT4 accounts."
            path="/license-key"
          />
          <DashboardGridItem
            area="sm:col-span-1 md:[grid-area:2/7/3/13] lg:[grid-area:1/9/2/13]"
            icon={<BookOpen className="h-4 w-4 text-silver" />}
            title="Learning Resources"
            description="Access educational content and trading courses."
            path="/courses"
          />
          <DashboardGridItem
            area="sm:col-span-2 md:[grid-area:3/1/4/13] lg:[grid-area:2/9/3/13]"
            icon={<Users className="h-4 w-4 text-silver" />}
            title="Private Group"
            description="Join our exclusive trading community for insights and support."
            path="/courses"
          />
        </ul>

        {/* World Clocks and Position Size Calculator Section */}
        <div className="flex flex-col lg:flex-row h-auto lg:h-[250px] xl:h-[280px]">
          <section className="flex-1 border border-silver/20 bg-darkBase/40 !rounded-none">
            <WorldClocks />
          </section>
          
          <div className="w-full lg:w-[250px] xl:w-[280px] border-t lg:border-t-0 lg:border-l border-silver/20 !rounded-none">
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
