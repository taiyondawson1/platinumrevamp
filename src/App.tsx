
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
import MyFxBookLoginPage from "@/pages/MyFxBookLoginPage";
import BlankPage from "@/pages/BlankPage";
import TradingViewTickerTape from "@/components/TradingViewTickerTape";

const queryClient = new QueryClient();

function MainContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isSetfilesPage = location.pathname === "/setfiles";
  const isBlankPage = location.pathname === "/blank";

  if (isBlankPage) {
    return (
      <Routes>
        <Route path="/blank" element={<BlankPage />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey">
      {!isHomePage && !isSetfilesPage && <Sidebar />}
      <div className="flex-1 flex relative">
        <div className="flex-1">
          {!isHomePage && !isSetfilesPage && (
            <div className="fixed top-0 left-0 right-0 bg-gradient-to-br from-darkBlue via-darkBase to-darkGrey z-[50] h-[230px]" />
          )}
          {!isHomePage && !isSetfilesPage && (
            <div className="fixed top-0 left-[270px] right-0 z-[51]">
              <TradingViewTickerTape />
            </div>
          )}
          {!isHomePage && !isSetfilesPage && (
            <div className="fixed left-0 right-0 top-[230px] z-[50] px-[44px]">
              <Separator className="h-[1px] bg-silver/20" />
            </div>
          )}
          <main className={`flex-1 ${!isHomePage && !isSetfilesPage ? "ml-[270px] mr-0 mt-[250px]" : ""}`}>
            <div className="overflow-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/trading" element={<TradingPage />} />
                <Route path="/expert-advisors" element={<ExpertAdvisorsPage />} />
                <Route path="/setfiles" element={<SetfilesPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/tradehub" element={<TradeHub />} />
                <Route path="/connect-myfxbook" element={<MyFxBookLoginPage />} />
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
