import Link from "next/link";
import { Quest } from "./types";
import { Locale } from "@/config/i18n";
import { getText, getTraderBadgeColor } from "./utils";

interface QuestCardProps {
  quest: Quest;
  lang?: Locale;
}

export default function QuestCard({ quest, lang }: QuestCardProps) {
  const name = getText(quest.name, lang);
  const description = getText(quest.description, lang);
  const hasVideo = !!quest.videoUrl;
  const hasRewards = quest.rewardItemIds && quest.rewardItemIds.length > 0;
  const hasRequirements = quest.requiredItemIds && quest.requiredItemIds.length > 0;
  const questUrl = lang ? `/${lang}/quests/${quest.id}` : `/quests/${quest.id}`;

  return (
    <Link href={questUrl}>
      <div className=" group relative bg-black/90 border border-[#00ffff]/30 rounded-lg p-6 hover:border-[#00ffff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] cursor-pointer h-full flex flex-col">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00ffff]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00ffff]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#00ffff] mb-2 group-hover:text-white transition-colors">{name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Trader badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTraderBadgeColor(quest.trader)}`}>{quest.trader}</span>

              {/* XP badge */}
              {quest.xp > 0 && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 border border-green-500/50 text-green-400">{quest.xp} XP</span>}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex gap-2">
            {hasVideo && (
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                <span className="text-red-400 text-sm">🎥</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {description && <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{description}</p>}

        {/* Footer info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-[#00ffff]/10">
          {quest.objectives && quest.objectives.length > 0 && <span>📋 {quest.objectives.length} objectives</span>}
          {hasRequirements && <span>📦 {quest.requiredItemIds!.length} items needed</span>}
          {quest.map && <span className="capitalize">📍 {quest.map.replace(/_/g, " ")}</span>}
        </div>

        {/* Quest chain indicator */}
        {(quest.previousQuestIds.length > 0 || quest.nextQuestIds.length > 0) && (
          <div className="flex items-center gap-2 mt-3 text-xs">
            {quest.previousQuestIds.length > 0 && <span className="text-gray-500">← Previous</span>}
            {quest.previousQuestIds.length > 0 && quest.nextQuestIds.length > 0 && <span className="text-gray-600">•</span>}
            {quest.nextQuestIds.length > 0 && <span className="text-gray-500">Next →</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
