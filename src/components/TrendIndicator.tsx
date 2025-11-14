import { ChevronsDown, ChevronsUp, Equal, Flame } from "lucide-react";
import React from "react";

type TrendDirection = "up" | "down" | "same" | "new";

interface TrendIndicatorProps {
  direction: TrendDirection;
  rankChange: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ direction, rankChange, size = "md", showLabel = false, className = "" }) => {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const getIndicatorContent = () => {
    switch (direction) {
      case "up":
        return {
          icon: <ChevronsUp className={iconSizes[size]} />,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          label: `+${Math.abs(rankChange)}`,
        };
      case "down":
        return {
          icon: <ChevronsDown className={iconSizes[size]} />,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          label: `${rankChange}`,
        };
      case "new":
        return {
          icon: <Flame className={iconSizes[size]} />,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          label: "NEW",
        };
      case "same":
      default:
        return {
          icon: <Equal className={iconSizes[size]} />,
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          label: "—",
        };
    }
  };

  const content = getIndicatorContent();

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className={`flex items-center justify-center rounded-full p-1 ${content.bgColor} ${content.color}`}>{content.icon}</div>
      {showLabel && <span className={`font-semibold ${sizeClasses[size]} ${content.color}`}>{content.label}</span>}
    </div>
  );
};

export default TrendIndicator;
