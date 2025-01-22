import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Index from "./pages/Index";
import ExpertAdvisors from "./pages/ExpertAdvisors";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/expert-advisors" element={<ExpertAdvisors />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </div>
  );
}

export default App;