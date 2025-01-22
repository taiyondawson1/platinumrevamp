import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down";
  className?: string;
}

const MetricCard = ({ label, value, trend, className }: MetricCardProps) => {
  return (
    <div className={cn("metric-card group hover:animate-glow", className)}>
      <div className="metric-value">
        <span
          className={cn(
            trend === "up" && "text-successGreen",
            trend === "down" && "text-alertRed"
          )}
        >
          {value}
        </span>
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
};

export default MetricCard;