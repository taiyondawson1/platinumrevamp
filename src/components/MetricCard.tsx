
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down";
  className?: string;
}

const MetricCard = ({ label, value, trend, className }: MetricCardProps) => {
  // Helper function to determine if the value should show a dollar sign
  const shouldShowDollar = (label: string): boolean => {
    const dollarLabels = [
      'Average Win', 'Average Loss', 'Total Results', 
      'Total Balance', 'Float', 'Last Trade Take'
    ];
    return dollarLabels.includes(label);
  };

  // Helper function to format the value based on the label
  const formatValue = (value: string | number, label: string): string => {
    if (typeof value === 'number') {
      if (shouldShowDollar(label)) {
        return `$${Math.abs(value).toFixed(2)}`;
      }
      // Add percentage sign for percentage values
      if (label.toLowerCase().includes('rate') || 
          label.toLowerCase().includes('drawdown') || 
          label.includes('5 days ago')) {
        return `${value.toFixed(2)}%`;
      }
      return value.toFixed(2);
    }
    return String(value);
  };

  // Format the display text to handle overflow on small screens
  const displayValue = formatValue(value, label);
  const displayLabel = label.length > 12 && window.innerWidth < 400 
    ? `${label.substring(0, 10)}...` 
    : label;

  return (
    <div className={cn(
      "w-full bg-darkBlue/40",
      "shadow-[inset_0px_1px_3px_rgba(0,0,0,0.15)]",
      "hover:shadow-[inset_0px_2px_4px_rgba(0,0,0,0.2)]",
      "transition-shadow duration-200",
      "rounded-none sm:rounded-lg",
      "bg-gradient-to-b from-white/10 to-transparent",
      "backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center justify-center p-1 sm:p-1.5">
        <div className="text-[9px] xs:text-[10px] sm:text-xs text-softWhite/70 font-medium truncate max-w-full px-1">{displayLabel}</div>
        <div className="text-xs sm:text-sm lg:text-base font-bold text-softWhite truncate max-w-full px-1">
          {displayValue}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
