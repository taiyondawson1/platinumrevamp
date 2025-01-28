import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountsTable from "@/components/AccountsTable";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import { useLocation } from "react-router-dom";

const TradeHub = () => {
  const location = useLocation();
  const selectedAccount = location.state?.selectedAccount;

  const sampleAccounts = selectedAccount ? [
    {
      id: selectedAccount.id,
      name: selectedAccount.name,
      description: selectedAccount.description || "",
      balance: selectedAccount.balance,
      equity: selectedAccount.equity,
      drawdown: selectedAccount.drawdown || 0,
      profit: selectedAccount.profit,
      gain: selectedAccount.gain,
      currency: selectedAccount.currency,
      demo: selectedAccount.demo,
      lastUpdateDate: new Date().toISOString(),
      server: {
        name: "MyFxBook"
      }
    }
  ] : [];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ml-[64px]">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          TradeHub {selectedAccount ? `- ${selectedAccount.name}` : ''}
        </h2>
      </div>
      <div className="grid gap-4">
        {selectedAccount ? (
          <AccountsTable accounts={sampleAccounts} />
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No account selected. Select an account from the home page to view details.
              </p>
            </CardContent>
          </Card>
        )}

        <OpenOrdersTable orders={[]} />
      </div>
    </div>
  );
};

export default TradeHub;