import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/Sidebar";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import ExpertAdvisorsPage from "@/pages/ExpertAdvisors";
import SetfilesPage from "@/pages/Setfiles";
import TradingPage from "@/pages/Trading";
import CoursesPage from "@/pages/Courses";
import CourseView from "@/pages/CourseView";
import TradeHub from "@/pages/TradeHub";
import MyFxBookLoginPage from "@/pages/MyFxBookLoginPage";
import TradingViewTickerTape from "@/components/TradingViewTickerTape";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
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
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/trading" element={<PrivateRoute><TradingPage /></PrivateRoute>} />
                <Route path="/expert-advisors" element={<PrivateRoute><ExpertAdvisorsPage /></PrivateRoute>} />
                <Route path="/setfiles" element={<PrivateRoute><SetfilesPage /></PrivateRoute>} />
                <Route path="/courses" element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
                <Route path="/courses/:courseId" element={<PrivateRoute><CourseView /></PrivateRoute>} />
                <Route path="/tradehub" element={<PrivateRoute><TradeHub /></PrivateRoute>} />
                <Route path="/connect-myfxbook" element={<PrivateRoute><MyFxBookLoginPage /></PrivateRoute>} />
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
