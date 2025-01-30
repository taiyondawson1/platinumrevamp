
import TotalGainCard from "@/components/TotalGainCard";
import { Card, CardContent } from "@/components/ui/card";
import OpenOrdersTable from "@/components/OpenOrdersTable";
import HistoryTable from "@/components/HistoryTable";
import DailyGainChart from "@/components/DailyGainChart";
import GainWidget from "@/components/GainWidget";
import DailyDataWidget from "@/components/DailyDataWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomWidget from "@/components/CustomWidget";

const BlankPage = () => {
  return (
    <div className="w-full h-screen bg-[#090A14] space-y-3 px-[50px] py-4 md:px-[50px] md:py-6">
      <div className="space-y-3 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="bg-[#090A14] border border-white/5 shadow-lg">
            <TotalGainCard />
          </Card>
          <Card className="bg-[#090A14] border border-white/5 shadow-lg">
            <GainWidget />
          </Card>
        </div>
        <Card className="bg-[#090A14] border border-white/5 shadow-lg">
          <CardContent className="p-0">
            <OpenOrdersTable orders={[]} />
          </CardContent>
        </Card>
        <Card className="bg-[#090A14] border border-white/5 shadow-lg">
          <CardContent className="p-0">
            <HistoryTable history={[]} />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="bg-[#090A14] border border-white/5 shadow-lg">
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="ml-4 mt-3 bg-[#090A14]/80">
                <TabsTrigger value="daily" className="text-softWhite data-[state=active]:bg-[#090A14]">
                  Daily Gain
                </TabsTrigger>
                <TabsTrigger value="total" className="text-softWhite data-[state=active]:bg-[#090A14]">
                  Total Gain
                </TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                <DailyGainChart />
              </TabsContent>
              <TabsContent value="total">
                <CustomWidget 
                  session={localStorage.getItem("myfxbook_session") || ""}
                  width={600}
                  height={300}
                />
              </TabsContent>
            </Tabs>
          </Card>
          <Card className="bg-[#090A14] border border-white/5 shadow-lg">
            <DailyDataWidget />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlankPage;
