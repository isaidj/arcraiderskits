import { Locale, locales } from "@/config/i18n";
import { Item } from "@/components/items/types";
import { getText } from "@/components/items/utils";
import { guideTexts, locationText, recyclingText, notFoundTitles } from "./translations";
import type { Metadata } from "next";

export function generateItemMetadata(item: Item | undefined, lang: Locale, id: string): Metadata {
  if (!item) {
    return {
      title: notFoundTitles[lang],
    };
  }

  const itemName = getText(item.name, lang);
  const itemDescription = getText(item.description, lang);
  const rarity = item.rarity || "Unknown";
  const type = item.type || "Item";

  // Construir descripción detallada con información del item
  let detailedDescription = `${guideTexts[lang]} ${itemName} - ${rarity} ${type}. `;

  if (itemDescription) {
    detailedDescription += `${itemDescription} `;
  }

  if (item.value) {
    detailedDescription += `Value: ${item.value}. `;
  }

  if (item.weightKg) {
    detailedDescription += `Weight: ${item.weightKg}kg. `;
  }

  if (item.foundIn) {
    detailedDescription += `${locationText[lang]}: ${item.foundIn}. `;
  }

  if (item.recyclesInto && Object.keys(item.recyclesInto).length > 0) {
    detailedDescription += `${recyclingText[lang]}: ${Object.keys(item.recyclesInto).length} items. `;
  }

  // Keywords detallados
  const keywords = ["Arc Raiders", "item", "guide", "video", "tutorial", "how to get", "location", itemName, type, rarity, item.category || "", item.foundIn || ""];

  // Create alternates for all languages
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/items/${id}`;
  });

  return {
    title: `${itemName} - ${type} Guide - Arc Raiders Kits`,
    description: detailedDescription.trim(),
    keywords: keywords.filter(Boolean),
    alternates: {
      canonical: `/${lang}/items/${id}`,
      languages,
    },
    openGraph: {
      title: `${itemName} - Item Guide - Arc Raiders Kits`,
      description: detailedDescription.trim(),
      type: "article",
      locale: lang,
      images:
        item.imageFilename || item.image
          ? [
              {
                url: item.imageFilename || item.image || "",
                alt: itemName,
              },
            ]
          : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${itemName} - Item Guide - Arc Raiders Kits`,
      description: detailedDescription.trim(),
      images: item.imageFilename || item.image ? [item.imageFilename || item.image || ""] : [],
    },
  };
}
