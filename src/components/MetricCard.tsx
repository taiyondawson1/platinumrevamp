
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down";
  className?: string;
  variant?: "primary" | "secondary";
}

const MetricCard = ({ label, value, className, variant = "primary" }: MetricCardProps) => {
  const baseStyles = "w-full p-4 rounded-xl";
  
  const variantStyles = {
    primary: "bg-gradient-to-b from-[#1D1F33] to-[#141522] border border-[#2A2D3E]/50 shadow-lg",
    secondary: "bg-[#141522]/40 border-[#2A2D3E]"
  };

  return (
    <div className={cn(
      baseStyles,
      variantStyles[variant],
      "hover:border-[#2A2D3E] transition-colors duration-200",
      className
    )}>
      <div className="flex flex-col items-center justify-center">
        <div className="text-lg text-softWhite/70 font-medium">{label}</div>
        <div className="text-2xl font-bold text-softWhite mt-1">
          {typeof value === 'number' ? `$${value}` : value}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;

