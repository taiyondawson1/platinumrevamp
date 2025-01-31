
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MyFxBookLogin from "@/components/MyFxBookLogin";

const TradingPage = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">Trading</h2>
      </div>
      <div className="grid gap-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#B8860B]/20 via-[#FFD700]/20 to-[#DAA520]/20 animate-pulse rounded-lg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40 backdrop-blur-sm rounded-lg pointer-events-none" />
        <MyFxBookLogin />
      </div>
    </div>
  );
};

export default TradingPage;
