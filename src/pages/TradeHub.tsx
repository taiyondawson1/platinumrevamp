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

const sampleAccounts = [];
const sampleWatchedAccounts = [];
const sampleOpenOrders = [];

const TradeHub = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 ml-[64px]">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">TradeHub</h2>
      </div>
      <div className="grid gap-4">
        {sampleAccounts.length === 0 ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Trading Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">No trading accounts connected</p>
            </CardContent>
          </Card>
        ) : (
          <AccountsTable accounts={sampleAccounts} />
        )}

        {sampleOpenOrders.length === 0 ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Open Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">No open orders</p>
            </CardContent>
          </Card>
        ) : (
          <OpenOrdersTable orders={sampleOpenOrders} />
        )}

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Watched Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {sampleWatchedAccounts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No watched accounts</p>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradeHub;