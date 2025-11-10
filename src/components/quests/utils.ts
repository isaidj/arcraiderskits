import { MultiLangText } from "./types";
import { Locale } from "@/config/i18n";

export function getText(multiLangText: MultiLangText | undefined, language?: Locale): string {
  if (!multiLangText) return "";
  const lang = language || "en";
  return multiLangText[lang] || multiLangText.en || "";
}

// Trader color mapping
export const traderColors: Record<string, string> = {
  Shani: "text-cyan-400",
  Celeste: "text-purple-400",
  "Tian Wen": "text-amber-400",
  Apollo: "text-green-400",
};

// Get trader badge color
export const getTraderBadgeColor = (trader: string): string => {
  const colors: Record<string, string> = {
    Shani: "bg-cyan-500/20 border-cyan-500/50 text-cyan-400",
    Celeste: "bg-purple-500/20 border-purple-500/50 text-purple-400",
    "Tian Wen": "bg-amber-500/20 border-amber-500/50 text-amber-400",
    Apollo: "bg-green-500/20 border-green-500/50 text-green-400",
  };
  return colors[trader] || "bg-gray-500/20 border-gray-500/50 text-gray-400";
};
