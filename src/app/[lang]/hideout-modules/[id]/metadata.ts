import { Locale, locales } from "@/config/i18n";
import { HideoutModule } from "@/components/hideout-modules/types";
import { getLocalizedName } from "@/components/hideout-modules/utils";
import { guideTexts, maxLevelText, requirementsText, notFoundTitles } from "./translations";
import type { Metadata } from "next";

export function generateHideoutModuleMetadata(module: HideoutModule | undefined, lang: Locale, id: string): Metadata {
  if (!module) {
    return {
      title: notFoundTitles[lang],
    };
  }

  const moduleName = getLocalizedName(module.name, lang);

  // Build detailed description with module information
  let detailedDescription = `${guideTexts[lang]} ${moduleName}. ${maxLevelText[lang]}: ${module.maxLevel}. `;

  if (module.levels && module.levels.length > 0) {
    detailedDescription += `${module.levels.length} upgrade levels available. `;
  }

  // Count total requirements
  const totalRequirements = module.levels.reduce((sum, level) => {
    return sum + (level.requirementItemIds?.length || 0);
  }, 0);

  if (totalRequirements > 0) {
    detailedDescription += `${requirementsText[lang]}: ${totalRequirements} items needed for all upgrades. `;
  }

  // Detailed keywords
  const keywords = [
    "Arc Raiders",
    "hideout",
    "module",
    "upgrade",
    "guide",
    "requirements",
    moduleName,
    "crafting",
    "workbench",
  ];

  // Create alternates for all languages
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/hideout-modules/${id}`;
  });

  return {
    title: `${moduleName} - Hideout Module Guide - Arc Raiders Kits`,
    description: detailedDescription.trim(),
    keywords: keywords.filter(Boolean),
    alternates: {
      canonical: `/${lang}/hideout-modules/${id}`,
      languages,
    },
    openGraph: {
      title: `${moduleName} - Hideout Module Guide - Arc Raiders Kits`,
      description: detailedDescription.trim(),
      type: "article",
      locale: lang,
    },
    twitter: {
      card: "summary",
      title: `${moduleName} - Hideout Module Guide - Arc Raiders Kits`,
      description: detailedDescription.trim(),
    },
  };
}
