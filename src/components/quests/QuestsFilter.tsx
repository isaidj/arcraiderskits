"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Quest, TraderType } from "./types";
import { useFilteredQuests, useTraders, useQuestStats } from "./hooks";
import { Locale } from "@/config/i18n";

import TraderFilter from "./TraderFilter";
import QuestsGrid from "./QuestsGrid";
import SearchBar from "../SearchBar";

interface QuestsFilterProps {
  quests: Quest[];
  lang: Locale;
}

export default function QuestsFilter({ quests, lang }: QuestsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [selectedTrader, setSelectedTrader] = useState<TraderType>((searchParams.get("trader") as TraderType) || "All");

  const traders = useTraders(quests);
  const stats = useQuestStats(quests);
  const filteredQuests = useFilteredQuests(quests, searchParams.get("search") || "", selectedTrader, lang);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (selectedTrader !== "All") params.set("trader", selectedTrader);

    startTransition(() => {
      router.push(`/${lang}/quests?${params.toString()}`, { scroll: false });
    });
  }, [searchInput, selectedTrader, router, lang]);

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <SearchBar value={searchInput} onChange={setSearchInput} placeholder="Search quests by name, description, trader..." />
      </div>

      <TraderFilter traders={traders} selectedTrader={selectedTrader} onTraderChange={setSelectedTrader} questCounts={stats.byTrader} />

      {isPending && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffff]"></div>
        </div>
      )}

      <QuestsGrid quests={filteredQuests} lang={lang} />
    </div>
  );
}
