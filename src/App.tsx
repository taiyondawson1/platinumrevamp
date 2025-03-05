
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
import Home from "@/pages/Home";
import LicenseKey from "@/pages/LicenseKey";
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
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      console.log("User activity detected - resetting timer");
      resetTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    resetTimer();

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
  const location = useLocation();
  const { toast } = useToast();
  useInactivityTimer();

  const fixDatabaseTriggers = async () => {
    try {
      console.log("Attempting to fix database triggers...");
      const { data, error } = await supabase.functions.invoke('fix-handle-new-user');
      
      if (error) {
        console.error("Error fixing triggers:", error);
      } else {
        console.log("Database triggers fixed:", data);
      }
    } catch (err) {
      console.error("Failed to call fix-handle-new-user function:", err);
    }
  };

  // Check for orphaned customers without license keys
  const fixOrphanedCustomers = async (userId: string) => {
    try {
      console.log("Checking for customer record/license key consistency...");
      
      // Check if user has a profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError || !profileData) {
        console.error("Error checking profile or no profile found:", profileError);
        return;
      }
      
      // Only fix customer records
      if (profileData.role !== 'customer') {
        return;
      }
      
      // Check if user has a license key
      const { data: licenseData, error: licenseError } = await supabase
        .from('license_keys')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (licenseError) {
        console.error("Error checking license key:", licenseError);
        return;
      }
      
      // Check if user has a customer record
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (customerError) {
        console.error("Error checking customer record:", customerError);
        return;
      }
      
      // If there's a license key but no customer record, fix it
      if (licenseData && !customerData) {
        console.log("License key exists but no customer record, creating one...");
        
        const { error: createCustomerError } = await supabase
          .from('customers')
          .insert({
            id: userId,
            name: licenseData.name,
            email: licenseData.email,
            phone: licenseData.phone || '',
            status: licenseData.status || 'Active',
            sales_rep_id: '00000000-0000-0000-0000-000000000000',
            staff_key: licenseData.staff_key,
            revenue: '$0'
          });
        
        if (createCustomerError) {
          console.error("Error creating customer record:", createCustomerError);
        } else {
          console.log("Customer record created successfully");
        }
      }
      // If there's a customer record but no license key, fix it
      else if (!licenseData && customerData) {
        console.log("Customer record exists but no license key, creating one...");
        
        const { data: userInfoData } = await supabase.auth.getUser();
        const userEmail = userInfoData?.user?.email || customerData.email;
        
        const { error: createLicenseError } = await supabase
          .from('license_keys')
          .insert({
            user_id: userId,
            license_key: 'PENDING-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
            account_numbers: [],
            status: customerData.status || 'active',
            subscription_type: 'standard',
            name: customerData.name,
            email: userEmail,
            phone: customerData.phone || '',
            product_code: 'EA-001',
            enrolled_by: customerData.staff_key,
            staff_key: customerData.staff_key
          });
        
        if (createLicenseError) {
          console.error("Error creating license key:", createLicenseError);
        } else {
          console.log("License key created successfully");
        }
      }
    } catch (err) {
      console.error("Error fixing orphaned customer records:", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Auth check - Session:", session);
        
        if (session) {
          await fixDatabaseTriggers();
          await fixOrphanedCustomers(session.user.id);
          
          setIsAuthenticated(true);
          
          if (['/login', '/register', '/'].includes(location.pathname)) {
            navigate('/dashboard');
          }
        } else {
          console.log("No session found - redirecting to login");
          setIsAuthenticated(false);
          sessionStorage.clear();
          if (!['/login', '/register', '/'].includes(location.pathname)) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        sessionStorage.clear();
        if (!['/login', '/register', '/'].includes(location.pathname)) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed - Event:", event, "Session:", session);
      
      if (event === 'SIGNED_IN' && session) {
        await fixDatabaseTriggers();
        await fixOrphanedCustomers(session.user.id);
        
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        sessionStorage.clear();
        if (!['/login', '/register', '/'].includes(location.pathname)) {
          navigate('/login');
        }
      }
      
      setIsLoading(false);
    });

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
  }, [navigate, location]);

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
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/trading" element={<PrivateRoute><TradingPage /></PrivateRoute>} />
                <Route path="/expert-advisors" element={<PrivateRoute><ExpertAdvisorsPage /></PrivateRoute>} />
                <Route path="/setfiles" element={<PrivateRoute><SetfilesPage /></PrivateRoute>} />
                <Route path="/courses" element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
                <Route path="/tradehub" element={<PrivateRoute><TradeHub /></PrivateRoute>} />
                <Route path="/connect-myfxbook" element={<PrivateRoute><MyFxBookLoginPage /></PrivateRoute>} />
                <Route path="/license-key" element={<PrivateRoute><LicenseKey /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
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
