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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Open Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Open Price</TableHead>
              <TableHead>SL</TableHead>
              <TableHead>TP</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Pips</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order, index) => (
                <TableRow key={`${order.symbol}-${order.openTime}-${index}`}>
                  <TableCell>{order.openTime}</TableCell>
                  <TableCell>{order.symbol}</TableCell>
                  <TableCell>{order.action}</TableCell>
                  <TableCell>{order.sizing.value}</TableCell>
                  <TableCell>{order.openPrice}</TableCell>
                  <TableCell>{order.sl}</TableCell>
                  <TableCell>{order.tp}</TableCell>
                  <TableCell className={order.profit >= 0 ? "text-green-500" : "text-red-500"}>
                    {order.profit.toFixed(2)}
                  </TableCell>
                  <TableCell className={order.pips >= 0 ? "text-green-500" : "text-red-500"}>
                    {order.pips.toFixed(1)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No open orders found
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