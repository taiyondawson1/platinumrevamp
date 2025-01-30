
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down";
  className?: string;
  subValue?: string | number;
}

const MetricCard = ({ label, value, trend, className, subValue }: MetricCardProps) => {
  return (
    <div className={cn(
      "w-full bg-gradient-to-b from-[#1D1F33] to-[#141522]/40",
      "backdrop-blur-sm",
      "shadow-[inset_0_2px_6px_rgba(255,255,255,0.2)]",
      "p-4 rounded-lg",
      className
    )}>
      <div className="flex flex-col items-center justify-center">
        <div className="text-lg text-softWhite/70 font-medium">{label}</div>
        <div className="text-2xl font-bold text-softWhite mt-1">
          {typeof value === 'number' ? (value >= 0 ? "+" : "") + value.toFixed(2) + "%" : value}
        </div>
        {subValue && (
          <div className="text-sm text-softWhite/50 mt-1">{subValue}</div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
