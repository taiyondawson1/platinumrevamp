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
      "p-4 rounded-lg border border-border/50 bg-card hover:border-border/80 transition-colors",
      "flex flex-col gap-2",
      className
    )}>
      <div className="text-2xl font-semibold">
        <span className={cn(
          trend === "up" && "text-green-500",
          trend === "down" && "text-red-500"
        )}>
          {value}
        </span>
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default MetricCard;