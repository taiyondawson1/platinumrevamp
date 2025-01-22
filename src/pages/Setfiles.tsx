import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Files, Upload } from "lucide-react";

const SetfilesPage = () => {
  return (
    <main className="flex-1 ml-16 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Setfiles</h1>
        <p className="text-lightGrey">Manage and organize your trading setup files</p>
      </div>

      <Tabs defaultValue="my-setfiles" className="w-full">
        <TabsList className="bg-black/40 border border-neonBlue/20">
          <TabsTrigger value="my-setfiles" className="data-[state=active]:bg-neonBlue/10">
            <Files className="w-4 h-4 mr-2" />
            My Setfiles
          </TabsTrigger>
          <TabsTrigger value="upload" className="data-[state=active]:bg-neonBlue/10">
            <Upload className="w-4 h-4 mr-2" />
            Upload New
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-setfiles" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example setfile cards - replace with actual data */}
            <Card className="bg-black/40 border border-neonBlue/20">
              <CardHeader>
                <CardTitle className="text-white">EURUSD_Strategy_v1.set</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lightGrey">Last modified: 2024-03-15</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border border-neonBlue/20">
              <CardHeader>
                <CardTitle className="text-white">GBPUSD_Scalping.set</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lightGrey">Last modified: 2024-03-14</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Card className="bg-black/40 border border-neonBlue/20">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Upload className="w-12 h-12 text-neonBlue mx-auto mb-4" />
                <p className="text-white mb-2">Drag and drop your setfiles here</p>
                <p className="text-lightGrey">or click to browse</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default SetfilesPage;