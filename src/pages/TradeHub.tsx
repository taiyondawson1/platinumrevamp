import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountsTable from "@/components/AccountsTable";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sampleAccounts = [
  {
    id: 12345,
    name: "Holy Grail",
    description: "Super duper MA+CCI trading system.",
    accountId: 1013230,
    gain: 8.92,
    absGain: 8.92,
    daily: "0.04",
    monthly: "1.25",
    withdrawals: 0,
    deposits: 10000,
    interest: 11.1,
    profit: 892.45,
    balance: 10892.45,
    drawdown: 53.53,
    equity: 10892.45,
    equityPercent: 100,
    demo: true,
    lastUpdateDate: "03/01/2010 10:14",
    creationDate: "08/06/2009 08:13",
    firstTradeDate: "04/21/2008 12:18",
    tracking: 21,
    views: 549,
    commission: 0,
    currency: "USD",
    profitFactor: 0.3,
    pips: 81.20,
    invitationUrl: "https://www.myfxbook.com/members/john101/anyone/347/SDa45X5TSkdIsXg8",
    server: {
      name: "Alpari UK"
    }
  }
];

const sampleWatchedAccounts = [
  {
    name: "Holy Grail",
    gain: 8.92,
    drawdown: 53.53,
    demo: true,
    change: 1.53,
  }
];

const sampleOpenOrders = [
  {
    id: 1,
    ticket: 123456,
    symbol: "EURUSD",
    action: "Buy",
    openTime: "2024-03-14 10:30:00",
    openPrice: 1.0890,
    sl: 1.0850,
    tp: 1.0950,
    pips: 10.5,
    profit: 105.50,
    commission: 0,
    swap: 0,
    comment: "Market order",
    lots: 1.0
  }
];

const TradeHub = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ml-[64px]">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">TradeHub</h2>
      </div>
      <div className="grid gap-4">
        <AccountsTable accounts={sampleAccounts} />
        <OpenOrdersTable orders={sampleOpenOrders} />
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Watched Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gain</TableHead>
                  <TableHead>Drawdown</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleWatchedAccounts.map((account, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell className={account.gain >= 0 ? "text-green-500" : "text-red-500"}>
                      {account.gain.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-red-500">
                      {account.drawdown.toFixed(2)}%
                    </TableCell>
                    <TableCell className={account.change >= 0 ? "text-green-500" : "text-red-500"}>
                      {account.change.toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        account.demo ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
                      }`}>
                        {account.demo ? "Demo" : "Live"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradeHub;
