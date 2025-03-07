
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  Menu,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen on component mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu trigger */}
      <div className="lg:hidden fixed top-5 left-5 z-[100]">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar} 
          className="bg-darkGrey/70 backdrop-blur-sm border border-silver/20 w-9 h-9 shadow-lg"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Sidebar with responsive behavior */}
      <div 
        className={cn(
          "fixed left-0 top-0 h-full z-[90]",
          "transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "w-[250px]"
        )}
      >
        {/* Overlay to close sidebar on mobile when clicking outside */}
        {isMobile && isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      
        {/* Sidebar content */}
        <div className="bg-darkGrey/90 backdrop-blur-md border-r border-silver/20 p-4 pt-[60px] h-full overflow-auto flex flex-col relative z-[90]">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-4 px-3">
            <Diamond className="w-5 h-5 text-softWhite" />
            <span className="text-softWhite font-semibold">PlatinumAi</span>
          </div>
          
          {/* Divider */}
          <Separator className="mb-5 bg-silver/20" />
          
          <div className="space-y-1 mb-5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 transition-all duration-300 text-xs rounded-sm",
                    "hover:bg-highlightGray/10 text-left",
                    isActive ? "text-softWhite bg-highlightGray/15" : "text-mediumGray"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Tools Section */}
          <h3 className="text-xs font-semibold text-softWhite mb-3 px-3 underline">TOOLS</h3>
          <div className="space-y-1 flex-1">
            {toolItems.map((tool) => (
              <a
                key={tool.label}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-mediumGray hover:text-softWhite hover:bg-highlightGray/10 transition-all duration-300 rounded-sm"
              >
                {tool.label}
              </a>
            ))}
          </div>
          
          {/* Logout at the bottom */}
          <div className="mt-auto pt-4 border-t border-silver/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs text-accent-red hover:text-red-400 hover:bg-highlightGray/10 transition-all duration-300 rounded-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
