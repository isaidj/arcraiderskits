import { useMemo } from "react";
import { Quest, TraderType } from "./types";
import { getText } from "./utils";
import { Locale } from "@/config/i18n";

// Cache for search text to avoid recalculating
const searchCache = new Map<string, string>();

// Get all searchable text from a quest (multilingual)
function getAllTexts(quest: Quest): string {
  const cacheKey = quest.id;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const texts: string[] = [];

  // Add all name translations
  if (quest.name) {
    Object.values(quest.name).forEach((text) => {
      if (text) texts.push(text.toLowerCase());
    });
  }

  // Add all description translations
  if (quest.description) {
    Object.values(quest.description).forEach((text) => {
      if (text) texts.push(text.toLowerCase());
    });
  }

  // Add trader
  if (quest.trader) {
    texts.push(quest.trader.toLowerCase());
  }

  // Add objectives
  if (quest.objectives) {
    quest.objectives.forEach((obj) => {
      Object.values(obj).forEach((text) => {
        if (text) texts.push(text.toLowerCase());
      });
    });
  }

  const result = texts.join(" ");
  searchCache.set(cacheKey, result);
  return result;
}

export function useFilteredQuests(quests: Quest[], searchTerm: string, selectedTrader: TraderType, lang?: Locale) {
  return useMemo(() => {
    let filtered = quests;

    // Filter by trader
    if (selectedTrader !== "All") {
      filtered = filtered.filter((quest) => quest.trader === selectedTrader);
    }

    // Filter by search term (multilingual)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((quest) => {
        const allTexts = getAllTexts(quest);
        return allTexts.includes(search);
      });
    }

    return filtered;
  }, [quests, searchTerm, selectedTrader, lang]);
}

export function useTraders(quests: Quest[]): string[] {
  return useMemo(() => {
    const tradersSet = new Set<string>();
    quests.forEach((quest) => {
      if (quest.trader) {
        tradersSet.add(quest.trader);
      }
    });
    return Array.from(tradersSet).sort();
  }, [quests]);
}

export function useQuestStats(quests: Quest[]) {
  return useMemo(() => {
    const stats = {
      total: quests.length,
      byTrader: {} as Record<string, number>,
      withVideo: quests.filter((q) => q.videoUrl).length,
      withRewards: quests.filter((q) => q.rewardItemIds && q.rewardItemIds.length > 0).length,
    };

    quests.forEach((quest) => {
      if (quest.trader) {
        stats.byTrader[quest.trader] = (stats.byTrader[quest.trader] || 0) + 1;
      }
    });

    return stats;
  }, [quests]);
}
