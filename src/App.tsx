import { Routes, Route } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Index from "@/pages/Index";
import ExpertAdvisorsPage from "@/pages/ExpertAdvisors";

function App() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-darkBlue to-black">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/expert-advisors" element={<ExpertAdvisorsPage />} />
      </Routes>
    </div>
  );
}

export default App;