import Link from "next/link";
import { Quest } from "./types";
import { Locale } from "@/config/i18n";
import { getText, getTraderBadgeColor, generateSlug } from "./utils";
import TrendIndicator from "@/components/TrendIndicator";

export type QuestViewMode = "normal" | "horizontal";

type TrendDirection = "up" | "down" | "same" | "new";

interface QuestCardProps {
  quest: Quest;
  lang?: Locale;
  viewMode?: QuestViewMode;
  topRightValue?: string | number;
  trendDirection?: TrendDirection;
  rankChange?: number;
}

export default function QuestCard({ quest, lang, viewMode = "normal", topRightValue, trendDirection, rankChange = 0 }: QuestCardProps) {
  const name = getText(quest.name, lang);
  const description = getText(quest.description, lang);
  const slug = generateSlug(quest.name, quest.id);
  const questUrl = lang ? `/${lang}/quests/${slug}` : `/quests/${slug}`;

  // Modo horizontal (compacto)
  if (viewMode === "horizontal") {
    return (
      <Link href={questUrl}>
        <div className="group relative bg-[#0d111d]  rounded-lg border-2 border-[#00ffff]/30 hover:border-[#00ffff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] cursor-pointer ">
          {/* Valor arriba a la derecha */}
          {topRightValue !== undefined && (
            <div className="absolute -top-2 -right-2 bg-linear-to-br from-[#0d111d] to-[#1a1f2e] border-2 border-[#00ffff]/50 text-gray-100 text-sm font-bold px-2.5 py-1 rounded-md shadow-lg z-20 ">
              {topRightValue}
            </div>
          )}

          {/* Trend Indicator */}
          {trendDirection && (
            <div className="absolute -top-2 -left-2 z-20">
              <TrendIndicator direction={trendDirection} rankChange={rankChange} size="sm" showLabel={false} />
            </div>
          )}

          <div className="flex items-center gap-3 p-3">
            {/* Quest Icon */}
            <div className="shrink-0 w-12 h-12 bg-[#00ffff]/10 rounded-lg flex items-center justify-center border border-[#00ffff]/20">
              <svg className="fill-[#00ffff] w-6 h-6 group-hover:fill-white transition-colors" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <path d="M61.7881 31.8945L31.8945 61.7881L2 31.8945L31.8945 2L61.7881 31.8945ZM10.5254 31.917L31.748 53.1387L52.9697 31.917L31.748 10.6953L10.5254 31.917Z"></path>
                <rect x="31.7887" y="26.3242" width="20.0249" height="20.0249" transform="rotate(45 31.7887 26.3242)"></rect>
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#00ffff] mb-1.5 group-hover:text-white transition-colors truncate">{name}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getTraderBadgeColor(quest.trader)}`}>{quest.trader}</span>
                {quest.xp > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 border border-green-500/50 text-green-400">{quest.xp} XP</span>}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Modo normal (vertical)

  return (
    <Link href={questUrl}>
      <div className="group relative bg-[#0d111d]/90  rounded-lg p-6 border border-transparent hover:border-[#00ffff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] cursor-pointer h-full flex flex-col">
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
        </div>

        {/* Description */}
        {description && <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{description}</p>}

        {/* Footer info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-[#00ffff]/10">
          {(quest.objectives?.length ?? 0) > 0 && <span>📋 {quest.objectives?.length} objectives</span>}
          {(quest.requiredItemIds?.length ?? 0) > 0 && <span>📦 {quest.requiredItemIds?.length} items needed</span>}
          {quest.map && <span className="capitalize">📍 {quest.map.replace(/_/g, " ")}</span>}
        </div>
      </div>
    </Link>
  );
}
