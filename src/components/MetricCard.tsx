
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down";
  className?: string;
}

const MetricCard = ({ label, value, className }: MetricCardProps) => {
  const shouldShowDollar = (label: string): boolean => {
    const dollarLabels = [
      'Average Win', 'Average Loss', 'Total Results', 
      'Total Balance', 'Float', 'Last Trade Take'
    ];
    return dollarLabels.includes(label);
  };

  const formatValue = (value: string | number, label: string): string => {
    if (typeof value === 'number') {
      if (shouldShowDollar(label)) {
        return `$${Math.abs(value).toFixed(2)}`;
      }
      if (label.toLowerCase().includes('rate') || 
          label.toLowerCase().includes('drawdown') || 
          label.includes('5 days ago')) {
        return `${value.toFixed(2)}%`;
      }
      return value.toFixed(2);
    }
    return value;
  };

  const isPositiveValue = (value: string | number): boolean => {
    if (typeof value === 'number') {
      return value >= 0;
    }
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0;
  };

  const getValueColor = (label: string, value: string | number): string => {
    if (label === 'Average Win') {
      return '#39FF14';
    }

    if (['Total Balance', 'Max Closed DD'].includes(label)) {
      return isPositiveValue(value) ? '#34C759' : '#FF1744';
    }

    if (['Total Results', 'Last Trade Take'].includes(label)) {
      return isPositiveValue(value) ? '#39FF14' : '#FF1744';
    }

    return isPositiveValue(value) ? '#39FF14' : '#FF1744';
  };

  const valueColor = getValueColor(label, value);

  return (
    <div className={cn(
      "relative group cursor-pointer",
      "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b",
      "before:from-white/[0.08] before:to-transparent before:opacity-0 before:transition-opacity",
      "hover:before:opacity-100",
      "bg-[#1A1B23]/40 backdrop-blur-sm",
      "border-t border-white/[0.08]",
      "transition-all duration-300 ease-in-out",
      "transform hover:translate-y-[-2px]",
      className
    )}>
      <div className="relative p-6">
        <div className="flex flex-col items-start space-y-2">
          <span className="text-[13px] font-medium text-[#8E9196] group-hover:text-white/80 transition-colors">
            {label}
          </span>
          <span 
            className="text-2xl font-bold tracking-tight"
            style={{ 
              color: valueColor,
              textShadow: valueColor === '#39FF14' ? `0 0 10px ${valueColor}40` : 'none'
            }}
          >
            {formatValue(value, label)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
