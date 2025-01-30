
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TotalGainCard from "./TotalGainCard";
import GainWidget from "./GainWidget";
import OpenOrdersTable from "./OpenOrdersTable";
import HistoryTable from "./HistoryTable";
import DailyGainChart from "./DailyGainChart";
import CustomWidget from "./CustomWidget";
import DailyDataWidget from "./DailyDataWidget";
import CommunityOutlookWidget from "./CommunityOutlookWidget";
import { OpenTrade, TradeHistory } from "@/types/trades";

interface TradeMetricsProps {
  accountId?: string;
  openTrades: OpenTrade[];
  tradeHistory: TradeHistory[];
}

const TradeMetrics = ({ accountId, openTrades, tradeHistory }: TradeMetricsProps) => {
  return (
    <div className="mt-6 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TotalGainCard accountId={accountId?.toString()} />
        <GainWidget accountId={accountId?.toString()} />
      </div>
      <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
        <CardContent className="p-0">
          <OpenOrdersTable orders={openTrades} />
        </CardContent>
      </Card>
      <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
        <CardContent className="p-0">
          <HistoryTable history={tradeHistory} />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="ml-4 mt-3 bg-darkBlue/60">
              <TabsTrigger value="daily" className="text-softWhite data-[state=active]:bg-darkBlue/80">
                Daily Gain
              </TabsTrigger>
              <TabsTrigger value="total" className="text-softWhite data-[state=active]:bg-darkBlue/80">
                Total Gain
              </TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <DailyGainChart accountId={accountId?.toString()} />
            </TabsContent>
            <TabsContent value="total">
              <CustomWidget 
                session={localStorage.getItem("myfxbook_session") || ""}
                accountId={accountId?.toString()}
                width={600}
                height={300}
              />
            </TabsContent>
          </Tabs>
        </Card>
        <DailyDataWidget accountId={accountId?.toString()} />
      </div>
      <CommunityOutlookWidget />
    </div>
  );
};

export default TradeMetrics;
