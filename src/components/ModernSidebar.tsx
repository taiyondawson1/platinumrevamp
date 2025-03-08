
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  LayoutDashboard, 
  BarChart, 
  Bot, 
  FileText, 
  BookOpen, 
  LogOut, 
  Key, 
  Diamond,
  Users
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { 
  Sidebar, 
  SidebarBody, 
  SidebarLink
} from "@/components/ui/sidebar-new";

// Menu items from original sidebar
const menuItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "TradeHub", path: "/tradehub", icon: BarChart },
  { label: "Expert Advisors", path: "/expert-advisors", icon: Bot },
  { label: "Setfiles", path: "/setfiles", icon: FileText },
  { label: "Courses", path: "/courses", icon: BookOpen },
  { label: "License Key", path: "/license-key", icon: Key },
];

// External tools from original sidebar
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

const ModernSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if mobile screen on component mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  return (
    <Sidebar open={isOpen} setOpen={setIsOpen}>
      <SidebarBody className="justify-between gap-10 pt-[20px]">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 mb-4">
            <Diamond className="w-5 h-5 text-softWhite flex-shrink-0" />
            <span className="text-softWhite font-semibold">PlatinumAi</span>
          </div>
          
          {/* Divider */}
          <Separator className="mb-5 bg-silver/20" />
          
          {/* Main Menu Links */}
          <div className="flex flex-col gap-1 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <SidebarLink
                  key={item.label}
                  link={{
                    label: item.label,
                    href: item.path,
                    icon: <Icon className="w-4 h-4 flex-shrink-0" />
                  }}
                  isActive={isActive}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                />
              );
            })}
          </div>

          {/* Tools Section */}
          <div className="mt-8 px-2">
            <h3 className="text-xs font-semibold text-softWhite mb-3 px-1 underline">TOOLS</h3>
            <div className="flex flex-col gap-1">
              {toolItems.map((tool) => (
                <a
                  key={tool.label}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-1 py-2 text-xs text-mediumGray hover:text-softWhite hover:bg-highlightGray/10 transition-all duration-300 rounded-sm"
                >
                  {tool.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Logout at the bottom */}
        <div className="mt-auto pt-4 border-t border-silver/20 px-2">
          <SidebarLink
            link={{
              label: "Logout",
              href: "#",
              icon: <LogOut className="w-4 h-4 text-accent-red flex-shrink-0" />
            }}
            className="text-accent-red hover:text-red-400"
            onClick={handleLogout}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default ModernSidebar;
