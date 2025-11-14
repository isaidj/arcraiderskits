"use client";

import { useState } from "react";
import { Bot } from "./types";
import { Locale } from "@/config/i18n";
import BotFilter from "./BotFilter";
import BotFilterMobile from "./BotFilterMobile";
import BotsGrid from "./BotsGrid";

interface ArcPageContentProps {
  bots: Bot[];
  lang: Locale;
}

export default function ArcPageContent({ bots, lang }: ArcPageContentProps) {
  const [filteredBots, setFilteredBots] = useState<Bot[]>(bots);

  return (
    <div>
      {/* Mobile Filter - Buscador siempre visible + dropdown */}
      <BotFilterMobile bots={bots} lang={lang} onFiltersChange={setFilteredBots} />

      {/* Desktop layout with sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Sidebar Filter - Desktop only */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-[#0d111d]/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 sticky top-32">
            <BotFilter bots={bots} lang={lang} onFiltersChange={setFilteredBots} />
          </div>
        </div>

        {/* Main Grid */}
        <div className="lg:col-span-4">
          <BotsGrid bots={filteredBots} lang={lang} />
        </div>
      </div>
    </div>
  );
}
