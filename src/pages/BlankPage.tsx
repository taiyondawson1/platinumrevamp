
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
    <div className="w-full h-screen bg-[#090A14] space-y-3 p-4 md:p-6 pt-4">
      <div className="space-y-3 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TotalGainCard />
          <GainWidget />
        </div>
        <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
          <CardContent className="p-0">
            <OpenOrdersTable orders={[]} />
          </CardContent>
        </Card>
        <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
          <CardContent className="p-0">
            <HistoryTable history={[]} />
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
          <DailyDataWidget />
        </div>
      </div>
    </div>
  );
};

export default BlankPage;
