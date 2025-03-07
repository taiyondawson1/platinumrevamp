
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, ChevronDown, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      sessionStorage.clear();
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

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Trading", path: "/trading" },
    { label: "Expert Advisors", path: "/expert-advisors" },
    { label: "Courses", path: "/courses" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-darkGrey/95 backdrop-blur-md border-b border-silver/20">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center" onClick={() => navigate('/dashboard')} role="button">
            <span className="text-softWhite font-bold text-xl cursor-pointer">PlatinumAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "text-softWhite bg-highlightGray/20"
                    : "text-mediumGray hover:text-softWhite hover:bg-highlightGray/10"
                )}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-mediumGray hover:text-softWhite hover:bg-highlightGray/10"
            >
              <Bell size={18} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative text-mediumGray hover:text-softWhite hover:bg-highlightGray/10 pl-2 pr-1">
                  <User size={18} className="mr-2" />
                  <span className="hidden md:inline">Profile</span>
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-darkGrey border-silver/20">
                <DropdownMenuItem 
                  className="text-softWhite hover:bg-highlightGray/10 cursor-pointer"
                  onClick={() => navigate('/license-key')}
                >
                  License Key
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-softWhite hover:bg-highlightGray/10 cursor-pointer"
                  onClick={() => navigate('/connect-myfxbook')}
                >
                  Connect MyFxBook
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-silver/20" />
                <DropdownMenuItem 
                  className="text-accent-red hover:bg-highlightGray/10 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-mediumGray hover:text-softWhite hover:bg-highlightGray/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden px-2 pb-3 space-y-1 bg-darkGrey border-t border-silver/20">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "text-softWhite bg-highlightGray/20"
                    : "text-mediumGray hover:text-softWhite hover:bg-highlightGray/10"
                )}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
