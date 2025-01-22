import { BarChart3, DollarSign, Settings, Home, PieChart, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  
  const mainNavItems = [
    { icon: Home, label: "Dashboard", path: "/" },
  ];

  const tradingNavItems = [
    { icon: BarChart3, label: "Trading", path: "/trading" },
    { icon: Bot, label: "Expert Advisors", path: "/expert-advisors" },
  ];

  const financeNavItems = [
    { icon: DollarSign, label: "Balance", path: "/balance" },
    { icon: PieChart, label: "Analytics", path: "/analytics" },
  ];

  const systemNavItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const renderNavSection = (items: typeof mainNavItems, className?: string) => (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => navigate(item.path)}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            "text-lightGrey hover:text-neonBlue transition-colors duration-300",
            "hover:bg-neonBlue/10",
            window.location.pathname === item.path && "text-neonBlue bg-neonBlue/10"
          )}
        >
          <item.icon size={24} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-black/40 backdrop-blur-sm border-r border-neonBlue/20 flex flex-col items-center py-8">
      {/* Main Navigation */}
      {renderNavSection(mainNavItems, "mb-8")}
      
      {/* Trading Section */}
      {renderNavSection(tradingNavItems, "mb-8")}
      
      {/* Finance Section */}
      {renderNavSection(financeNavItems, "mb-8")}
      
      {/* System Section */}
      <div className="mt-auto">
        {renderNavSection(systemNavItems)}
      </div>
    </div>
  );
};

export default Sidebar;