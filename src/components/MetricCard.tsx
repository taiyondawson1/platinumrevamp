
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down";
  className?: string;
}

const MetricCard = ({ label, value, trend, className }: MetricCardProps) => {
  return (
    <div className={cn("w-full bg-darkBlue/40 border-mediumGray/20 rounded-none p-4", className)}>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-softWhite text-center">{label}</h3>
        <div className="text-3xl font-bold mt-2">
          <span className={cn("text-softWhite")}>
            {typeof value === 'number' ? (value >= 0 ? "+" : "") + value.toFixed(2) + "%" : value}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
