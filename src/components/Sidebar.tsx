import { BarChart3, Settings, Home, PieChart, Bot, Files, BookOpen, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: LayoutDashboard, label: "TradeHub", path: "/tradehub" },
    { icon: Bot, label: "Expert Advisors", path: "/expert-advisors" },
    { icon: Files, label: "Setfiles", path: "/setfiles" },
    { icon: BookOpen, label: "Courses", path: "/courses" },
    { icon: PieChart, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-[64px] bg-darkBlue/40 backdrop-blur-sm border-r border-mediumGray/20 flex flex-col py-8">
      <div className="space-y-5">
        {navItems.map((item) => {
          const isActive = window.location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center justify-center py-3 transition-all duration-300",
                "hover:bg-highlightGray/5 relative group",
                isActive && "text-softWhite bg-highlightGray/10"
              )}
              title={item.label}
            >
              <div className={cn(
                "absolute left-0 w-1 h-full transition-all duration-300 rounded-r-full",
                isActive ? "bg-gradient-to-r from-indigo-500 to-cyan-500" : "bg-transparent",
                "group-hover:bg-gradient-to-r group-hover:from-indigo-500/50 group-hover:to-cyan-500/50"
              )} />
              <item.icon 
                size={24} 
                className={cn(
                  "transition-all duration-300",
                  isActive ? "text-softWhite filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "text-mediumGray"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;