import { Locale } from "@/config/i18n";
import ItemCard from "@/components/items/ItemCard";
import QuestCard from "@/components/quests/QuestCard";
import { Item } from "@/components/items/types";
import { Quest } from "@/components/quests/types";
import { translations } from "./translations";
import { getRarityColors } from "@/components/items/rarityColors";
import TrendIndicator from "@/components/TrendIndicator";

interface TrendingData {
  period: string;
  items: Array<{
    item_id: string;
    view_count: number;
    last_viewed: string;
    current_rank: number;
    previous_rank: number | null;
    trend_direction: "up" | "down" | "same" | "new";
    rank_change: number;
    data: Item;
  }>;
  quests: Array<{
    quest_id: string;
    view_count: number;
    last_viewed: string;
    current_rank: number;
    previous_rank: number | null;
    trend_direction: "up" | "down" | "same" | "new";
    rank_change: number;
    data: Quest;
  }>;
}

interface TrendingSectionProps {
  lang: Locale;
  trendingData: TrendingData;
}

export default function TrendingSection({ lang, trendingData }: TrendingSectionProps) {
  const t = translations[lang] || translations.en;

  // Limitar a 6 items y 6 quests para layout balanceado
  const displayItems = trendingData.items.slice(0, 6);
  const displayQuests = trendingData.quests.slice(0, 6);

  // Stats totales
  const totalItemViews = trendingData.items.reduce((sum, item) => sum + item.view_count, 0);
  const totalQuestViews = trendingData.quests.reduce((sum, quest) => sum + quest.view_count, 0);

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 pt-16 pb-12">
        {/* Decorative background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-[#00ffff]/20 via-[#00ffff]/5 to-transparent rounded-full blur-[80px]" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[#00ffff] via-[#e8e4cf] to-[#00ffff] bg-clip-text text-transparent animate-gradient-x">
            Arc Raiders
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-8">{t.subtitle}</p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0d111d]/80 backdrop-blur-sm border border-[#00ffff]/20 rounded-full">
              <span className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse" />
              <span className="text-gray-300 text-sm">
                <span className="font-bold text-[#00ffff]">{totalItemViews + totalQuestViews}</span> views today
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0d111d]/80 backdrop-blur-sm border border-[#ff6b35]/20 rounded-full">
              <span className="text-gray-300 text-sm">
                🔥 <span className="font-bold text-[#ff6b35]">{trendingData.items.length}</span> trending items
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0d111d]/80 backdrop-blur-sm border border-[#a855f7]/20 rounded-full">
              <span className="text-gray-300 text-sm">
                📋 <span className="font-bold text-[#a855f7]">{trendingData.quests.length}</span> trending quests
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 pb-16">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00ffff]/50 to-transparent" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#e8e4cf] flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            {t.title}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00ffff]/50 to-transparent" />
        </div>

        {/* Content */}
        {!trendingData || (trendingData.items.length === 0 && trendingData.quests.length === 0) ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center bg-[#0d111d]/60 backdrop-blur-sm rounded-2xl p-12 border border-[#00ffff]/10">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-400 text-lg">{t.noData}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Items Column */}
            <div className="bg-[#0d111d]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#ff6b35]/20 hover:border-[#ff6b35]/40 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#e8e4cf] flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#ff6b35]/20 flex items-center justify-center">
                    <span className="text-lg">⚔️</span>
                  </span>
                  {t.itemsTab}
                </h3>
                <span className="text-xs text-gray-500 bg-[#ff6b35]/10 px-3 py-1 rounded-full">Top {displayItems.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {displayItems.length > 0 ? (
                  displayItems.map((item) => (
                    <div key={item.item_id} className="relative">
                      {/* Trend Indicator Badge */}
                      <div className="absolute -top-2 -left-2 z-30">
                        <TrendIndicator direction={item.trend_direction} rankChange={item.rank_change} size="md" showLabel={true} />
                      </div>
                      <ItemCard
                        item={item.data}
                        lang={lang}
                        viewMode="horizontal"
                        rarityColors={getRarityColors(item.data.rarity || "common")}
                        topRightValue={item.view_count}
                        trendDirection={item.trend_direction}
                        rankChange={item.rank_change}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-400">{t.noData}</div>
                )}
              </div>
            </div>

            {/* Quests Column */}
            <div className="bg-[#0d111d]/40 backdrop-blur-sm rounded-2xl p-6 border border-[#a855f7]/20 hover:border-[#a855f7]/40 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#e8e4cf] flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#a855f7]/20 flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </span>
                  {t.questsTab}
                </h3>
                <span className="text-xs text-gray-500 bg-[#a855f7]/10 px-3 py-1 rounded-full">Top {displayQuests.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {displayQuests.length > 0 ? (
                  displayQuests.map((quest) => (
                    <div key={quest.quest_id} className="relative">
                      {/* Trend Indicator Badge */}
                      <div className="absolute -top-2 -left-2 z-30">
                        <TrendIndicator direction={quest.trend_direction} rankChange={quest.rank_change} size="md" showLabel={true} />
                      </div>
                      <QuestCard
                        quest={quest.data}
                        lang={lang}
                        viewMode="horizontal"
                        topRightValue={quest.view_count}
                        trendDirection={quest.trend_direction}
                        rankChange={quest.rank_change}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-400">{t.noData}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070a13] to-transparent pointer-events-none -z-10" />
      </section>
    </div>
  );
}
