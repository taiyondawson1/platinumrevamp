import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import ExpertAdvisorsPage from "@/pages/ExpertAdvisors";
import SetfilesPage from "@/pages/Setfiles";
import TradingPage from "@/pages/Trading";
import CoursesPage from "@/pages/Courses";
import TradeHub from "@/pages/TradeHub";
import TradingViewTickerTape from "@/components/TradingViewTickerTape";
import { Heading1 } from "lucide-react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey">
            <Sidebar />
            <TradingViewTickerTape />
            <div className="flex items-center gap-3 fixed left-0 right-0 top-[240px] px-6 z-40">
              <Heading1 className="w-6 h-6 text-softWhite" />
              <h1 className="text-2xl font-bold text-softWhite">Trading Dashboard</h1>
            </div>
            <main className="flex-1 ml-[270px] mt-[40px]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/trading" element={<TradingPage />} />
                <Route path="/expert-advisors" element={<ExpertAdvisorsPage />} />
                <Route path="/setfiles" element={<SetfilesPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/tradehub" element={<TradeHub />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;