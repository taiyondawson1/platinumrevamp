
import { Card } from "@/components/ui/card";
import { CalendarDays, ArrowLeftRight, LineChart, Radio, Newspaper } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

const tools = [
  {
    icon: <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />,
    title: "Economic Calendar",
    description: "View upcoming economic events",
    externalLink: "https://www.myfxbook.com/forex-economic-calendar"
  },
  {
    icon: <ArrowLeftRight className="h-5 w-5 sm:h-6 sm:w-6" />,
    title: "Currency Correlations",
    description: "Analyze currency pair correlations",
    externalLink: "https://www.myfxbook.com/forex-market/correlation"
  },
  {
    icon: <LineChart className="h-5 w-5 sm:h-6 sm:w-6" />,
    title: "TradingView",
    description: "Advanced charting platform",
    externalLink: "https://www.tradingview.com/chart"
  },
  {
    icon: <Radio className="h-5 w-5 sm:h-6 sm:w-6" />,
    title: "Watch Live News",
    description: "Stay updated with live market news",
    externalLink: "https://www.youtube.com/channel/UC4R8DWoMoI7CAwX8_LjQHig"
  },
  {
    icon: <Newspaper className="h-5 w-5 sm:h-6 sm:w-6" />,
    title: "Read News",
    description: "Latest forex market news",
    externalLink: "https://www.forexfactory.com/calendar"
  }
];

const ToolsBar = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {tools.map((tool, index) => (
        <Card
          key={index}
          className="!rounded-none bg-darkBlue/40 border-[#1D1D1D] backdrop-blur-sm p-3 sm:p-4 cursor-pointer hover:bg-darkBlue/60 transition-colors shadow-lg hover:shadow-xl"
          onClick={() => window.open(tool.externalLink, '_blank', 'noopener,noreferrer')}
        >
          <div className="flex flex-col items-center text-center gap-1 sm:gap-2">
            <div className="text-softWhite">{tool.icon}</div>
            <h3 className="text-base sm:text-lg font-semibold text-softWhite">{tool.title}</h3>
            <p className={`text-xs sm:text-sm text-mediumGray ${isMobile ? 'hidden' : 'block'}`}>{tool.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ToolsBar;
