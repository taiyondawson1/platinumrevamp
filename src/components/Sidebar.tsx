import { BarChart3, Settings, Home, PieChart, Bot, Files } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: BarChart3, label: "Trading", path: "/trading" },
    { icon: Bot, label: "Expert Advisors", path: "/expert-advisors" },
    { icon: Files, label: "Setfiles", path: "/setfiles" },
    { icon: PieChart, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-black/40 backdrop-blur-sm border-r border-neonBlue/20 flex flex-col items-center py-8">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => navigate(item.path)}
          className={cn(
            "w-12 h-12 mb-4 rounded-lg flex items-center justify-center",
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
};

export default Sidebar;