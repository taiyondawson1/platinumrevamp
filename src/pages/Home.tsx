import TradingChart from "@/components/TradingChart";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";
import MarketHours from "@/components/MarketHours";
import { BookOpen, TrendingUp, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const courses = [
    {
      title: "Technical Analysis Fundamentals",
      description: "Learn the basics of chart patterns, indicators, and market analysis",
      icon: LineChart,
      url: "https://www.udemy.com/course/technical-analysis-complete-course/",
    },
    {
      title: "Trading Psychology Mastery",
      description: "Master the mental aspects of trading and develop a winning mindset",
      icon: BookOpen,
      url: "https://www.udemy.com/course/trading-psychology/",
    },
    {
      title: "Advanced Trading Strategies",
      description: "Advanced techniques for market analysis and trade execution",
      icon: TrendingUp,
      url: "https://www.coursera.org/learn/trading-strategies",
    },
  ];

  return (
    <main className="flex-1 p-4 max-w-[1400px] mx-auto space-y-4">
      {/* Market Hours Widget */}
      <div className="w-full max-w-[1400px] mx-auto mb-4">
        <MarketHours />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Technical Analysis */}
        <div className="lg:col-span-1">
          <TechnicalAnalysisWidget />
        </div>

        {/* Center and Right Columns - Trading Chart */}
        <div className="lg:col-span-2">
          <TradingChart />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {courses.map((course, index) => (
          <div 
            key={index}
            className="metric-card flex flex-col items-center text-center p-4"
          >
            <course.icon className="w-6 h-6 mb-2 text-softWhite" />
            <h3 className="text-base font-semibold mb-2 text-softWhite">{course.title}</h3>
            <p className="text-xs text-mediumGray mb-3">{course.description}</p>
            <Button
              onClick={() => window.open(course.url, '_blank')}
              className="bg-darkBlue hover:bg-darkBlue/80 text-softWhite text-xs px-3 py-1"
            >
              Start Learning
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Index;