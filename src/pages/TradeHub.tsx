import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AccountsTable from "@/components/AccountsTable";

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

const TradeHub = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ml-[64px]">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">TradeHub</h2>
      </div>
      <div className="grid gap-4">
        <AccountsTable accounts={sampleAccounts} />
      </div>
    </div>
  );
};

export default TradeHub;