import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountsTable from "@/components/AccountsTable";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TradeHub = () => {
  const location = useLocation();
  const selectedAccount = location.state?.selectedAccount;

  const sampleAccounts = selectedAccount ? [
    {
      id: selectedAccount.id,
      name: selectedAccount.name,
      description: "",
      gain: selectedAccount.gain,
      balance: selectedAccount.balance,
      equity: selectedAccount.equity,
      drawdown: 0,
      profit: selectedAccount.profit,
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

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Open Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">No open orders</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Watched Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">No watched accounts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradeHub;