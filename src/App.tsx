import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Home from "@/pages/Home";
import ExpertAdvisorsPage from "@/pages/ExpertAdvisors";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen bg-gradient-to-b from-darkBlue to-black">
            <Sidebar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/expert-advisors" element={<ExpertAdvisorsPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;