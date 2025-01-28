import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import { useLocation } from "react-router-dom";

const TradeHub = () => {
  const location = useLocation();
  const selectedAccount = location.state?.selectedAccount;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ml-[64px]">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          TradeHub {selectedAccount ? `- ${selectedAccount.name}` : ''}
        </h2>
      </div>
      <div className="grid gap-4">
        <OpenOrdersTable orders={[]} />
      </div>
    </div>
  );
};

export default TradeHub;