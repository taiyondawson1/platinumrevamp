import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Globe, LineChart, Newspaper, Radio } from "lucide-react";

const tools = [
  {
    title: "Economic Calendar",
    description: "Track important economic events",
    icon: BarChart2,
    link: "https://www.forexfactory.com/calendar"
  },
  {
    title: "Currency Correlations",
    description: "Analyze currency pair relationships",
    icon: LineChart,
    link: "https://www.tradingview.com/markets/currencies/cross-rates/"
  },
  {
    title: "TradingView",
    description: "Advanced charting platform",
    icon: Globe,
    link: "https://www.tradingview.com/"
  },
  {
    title: "Watch Live News",
    description: "Stay updated with market news",
    icon: Radio,
    link: "https://www.bloomberg.com/live"
  },
  {
    title: "Read News",
    description: "Latest market analysis",
    icon: Newspaper,
    link: "https://www.forexlive.com/"
  }
];

const ToolsBox = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-softWhite">Trading Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {tools.map((tool) => (
          <Card key={tool.title} className="tradehub-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <tool.icon className="h-6 w-6 text-mediumGray" />
              <h3 className="text-lg font-semibold text-softWhite">{tool.title}</h3>
            </div>
            <p className="text-mediumGray text-sm">{tool.description}</p>
            <Button 
              variant="ghost" 
              className="group w-full"
              onClick={() => window.open(tool.link, '_blank')}
            >
              Visit
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ToolsBox;