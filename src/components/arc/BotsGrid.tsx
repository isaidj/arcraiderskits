"use client";

import { useMemo } from "react";
import { Bot } from "./types";
import { Locale } from "@/config/i18n";
import BotCard from "./BotCard";
import { getThreatColors } from "./threatColors";

interface BotsGridProps {
  bots: Bot[];
  lang: Locale;
}

export default function BotsGrid({ bots, lang }: BotsGridProps) {
  if (bots.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl">{lang === "es" ? "No se encontraron bots ARC." : "No ARC bots found."}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {bots.map((bot) => {
        const threatColors = getThreatColors(bot.threat || "");
        return <BotCard key={bot.id} bot={bot} lang={lang} threatColors={threatColors} />;
      })}
    </div>
  );
}
