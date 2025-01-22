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
    <main className="flex-1 p-6 max-w-[1400px] mx-auto ml-16">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div 
              key={index}
              className="metric-card flex flex-col items-center text-center"
            >
              <course.icon className="w-12 h-12 mb-4 text-softWhite" />
              <h3 className="text-xl font-semibold mb-2 text-softWhite">{course.title}</h3>
              <p className="text-mediumGray mb-6">{course.description}</p>
              <Button
                onClick={() => window.open(course.url, '_blank')}
                className="bg-darkBlue hover:bg-darkBlue/80 text-softWhite"
              >
                Start Learning
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-4">
          <div className="w-[425px]">
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