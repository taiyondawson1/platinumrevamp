import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "TradeHub", path: "/tradehub" },
  { label: "Expert Advisors", path: "/expert-advisors" },
  { label: "Setfiles", path: "/setfiles" },
  { label: "Courses", path: "/courses" },
];

const toolItems = [
  {
    label: "Economic Calendar",
    url: "https://tradingeconomics.com/calendar",
  },
  {
    label: "Currency Correlations",
    url: "https://www.myfxbook.com/forex-market/correlations",
  },
  {
    label: "TradingView",
    url: "https://www.tradingview.com",
  },
  {
    label: "Watch Live News",
    url: "https://www.youtube.com/live",
  },
  {
    label: "Read News",
    url: "https://www.forexfactory.com/news",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed left-4 mt-[300px]">
      {/* Navigation Box */}
      <div className="bg-darkGrey/30 backdrop-blur-sm border border-silver/20 p-4 w-[250px] mb-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 text-xs",
                  "hover:bg-highlightGray/5 text-left",
                  isActive ? "text-softWhite bg-highlightGray/10" : "text-mediumGray"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Box */}
      <div className="bg-darkGrey/30 backdrop-blur-sm border border-silver/20 p-4 w-[250px]">
        <h3 className="text-xs font-semibold text-softWhite mb-4 px-4">TOOLS</h3>
        <div className="space-y-1">
          {toolItems.map((tool) => (
            <a
              key={tool.label}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-2 text-xs text-mediumGray hover:text-softWhite hover:bg-highlightGray/5 transition-all duration-300"
            >
              {tool.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;