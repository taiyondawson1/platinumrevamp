
import { Card } from "@/components/ui/card";
import { CalendarDays, ArrowLeftRight, LineChart, Radio, Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tools = [
  {
    icon: <CalendarDays className="h-6 w-6" />,
    title: "Economic Calendar",
    description: "View upcoming economic events",
    path: "/calendar"
  },
  {
    icon: <ArrowLeftRight className="h-6 w-6" />,
    title: "Currency Correlations",
    description: "Analyze currency pair correlations",
    path: "/correlations"
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "TradingView",
    description: "Advanced charting platform",
    path: "/charts"
  },
  {
    icon: <Radio className="h-6 w-6" />,
    title: "Watch Live News",
    description: "Stay updated with live market news",
    path: "/live-news"
  },
  {
    icon: <Newspaper className="h-6 w-6" />,
    title: "Read News",
    description: "Latest forex market news",
    path: "/news"
  }
];

const ToolsBar = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {tools.map((tool, index) => (
        <Card
          key={index}
          className="!rounded-none bg-darkBlue/40 border-silver/20 backdrop-blur-sm p-4 cursor-pointer hover:bg-darkBlue/60 transition-colors"
          onClick={() => navigate(tool.path)}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="text-softWhite">{tool.icon}</div>
            <h3 className="text-lg font-semibold text-softWhite">{tool.title}</h3>
            <p className="text-sm text-mediumGray">{tool.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ToolsBar;
