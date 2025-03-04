import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, BarChart, Bot, FileText, BookOpen, LogOut, Key } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeSubscription } from "@/hooks/use-realtime-subscription";
import { useState, useEffect } from "react";

const menuItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "TradeHub", path: "/tradehub", icon: BarChart },
  { label: "Expert Advisors", path: "/expert-advisors", icon: Bot },
  { label: "Setfiles", path: "/setfiles", icon: FileText },
  { label: "Courses", path: "/courses", icon: BookOpen },
  { label: "License Key", path: "/license-key", icon: Key },
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
  const { toast } = useToast();

  const [notificationCount, setNotificationCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };

    getUserId();
  }, []);

  useRealtimeSubscription({
    table: 'customer_requests',
    event: 'INSERT',
    onDataChange: () => {
      setNotificationCount(prev => prev + 1);
    }
  });

  useRealtimeSubscription({
    table: 'license_keys',
    event: 'UPDATE',
    filter: 'user_id',
    filterValue: userId || '',
    onDataChange: () => {
      setNotificationCount(prev => prev + 1);
    }
  });

  const handleLogout = async () => {
    try {
      console.log("Logging out user...");
      await supabase.auth.signOut();
      sessionStorage.clear(); // Clear all session storage
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      });
    }
  };

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  return (
    <div className="fixed left-[44px] top-[270px] h-[calc(100vh-290px)] flex flex-col z-[55]">
      <div className="bg-darkGrey/30 backdrop-blur-sm border border-silver/20 p-4 w-[250px] mb-4 !rounded-none">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 transition-all duration-300 text-xs !rounded-none",
                  "hover:bg-highlightGray/5 text-left",
                  isActive ? "text-softWhite bg-highlightGray/10" : "text-mediumGray"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-darkGrey/30 backdrop-blur-sm border border-silver/20 p-4 w-[250px] flex-1 !rounded-none flex flex-col">
        <h3 className="text-xs font-semibold text-softWhite mb-4 px-4 underline">TOOLS</h3>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="space-y-1 flex-1">
            {toolItems.map((tool) => (
              <a
                key={tool.label}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-2 text-xs text-mediumGray hover:text-softWhite hover:bg-highlightGray/5 transition-all duration-300 !rounded-none"
              >
                {tool.label}
              </a>
            ))}
          </div>
          
          <div className="mt-auto pt-4 border-t border-silver/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs text-accent-red hover:text-red-400 hover:bg-highlightGray/5 transition-all duration-300 !rounded-none"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
