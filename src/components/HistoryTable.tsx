
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TradeHistory {
  openTime: string;
  closeTime: string;
  symbol: string;
  action: string;
  sizing: {
    type: string;
    value: string;
  };
  openPrice: number;
  closePrice: number;
  tp: number;
  sl: number;
  comment: string;
  pips: number;
  profit: number;
  interest: number;
  commission: number;
}

interface HistoryTableProps {
  history: TradeHistory[];
}

const HistoryTable = ({ history = [] }: HistoryTableProps) => {
  console.log("HistoryTable received history:", history);

  return (
    <div className="w-full mt-4">
      <h3 className="text-xl font-bold mb-4 text-softWhite">Trade History</h3>
      <div className="max-h-[400px] overflow-y-auto scrollbar-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Open Time</TableHead>
              <TableHead>Close Time</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Lots</TableHead>
              <TableHead>Open Price</TableHead>
              <TableHead>Close Price</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Comment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history && history.length > 0 ? (
              history.slice(0, 12).map((trade, index) => (
                <TableRow key={index}>
                  <TableCell>{trade.openTime}</TableCell>
                  <TableCell>{trade.closeTime}</TableCell>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>{trade.action}</TableCell>
                  <TableCell>{trade.sizing.value}</TableCell>
                  <TableCell>{trade.openPrice}</TableCell>
                  <TableCell>{trade.closePrice}</TableCell>
                  <TableCell className={trade.profit >= 0 ? "text-green-500" : "text-red-500"}>
                    {trade.profit.toFixed(2)}
                  </TableCell>
                  <TableCell>{trade.comment}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No trade history found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryTable;
