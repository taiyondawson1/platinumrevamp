
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MyFxBookLogin from "@/components/MyFxBookLogin";

const TradingPage = () => {
  return (
    <div className="flex-1 space-y-4 p-3 md:p-5 lg:p-6 pt-6 sm:pt-8 lg:pt-10 ml-0 sm:ml-[64px]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">Trading</h2>
      </div>
      <div className="grid gap-4 max-w-[1200px] mx-auto">
        <MyFxBookLogin />
      </div>
    </div>
  );
};

export default TradingPage;
