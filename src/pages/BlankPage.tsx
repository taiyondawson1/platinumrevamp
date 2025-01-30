
import TotalGainCard from "@/components/TotalGainCard";
import { Card, CardContent } from "@/components/ui/card";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import HistoryTable from "@/components/HistoryTable";
import DailyGainChart from "@/components/DailyGainChart";
import GainWidget from "@/components/GainWidget";
import DailyDataWidget from "@/components/DailyDataWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomWidget from "@/components/CustomWidget";
import { useParams, useLocation } from "react-router-dom";

const BlankPage = () => {
  const { accountId } = useParams();
  const location = useLocation();
  const selectedAccountId = accountId || location.state?.selectedAccount?.id;

  if (!selectedAccountId) {
    return (
      <div className="w-full min-h-screen bg-[#090A14] flex items-center justify-center">
        <p className="text-softWhite">Please select an account to view stats.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#090A14] space-y-4 px-[200px] py-6">
      {/* Top Row - 3 Small Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#14151F] border border-white/5 shadow-lg rounded-xl">
          <TotalGainCard accountId={selectedAccountId} />
        </Card>
        <Card className="bg-[#14151F] border border-white/5 shadow-lg rounded-xl">
          <GainWidget accountId={selectedAccountId} />
        </Card>
        <Card className="bg-[#14151F] border border-white/5 shadow-lg rounded-xl">
          <DailyDataWidget accountId={selectedAccountId} />
        </Card>
      </div>

      {/* Middle Row - Chart and Table */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4">
        <Card className="bg-[#14151F] border border-white/5 shadow-lg rounded-xl">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="ml-4 mt-3 bg-[#14151F]/80">
              <TabsTrigger value="daily" className="text-softWhite data-[state=active]:bg-[#14151F]">
                Daily Gain
              </TabsTrigger>
              <TabsTrigger value="total" className="text-softWhite data-[state=active]:bg-[#14151F]">
                Total Gain
              </TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="p-4">
              <DailyGainChart accountId={selectedAccountId} />
            </TabsContent>
            <TabsContent value="total" className="p-4">
              <CustomWidget 
                session={localStorage.getItem("myfxbook_session") || ""}
                width={600}
                height={300}
                accountId={selectedAccountId}
              />
            </TabsContent>
          </Tabs>
        </Card>
        <Card className="bg-[#14151F] border border-white/5 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <HistoryTable accountId={selectedAccountId} history={[]} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Full Width Table */}
      <Card className="bg-[#14151F] border border-white/5 shadow-lg rounded-xl">
        <CardContent className="p-0">
          <OpenOrdersTable accountId={selectedAccountId} orders={[]} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlankPage;
