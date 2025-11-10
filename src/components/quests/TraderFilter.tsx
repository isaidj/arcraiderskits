import { TraderType } from "./types";
import { getTraderBadgeColor } from "./utils";

interface TraderFilterProps {
  traders: string[];
  selectedTrader: TraderType;
  onTraderChange: (trader: TraderType) => void;
  questCounts: Record<string, number>;
}

export default function TraderFilter({ traders, selectedTrader, onTraderChange, questCounts }: TraderFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Filter by Trader</h3>
      <div className="flex flex-wrap gap-2">
        {/* All traders button */}
        <button
          onClick={() => onTraderChange("All")}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
            selectedTrader === "All" ? "bg-[#00ffff]/20 border-[#00ffff] text-[#00ffff]" : "bg-black/50 border-gray-700 text-gray-400 hover:border-gray-500"
          }`}
        >
          All ({Object.values(questCounts).reduce((a, b) => a + b, 0)})
        </button>

        {/* Individual traders */}
        {traders.map((trader) => {
          const count = questCounts[trader] || 0;
          const badgeColor = getTraderBadgeColor(trader);
          const isSelected = selectedTrader === trader;

          return (
            <button
              key={trader}
              onClick={() => onTraderChange(trader as TraderType)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                isSelected ? badgeColor : "bg-black/50 border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {trader} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
