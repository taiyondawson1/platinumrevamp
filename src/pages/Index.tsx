import Sidebar from "@/components/Sidebar";
import TradingChart from "@/components/TradingChart";

const Index = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-16 p-8">
        <div className="mb-8">
          <TradingChart />
        </div>
      </main>
    </div>
  );
};

export default Index;