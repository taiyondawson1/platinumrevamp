import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import ExpertAdvisorsPage from "@/pages/ExpertAdvisors";
import SetfilesPage from "@/pages/Setfiles";
import TradingPage from "@/pages/Trading";
import CoursesPage from "@/pages/Courses";
import TradeHub from "@/pages/TradeHub";
import MyFxBookLoginPage from "@/pages/MyFxBookLoginPage";
import TradingViewTickerTape from "@/components/TradingViewTickerTape";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const INACTIVITY_TIMEOUT = 300000; // 5 minutes in milliseconds

function useInactivityTimer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  let timer: NodeJS.Timeout;

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      console.log("Inactivity timeout reached - logging out");
      await supabase.auth.signOut();
      sessionStorage.clear();
      toast({
        title: "Session Expired",
        description: "You have been logged out due to inactivity",
      });
      navigate('/login');
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      console.log("User activity detected - resetting timer");
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [navigate]);
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useInactivityTimer();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Auth check - Session:", session);
        
        if (session) {
          setIsAuthenticated(true);
          if (window.location.pathname === '/login') {
            navigate('/dashboard');
          }
        } else {
          console.log("No session found - redirecting to login");
          setIsAuthenticated(false);
          sessionStorage.clear();
          if (!['/login', '/register'].includes(window.location.pathname)) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        sessionStorage.clear();
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed - Event:", event, "Session:", session);
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        sessionStorage.clear();
        navigate('/login');
      }
      
      setIsLoading(false);
    });

    // Check auth status when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Tab became visible - checking auth status");
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey">
        <div className="animate-pulse text-softWhite">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function MainContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isSetfilesPage = location.pathname === "/setfiles";
  const isTradeHubPage = location.pathname === "/tradehub";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const hideHeader = isHomePage || isSetfilesPage || isTradeHubPage || isLoginPage || isRegisterPage;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey">
      {!hideHeader && <Sidebar />}
      <div className="flex-1 flex relative">
        <div className="flex-1">
          {!hideHeader && (
            <div className="fixed top-0 left-0 right-0 bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey z-[50] h-[230px]" />
          )}
          {!hideHeader && (
            <div className="fixed top-0 left-[270px] right-0 z-[51]">
              <TradingViewTickerTape />
            </div>
          )}
          {!hideHeader && (
            <div className="fixed left-0 right-0 top-[230px] z-[50] px-[44px]">
              <Separator className="h-[1px] bg-silver/20" />
            </div>
          )}
          <main className={`flex-1 ${!hideHeader ? "ml-[270px] mr-0 mt-[250px]" : ""}`}>
            <div className="overflow-auto">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/trading" element={<PrivateRoute><TradingPage /></PrivateRoute>} />
                <Route path="/expert-advisors" element={<PrivateRoute><ExpertAdvisorsPage /></PrivateRoute>} />
                <Route path="/setfiles" element={<PrivateRoute><SetfilesPage /></PrivateRoute>} />
                <Route path="/courses" element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
                <Route path="/tradehub" element={<PrivateRoute><TradeHub /></PrivateRoute>} />
                <Route path="/connect-myfxbook" element={<PrivateRoute><MyFxBookLoginPage /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
