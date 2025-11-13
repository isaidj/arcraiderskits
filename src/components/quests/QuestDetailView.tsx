import Link from "next/link";
import { Quest } from "./types";
import { Item } from "@/components/items/types";
import { Locale } from "@/config/i18n";
import { getText, getTraderBadgeColor, generateSlug } from "./utils";
import ItemCard from "@/components/items/ItemCard";
import { getRarityColors } from "@/components/items/rarityColors";
import BackButton from "@/components/BackButton";
import VideoGuide from "./VideoGuide";

interface QuestDetailViewProps {
  quest: Quest;
  allQuests: Quest[];
  allItems: Item[];
  lang: Locale;
}

export default function QuestDetailView({ quest, allQuests, allItems, lang }: QuestDetailViewProps) {
  const name = getText(quest.name, lang);
  const description = getText(quest.description, "en");

  // Armar el término de búsqueda para el video
  const videoSearchQuery = `Arc Raiders "${name}" quest guide`;

  // Get related quests
  const previousQuests = quest.previousQuestIds.map((id) => allQuests.find((q) => q.id === id)).filter(Boolean) as Quest[];

  const nextQuests = quest.nextQuestIds.map((id) => allQuests.find((q) => q.id === id)).filter(Boolean) as Quest[];

  // Get items by ID
  const getItemById = (itemId: string) => allItems.find((item) => item.id === itemId);

  return (
    <div className="max-w-5xl mx-auto space-y-2.5">
      <nav>
        <BackButton label={lang === "es" ? "Volver" : "Back"} fallbackUrl={`/${lang}/quests`} />
      </nav>
      {/* Header */}
      <div className="bg-[#0d111d]/50 backdrop-blur-sm   rounded-lg p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-[#00ffff] mb-3">{name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getTraderBadgeColor(quest.trader)}`}>{quest.trader}</span>
              {quest.xp > 0 && <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-500/20 border border-green-500/50 text-green-400">+{quest.xp} XP</span>}
              {quest.map && (
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-500/20 border border-blue-500/50 text-blue-400 capitalize">
                  📍 {quest.map.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>
        </div>

        {description && <p className="text-gray-300 text-base leading-relaxed">{description}</p>}
      </div>

      {/* Video Guide Section - Primera prioridad */}
      <VideoGuide videoUrl={quest.videoUrl} searchQuery={videoSearchQuery} lang={lang} />

      {/* Objectives - Segunda prioridad */}
      {quest.objectives && quest.objectives.length > 0 && (
        <div className="bg-[#0d111d]/50 backdrop-blur-sm   rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#00ffff] mb-4 flex items-center gap-2">📋 Objectives</h2>
          <ul className="space-y-3">
            {quest.objectives.map((objective, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-[#00ffff] font-bold mt-1 text-sm">{idx + 1}.</span>
                <span className="text-gray-300 text-sm leading-relaxed">{getText(objective, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {quest.requiredItemIds && quest.requiredItemIds.length > 0 && (
        <div className="bg-[#0d111d]/50 backdrop-blur-sm   rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#00ffff] mb-4 flex items-center gap-2">📦 Required Items</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {quest.requiredItemIds.map((questItem, idx) => {
              const item = getItemById(questItem.itemId);
              if (!item) {
                return (
                  <div key={idx} className="text-cyan-400 text-sm">
                    → {questItem.itemId} x{questItem.quantity}
                  </div>
                );
              }
              const rarityColors = getRarityColors(item.rarity || "Common");
              return <ItemCard key={idx} item={item} quantity={questItem.quantity} lang={lang} rarityColors={rarityColors} />;
            })}
          </div>
        </div>
      )}

      {/* Granted Items */}
      {quest.grantedItemIds && quest.grantedItemIds.length > 0 && (
        <div className="bg-[#0d111d]/50 backdrop-blur-sm   rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#00ffff] mb-4 flex items-center gap-2">🎁 Granted Items</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {quest.grantedItemIds.map((questItem, idx) => {
              const item = getItemById(questItem.itemId);
              if (!item) {
                return (
                  <div key={idx} className="text-cyan-400 text-sm">
                    → {questItem.itemId} x{questItem.quantity}
                  </div>
                );
              }
              const rarityColors = getRarityColors(item.rarity || "Common");
              return <ItemCard key={idx} item={item} quantity={questItem.quantity} lang={lang} rarityColors={rarityColors} />;
            })}
          </div>
        </div>
      )}

      {/* Rewards - Ancho completo horizontal */}
      {quest.rewardItemIds && quest.rewardItemIds.length > 0 && (
        <div className="bg-[#0d111d]/50 backdrop-blur-sm  rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#00ffff] mb-4 flex items-center gap-2">⭐ Rewards</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {quest.rewardItemIds.map((questItem, idx) => {
              const item = getItemById(questItem.itemId);
              if (!item) {
                return (
                  <div key={idx} className="text-cyan-400 text-sm">
                    → {questItem.itemId} x{questItem.quantity}
                  </div>
                );
              }
              const rarityColors = getRarityColors(item.rarity || "Common");
              return <ItemCard key={idx} item={item} quantity={questItem.quantity} lang={lang} rarityColors={rarityColors} />;
            })}
          </div>
        </div>
      )}

      {/* Quest Chain */}
      {(previousQuests.length > 0 || nextQuests.length > 0) && (
        <div className="bg-[#0d111d]/50 backdrop-blur-sm   rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#00ffff] mb-4">Quest Chain</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previous Quests */}
            {previousQuests.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">← Previous Quests</h3>
                <div className="space-y-2">
                  {previousQuests.map((prevQuest) => {
                    const slug = generateSlug(prevQuest.name, prevQuest.id);
                    return (
                      <Link
                        key={prevQuest.id}
                        href={`/${lang}/quests/${slug}`}
                        className="block p-3 bg-[#0d111d]/50 backdrop-blur-sm border  rounded-lg hover:border-[#00ffff] transition-colors"
                      >
                        <p className="text-cyan-400 text-sm font-semibold">{getText(prevQuest.name, lang)}</p>
                        <p className="text-gray-500 text-xs mt-1">{prevQuest.trader}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Next Quests */}
            {nextQuests.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Next Quests →</h3>
                <div className="space-y-2">
                  {nextQuests.map((nextQuest) => {
                    const slug = generateSlug(nextQuest.name, nextQuest.id);
                    return (
                      <Link
                        key={nextQuest.id}
                        href={`/${lang}/quests/${slug}`}
                        className="block p-3 bg-[#0d111d]/50 backdrop-blur-sm border border-[#00ffff]/20 rounded-lg hover:border-[#00ffff] transition-colors"
                      >
                        <p className="text-cyan-400 text-sm font-semibold">{getText(nextQuest.name, lang)}</p>
                        <p className="text-gray-500 text-xs mt-1">{nextQuest.trader}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="text-xs text-gray-500 text-center">
        Last updated: {quest.updatedAt} • Quest ID: {quest.id}
      </div>
    </div>
  );
}
