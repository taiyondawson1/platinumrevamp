
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down";
  className?: string;
  variant?: "primary" | "secondary";
}

const MetricCard = ({ label, value, trend, className, variant = "primary" }: MetricCardProps) => {
  const baseStyles = "w-full p-4 transition-shadow duration-200";
  
  const variantStyles = {
    primary: "bg-darkBlue/40 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[inset_0px_3px_6px_rgba(0,0,0,0.25)] backdrop-blur-sm",
    secondary: "bg-transparent border border-[#2C2F33]"
  };

  return (
    <div className={cn(
      baseStyles,
      variantStyles[variant],
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
