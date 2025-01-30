
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Sizing {
  type: string;
  value: string;
}

interface OpenTrade {
  openTime: string;
  symbol: string;
  action: string;
  sizing: Sizing;
  openPrice: number;
  tp: number;
  sl: number;
  comment: string;
  profit: number;
  pips: number;
  swap: number;
  magic: number;
}

interface OpenOrdersTableProps {
  orders: OpenTrade[];
}

const OpenOrdersTable = ({ orders = [] }: OpenOrdersTableProps) => {
  console.log("OpenOrdersTable received orders:", orders);

  const calculateTotalProfit = (order: OpenTrade) => {
    return order.profit + order.swap;
  };

  return (
    <Card className="w-full bg-[#141522]/40 border-[#2A2D3E]">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#E2E8F0]">Open Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-[#2A2D3E]">
              <TableHead>Time</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Open Price</TableHead>
              <TableHead>SL</TableHead>
              <TableHead>TP</TableHead>
              <TableHead>Swap</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <TableRow 
                  key={`${order.symbol}-${order.openTime}-${index}`}
                  className="border-[#2A2D3E]"
                >
                  <TableCell className="text-[#E2E8F0]">{order.openTime}</TableCell>
                  <TableCell className="text-[#E2E8F0]">{order.symbol}</TableCell>
                  <TableCell className="text-[#E2E8F0]">{order.action}</TableCell>
                  <TableCell className="text-[#E2E8F0]">{order.sizing.value}</TableCell>
                  <TableCell className="text-[#E2E8F0]">{order.openPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-[#E2E8F0]">{order.sl.toFixed(2)}</TableCell>
                  <TableCell className="text-[#E2E8F0]">{order.tp.toFixed(2)}</TableCell>
                  <TableCell className={`${order.swap >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {order.swap.toFixed(2)}
                  </TableCell>
                  <TableCell className={`${order.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {order.profit.toFixed(2)}
                  </TableCell>
                  <TableCell className={`${calculateTotalProfit(order) >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {calculateTotalProfit(order).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4 text-[#E2E8F0]">
                  No open trades found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OpenOrdersTable;
