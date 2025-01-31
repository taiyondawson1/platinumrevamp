
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
    return value;
  };

  // Helper function to determine if a value is positive or negative
  const isPositiveValue = (value: string | number): boolean => {
    if (typeof value === 'number') {
      return value >= 0;
    }
    // Try to parse string values that might be numbers
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0;
  };

  // Helper function to determine color based on label and value
  const getValueColor = (label: string, value: string | number): string => {
    // Always show these in neon green if positive
    if (label === 'Average Win') {
      return '#39FF14';
    }

    // Show these in standard green if positive
    if (['Total Balance', 'Max Closed DD'].includes(label)) {
      return isPositiveValue(value) ? '#34C759' : '#FF1744';
    }

    // Show these in neon green/red based on value
    if (['Total Results', 'Last Trade Take'].includes(label)) {
      return isPositiveValue(value) ? '#39FF14' : '#FF1744';
    }

    // Default color logic for other metrics
    return isPositiveValue(value) ? '#39FF14' : '#FF1744';
  };

  const valueColor = getValueColor(label, value);

  return (
    <div className={cn(
      "w-full bg-[#141522]/40",
      "shadow-[inset_0px_2px_4px_rgba(0,0,0,0.2)]",
      "hover:shadow-[inset_0px_3px_6px_rgba(0,0,0,0.25)]",
      "transition-all duration-300",
      "rounded-xl",
      "bg-gradient-to-b from-white/[0.06] to-transparent",
      "border border-white/[0.08]",
      "backdrop-blur-md",
      "group",
      className
    )}>
      <div className="flex flex-col items-center justify-center py-3 px-4">
        <div className="text-sm text-softWhite/60 font-medium group-hover:text-softWhite/80 transition-colors">
          {label}
        </div>
        <div 
          className="text-xl font-bold mt-1"
          style={{ 
            color: valueColor,
            textShadow: valueColor === '#39FF14' ? `0 0 5px ${valueColor}` : 'none',
          }}
        >
          {formatValue(value, label)}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
