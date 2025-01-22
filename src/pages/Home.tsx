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
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {courses.map((course, index) => (
            <Button
              key={index}
              onClick={() => window.open(course.url, '_blank')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-3 bg-darkBlue/50 hover:bg-darkBlue/70 border-mediumGray/20 shadow-embossed hover:shadow-embossed-hover transition-all duration-300"
            >
              <course.icon className="w-6 h-6 text-softWhite" />
              <div className="space-y-2 text-center">
                <h3 className="text-base font-semibold text-softWhite">{course.title}</h3>
                <p className="text-xs text-mediumGray">{course.description}</p>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="flex gap-4 justify-center">
          <div className="w-[400px]">
            <TechnicalAnalysisWidget />
          </div>
        </div>
        <div className="flex-1">
          <TradingChart />
        </div>
      </div>
    </main>
  );
};

export default Index;