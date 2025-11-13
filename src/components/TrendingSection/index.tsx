import { Locale } from "@/config/i18n";
import ItemCard from "@/components/items/ItemCard";
import QuestCard from "@/components/quests/QuestCard";
import { Item } from "@/components/items/types";
import { Quest } from "@/components/quests/types";
import { translations } from "./translations";
import { getRarityColors } from "@/components/items/rarityColors";

interface TrendingData {
  period: string;
  items: Array<{
    item_id: string;
    view_count: number;
    last_viewed: string;
    data: Item;
  }>;
  quests: Array<{
    quest_id: string;
    view_count: number;
    last_viewed: string;
    data: Quest;
  }>;
}

interface TrendingSectionProps {
  lang: Locale;
  trendingData: TrendingData;
}

export default function TrendingSection({ lang, trendingData }: TrendingSectionProps) {
  const t = translations[lang] || translations.en;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl  font-bold mb-4 text-[#e8e4cf]">{t.title}</h1>
          <p className="text-gray-400 text-lg">{t.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {!trendingData || (trendingData.items.length === 0 && trendingData.quests.length === 0) ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-400 text-lg">{t.noData}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Items Column */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#e8e4cf] mb-4">{t.itemsTab}</h2>
              </div>
              <div className="grid grid-cols-3  md:grid-cols-3  gap-2">
                {trendingData.items.length > 0 ? (
                  trendingData.items.map((item) => (
                    <ItemCard
                      key={item.item_id}
                      item={item.data}
                      lang={lang}
                      viewMode="horizontal"
                      rarityColors={getRarityColors(item.data.rarity || "common")}
                      topRightValue={item.view_count}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-400">{t.noData}</div>
                )}
              </div>
            </div>

            {/* Quests Column */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#e8e4cf] mb-4">{t.questsTab}</h2>
              </div>
              <div className="flex flex-col gap-3">
                {trendingData.quests.length > 0 ? (
                  trendingData.quests.map((quest) => <QuestCard key={quest.quest_id} quest={quest.data} lang={lang} viewMode="horizontal" topRightValue={quest.view_count} />)
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-400">{t.noData}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ffff]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0099ff]/5 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}
