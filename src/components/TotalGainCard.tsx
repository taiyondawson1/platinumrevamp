
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TotalGainCardProps {
  accountId?: string;
}

const TotalGainCard = ({ accountId }: TotalGainCardProps) => {
  const [totalGain, setTotalGain] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTotalGain = async () => {
      if (!accountId) return;

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
        // Get dates for last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const response = await fetch(
          `https://www.myfxbook.com/api/get-gain.json?session=${encodeURIComponent(
            session
          )}&id=${encodeURIComponent(accountId)}&start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch total gain data");
        }

        const data = await response.json();
        console.log("Total Gain API Response:", data);

        if (!data.error) {
          setTotalGain(data.value);
        } else {
          throw new Error(data.message || "Failed to fetch total gain data");
        }
      } catch (error) {
        console.error("Error fetching total gain:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch total gain data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalGain();
  }, [accountId, toast]);

  return (
    <div className={cn(
      "w-full bg-gradient-to-b from-[#1D1F33] to-[#141522]/40",
      "border-0",
      "backdrop-blur-sm",
      "shadow-[inset_0_2px_6px_rgba(255,255,255,0.2)]",
      "p-4 rounded-lg"
    )}>
      <div className="flex flex-col items-center justify-center">
        <div className="text-xl font-bold text-center text-softWhite/70">
          Total Gain (30 Days)
        </div>
        <div className="mt-4">
          {isLoading ? (
            <p className="text-center text-softWhite">Loading...</p>
          ) : (
            <div className="text-3xl font-bold text-center text-softWhite">
              {totalGain !== null ? (
                <span>
                  {totalGain >= 0 ? "+" : ""}{totalGain.toFixed(2)}%
                </span>
              ) : (
                <span>N/A</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalGainCard;
