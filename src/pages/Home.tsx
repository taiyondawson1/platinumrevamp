import TradingChart from "@/components/TradingChart";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";
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
    <main className="flex-1 p-6 max-w-[1200px] mx-auto ml-16">
      <div className="flex flex-col gap-6 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
          {courses.map((course, index) => (
            <div 
              key={index}
              className="metric-card flex flex-col items-center text-center p-4"
            >
              <course.icon className="w-8 h-8 mb-3 text-softWhite" />
              <h3 className="text-lg font-semibold mb-2 text-softWhite">{course.title}</h3>
              <p className="text-mediumGray mb-4 text-sm">{course.description}</p>
              <Button
                onClick={() => window.open(course.url, '_blank')}
                className="bg-darkBlue hover:bg-darkBlue/80 text-softWhite text-sm"
              >
                Start Learning
              </Button>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-6xl">
          <div className="lg:col-span-1">
            <TechnicalAnalysisWidget />
          </div>
          <div className="lg:col-span-2">
            <TradingChart />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;