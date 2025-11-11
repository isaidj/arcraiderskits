import { Locale, locales } from "@/config/i18n";
import { Quest } from "@/components/quests/types";
import { getText } from "@/components/quests/utils";
import { guideTexts, objectivesText, rewardsText, notFoundTitles } from "./translations";
import type { Metadata } from "next";

export function generateQuestMetadata(quest: Quest | undefined, lang: Locale, id: string): Metadata {
  if (!quest) {
    return {
      title: notFoundTitles[lang],
    };
  }

  const questName = getText(quest.name, lang);
  const questDescription = getText(quest.description, lang);

  // Construir descripción detallada con información de la quest
  let detailedDescription = `${guideTexts[lang]} ${questName} - ${quest.trader} quest. `;

  if (questDescription) {
    detailedDescription += `${questDescription} `;
  }

  if (quest.objectives && quest.objectives.length > 0) {
    detailedDescription += `${quest.objectives.length} ${objectivesText[lang]}. `;
  }

  if (quest.xp) {
    detailedDescription += `${quest.xp} XP. `;
  }

  if (quest.rewardItemIds && quest.rewardItemIds.length > 0) {
    detailedDescription += `${rewardsText[lang]}: ${quest.rewardItemIds.length} items. `;
  }

  // Keywords detallados
  const keywords = ["Arc Raiders", "quest", "mission", "guide", "walkthrough", "video", "tutorial", questName, quest.trader, "rewards", "objectives"];

  // Agregar objetivos como keywords si existen
  if (quest.objectives) {
    quest.objectives.slice(0, 3).forEach((obj) => {
      const objText = getText(obj, lang);
      if (objText && objText.length < 50) {
        keywords.push(objText);
      }
    });
  }

  // Create alternates for all languages
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/quests/${id}`;
  });

  return {
    title: `${questName} - ${quest.trader} Quest Guide - Arc Raiders Kits`,
    description: detailedDescription.trim(),
    keywords: keywords.filter(Boolean),
    alternates: {
      canonical: `/${lang}/quests/${id}`,
      languages,
    },
    openGraph: {
      title: `${questName} - Quest Guide - Arc Raiders Kits`,
      description: detailedDescription.trim(),
      type: "article",
      locale: lang,
    },
    twitter: {
      card: "summary_large_image",
      title: `${questName} - Quest Guide - Arc Raiders Kits`,
      description: detailedDescription.trim(),
    },
  };
}
