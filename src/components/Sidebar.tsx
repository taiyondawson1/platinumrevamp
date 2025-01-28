import { Home, Bot, Files, BookOpen, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Sidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: LayoutDashboard, label: "TradeHub", path: "/tradehub" },
    { icon: Bot, label: "Expert Advisors", path: "/expert-advisors" },
    { icon: Files, label: "Setfiles", path: "/setfiles" },
    { icon: BookOpen, label: "Courses", path: "/courses" },
  ];

  return (
    <Card className="fixed left-4 top-4 w-[250px] bg-darkBlue/40 backdrop-blur-sm border-mediumGray/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-softWhite">Contents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {navItems.map((item) => {
          const isActive = window.location.pathname === item.path;
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
              <item.icon 
                size={18} 
                className={cn(
                  "transition-all duration-300",
                  isActive ? "text-softWhite" : "text-mediumGray"
                )}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Sidebar;