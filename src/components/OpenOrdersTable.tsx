import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OpenOrder {
  id: number;
  ticket: number;
  symbol: string;
  action: string;
  openTime: string;
  openPrice: number;
  sl: number;
  tp: number;
  pips: number;
  profit: number;
  commission: number;
  swap: number;
  comment: string;
  lots: number;
}

interface OpenOrdersTableProps {
  orders: OpenOrder[];
}

const OpenOrdersTable = ({ orders = [] }: OpenOrdersTableProps) => {
  console.log("OpenOrdersTable received orders:", orders); // Add this log to debug

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Open Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Lots</TableHead>
              <TableHead>Open Price</TableHead>
              <TableHead>SL</TableHead>
              <TableHead>TP</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Pips</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.ticket}</TableCell>
                  <TableCell>{order.symbol}</TableCell>
                  <TableCell>{order.action}</TableCell>
                  <TableCell>{order.lots}</TableCell>
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