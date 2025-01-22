import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: "up" | "down";
}

const MetricCard = ({ label, value, trend }: MetricCardProps) => {
  return (
    <Card className="bg-black/40 border border-neonBlue/20">
      <CardContent className="p-6">
        <p className="text-sm text-lightGrey mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-semibold text-white">{value}</p>
          {trend && (
            <span
              className={cn(
                "flex items-center text-sm",
                trend === "up" ? "text-green-500" : "text-red-500"
              )}
            >
              {trend === "up" ? (
                <ArrowUpIcon className="w-4 h-4" />
              ) : (
                <ArrowDownIcon className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;