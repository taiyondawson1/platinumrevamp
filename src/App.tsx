import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/Sidebar";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import ExpertAdvisorsPage from "@/pages/ExpertAdvisors";
import SetfilesPage from "@/pages/Setfiles";
import TradingPage from "@/pages/Trading";
import CoursesPage from "@/pages/Courses";
import TradeHub from "@/pages/TradeHub";
import TradingViewTickerTape from "@/components/TradingViewTickerTape";

const queryClient = new QueryClient();

function MainContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey">
      <Sidebar />
      {!isHomePage && <TradingViewTickerTape />}
      {!isHomePage && <Separator className="fixed left-0 right-0 top-[290px] z-50 bg-silver/20" />}
      <main className={`flex-1 ${!isHomePage ? "ml-[270px] mt-[300px]" : "ml-[270px]"} relative`}>
        <div className="absolute inset-0 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trading" element={<TradingPage />} />
            <Route path="/expert-advisors" element={<ExpertAdvisorsPage />} />
            <Route path="/setfiles" element={<SetfilesPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/tradehub" element={<TradeHub />} />
          </Routes>
        </div>
      </main>
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