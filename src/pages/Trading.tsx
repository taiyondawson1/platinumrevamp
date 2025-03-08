
import { Card, CardContent } from "@/components/ui/card";
import MyFxBookLogin from "@/components/MyFxBookLogin";

const TradingPage = () => {
  return (
    <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-5 pt-3 sm:pt-4 lg:pt-6 w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">Trading</h2>
      </div>
      <div className="grid gap-3 max-w-[1200px] mx-auto">
        <MyFxBookLogin />
      </div>
    </div>
  );
};

export default TradingPage;
