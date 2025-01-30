
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TechnicalAnalysisWidget from "@/components/TechnicalAnalysisWidget";
import US30AnalysisWidget from "@/components/US30AnalysisWidget";
import BitcoinAnalysisWidget from "@/components/BitcoinAnalysisWidget";
import CommunityOutlookWidget from "@/components/CommunityOutlookWidget";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const TradeHub = () => {
  const location = useLocation();
  const selectedAccount = location.state?.selectedAccount;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAccount?.id) return;

      const session = localStorage.getItem("myfxbook_session");
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No active session found. Please login again.",
        });
        return;
      }

      setIsLoading(true);
      try {
        // Fetch necessary data here if needed
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedAccount?.id, toast]);

  return (
    <>
      <div className="flex-1 space-y-3 p-4 md:p-6 pt-4 ml-[25px] mr-[25px] mx-auto flex flex-col items-center max-w-[100vw] overflow-x-hidden mt-[50px]">
        {isLoading ? (
          <Card className="bg-darkBlue/40 border-mediumGray/20 backdrop-blur-sm shadow-lg">
            <CardContent className="py-4">
              <p className="text-center text-softWhite">Loading data...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-3 w-full">
              <div className="flex gap-3 justify-start w-full overflow-hidden ml-[100px] -mt-[100px]">
                <TechnicalAnalysisWidget />
                <US30AnalysisWidget />
                <BitcoinAnalysisWidget />
              </div>
              <div className="mt-[50px] space-y-3">
                <CommunityOutlookWidget />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TradeHub;
