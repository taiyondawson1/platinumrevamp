
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MyFxBookLogin from "@/components/MyFxBookLogin";

const TradingPage = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-8 sm:pt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">Trading</h2>
      </div>
      <div className="grid gap-4">
        <MyFxBookLogin />
      </div>
    </div>
  );
};

export default TradingPage;
