"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Quest, TraderType } from "./types";
import { useFilteredQuests, useTraders, useQuestStats } from "./hooks";
import { useDebounce } from "../items/useDebounce";
import { Locale } from "@/config/i18n";
import SearchBar from "./SearchBar";
import TraderFilter from "./TraderFilter";
import QuestsGrid from "./QuestsGrid";

interface QuestsFilterProps {
  quests: Quest[];
  lang: Locale;
}

export default function QuestsFilter({ quests, lang }: QuestsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // State for search and filters
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [selectedTrader, setSelectedTrader] = useState<TraderType>((searchParams.get("trader") as TraderType) || "All");

  // Debounced search term
  const debouncedSearch = useDebounce(searchInput, 300);

  // Get traders and stats
  const traders = useTraders(quests);
  const stats = useQuestStats(quests);

  // Filter quests
  const filteredQuests = useFilteredQuests(quests, debouncedSearch, selectedTrader, lang);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (selectedTrader !== "All") {
      params.set("trader", selectedTrader);
    }

    startTransition(() => {
      router.push(`/${lang}/quests?${params.toString()}`, { scroll: false });
    });
  }, [debouncedSearch, selectedTrader, router, lang]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleTraderChange = (trader: TraderType) => {
    setSelectedTrader(trader);
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar value={searchInput} onChange={handleSearchChange} placeholder="Search quests by name, description, trader..." />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-8 text-sm">
        <div className="text-gray-400">
          Showing <span className="text-[#00ffff] font-semibold">{filteredQuests.length}</span> of <span className="text-white font-semibold">{stats.total}</span> quests
        </div>
        {stats.withVideo > 0 && (
          <div className="text-gray-400">
            🎥 <span className="text-white font-semibold">{stats.withVideo}</span> with video guides
          </div>
        )}
      </div>

      {/* Trader Filter */}
      <TraderFilter traders={traders} selectedTrader={selectedTrader} onTraderChange={handleTraderChange} questCounts={stats.byTrader} />

      {/* Loading indicator */}
      {isPending && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffff]"></div>
        </div>
      )}

      {/* Quests Grid */}
      <QuestsGrid quests={filteredQuests} lang={lang} />
    </div>
  );
}
