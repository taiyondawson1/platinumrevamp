import { BarChart3, DollarSign, Settings, Home, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: "Dashboard" },
    { icon: BarChart3, label: "Trading" },
    { icon: DollarSign, label: "Balance" },
    { icon: PieChart, label: "Analytics" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-black/40 backdrop-blur-sm border-r border-neonBlue/20 flex flex-col items-center py-8">
      {navItems.map((item, index) => (
        <button
          key={item.label}
          className={cn(
            "w-12 h-12 mb-4 rounded-lg flex items-center justify-center",
            "text-lightGrey hover:text-neonBlue transition-colors duration-300",
            "hover:bg-neonBlue/10",
            index === 0 && "text-neonBlue bg-neonBlue/10"
          )}
        >
          <item.icon size={24} />
        </button>
      ))}
    </div>
  );
};

export default Sidebar;