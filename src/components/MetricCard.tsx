
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down";
  className?: string;
}

const MetricCard = ({ label, value, trend, className }: MetricCardProps) => {
  return (
    <div className={cn(
      "metric-card w-full",
      className
    )}>
      <div className="flex flex-col items-center justify-center">
        <div className="text-lg text-softWhite/70 font-medium">{label}</div>
        <div className="text-2xl font-bold text-softWhite mt-1">
          {typeof value === 'number' ? (value >= 0 ? "+" : "") + value.toFixed(2) + "%" : value}
        </div>
        <div className="text-sm text-softWhite/50 mt-1">$1,234.56</div>
      </div>
    </div>
  );
};

export default MetricCard;
