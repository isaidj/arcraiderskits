"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bot } from "./types";
import { Locale } from "@/config/i18n";

interface BotFilterProps {
  bots: Bot[];
  lang: Locale;
  onFiltersChange: (filtered: Bot[]) => void;
}

export default function BotFilter({ bots, lang, onFiltersChange }: BotFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedThreat, setSelectedThreat] = useState(searchParams.get("threat") || "All");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "All");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name-asc");

  // Extraer tipos y niveles de amenaza únicos
  const threatLevels = Array.from(new Set(bots.map((bot) => bot.threat))).sort((a, b) => {
    const threatOrder = { Low: 0, Moderate: 1, High: 2, Critical: 3, Extreme: 4 };
    return (threatOrder[a as keyof typeof threatOrder] || 999) - (threatOrder[b as keyof typeof threatOrder] || 999);
  });

  const types = Array.from(new Set(bots.map((bot) => bot.type))).sort();

  // Filtrar y ordenar bots
  const filterAndSort = (search: string, threat: string, type: string, sort: string) => {
    let filtered = bots.filter((bot) => {
      const matchesSearch =
        search === "" ||
        bot.name.toLowerCase().includes(search.toLowerCase()) ||
        bot.type.toLowerCase().includes(search.toLowerCase()) ||
        bot.description.toLowerCase().includes(search.toLowerCase());

      const matchesThreat = threat === "All" || bot.threat === threat;
      const matchesType = type === "All" || bot.type === type;

      return matchesSearch && matchesThreat && matchesType;
    });

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "threat-asc":
          const threatOrder = { Low: 0, Moderate: 1, High: 2, Critical: 3, Extreme: 4 };
          return (threatOrder[a.threat as keyof typeof threatOrder] || 999) - (threatOrder[b.threat as keyof typeof threatOrder] || 999);
        case "threat-desc":
          const threatOrder2 = { Low: 0, Moderate: 1, High: 2, Critical: 3, Extreme: 4 };
          return (threatOrder2[b.threat as keyof typeof threatOrder2] || 999) - (threatOrder2[a.threat as keyof typeof threatOrder2] || 999);
        case "xp-asc":
          return a.destroyXp + a.lootXp - (b.destroyXp + b.lootXp);
        case "xp-desc":
          return b.destroyXp + b.lootXp - (a.destroyXp + a.lootXp);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Obtener valores actuales de searchParams
  const actualSearch = searchParams.get("search") || "";
  const actualThreat = searchParams.get("threat") || "All";
  const actualType = searchParams.get("type") || "All";
  const actualSort = searchParams.get("sort") || "name-asc";
  const filteredBots = filterAndSort(actualSearch, actualThreat, actualType, actualSort);

  const updateURL = (search: string, threat: string, type: string, sort: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (threat && threat !== "All") params.set("threat", threat);
    if (type && type !== "All") params.set("type", type);
    if (sort && sort !== "name-asc") params.set("sort", sort);

    startTransition(() => {
      router.push(`/${lang}/arc?${params.toString()}`, { scroll: false });
    });

    // Actualizar filtros mostrados
    onFiltersChange(filterAndSort(search, threat, type, sort));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURL(value, selectedThreat, selectedType, sortBy);
  };

  const handleThreatChange = (threat: string) => {
    setSelectedThreat(threat);
    updateURL(searchTerm, threat, selectedType, sortBy);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    updateURL(searchTerm, selectedThreat, type, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateURL(searchTerm, selectedThreat, selectedType, sort);
  };

  const labels = {
    en: {
      search: "Search bots...",
      threat: "Threat",
      type: "Type",
      sort: "Sort",
      all: "All",
      results: "Showing",
      of: "of",
      bots: "bots",
    },
    es: {
      search: "Buscar bots...",
      threat: "Amenaza",
      type: "Tipo",
      sort: "Ordenar",
      all: "Todos",
      results: "Mostrando",
      of: "de",
      bots: "bots",
    },
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  const selectClasses =
    "w-full px-3 py-2 bg-[#0d111d]/50 border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all cursor-pointer";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-3 py-2 bg-[#0d111d]/50 border border-gray-700 rounded-lg text-gray-300 text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
        />
      </div>

      {/* Filters Grid - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        {/* Threat Level Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{t.threat}</label>
          <select value={selectedThreat} onChange={(e) => handleThreatChange(e.target.value)} className={selectClasses}>
            <option value="All">{t.all}</option>
            {threatLevels.map((threat) => (
              <option key={threat} value={threat}>
                {threat}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{t.type}</label>
          <select value={selectedType} onChange={(e) => handleTypeChange(e.target.value)} className={selectClasses}>
            <option value="All">{t.all}</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{t.sort}</label>
        <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className={selectClasses}>
          <option value="name-asc">{lang === "es" ? "Nombre (A-Z)" : "Name (A-Z)"}</option>
          <option value="name-desc">{lang === "es" ? "Nombre (Z-A)" : "Name (Z-A)"}</option>
          <option value="threat-asc">{lang === "es" ? "Amenaza (Baja-Alta)" : "Threat (Low-High)"}</option>
          <option value="threat-desc">{lang === "es" ? "Amenaza (Alta-Baja)" : "Threat (High-Low)"}</option>
          <option value="xp-asc">{lang === "es" ? "XP (Bajo-Alto)" : "XP (Low-High)"}</option>
          <option value="xp-desc">{lang === "es" ? "XP (Alto-Bajo)" : "XP (High-Low)"}</option>
        </select>
      </div>

      {/* Results Counter */}
      <div className="pt-3 border-t border-gray-700/50">
        <p className="text-xs text-gray-500">
          {t.results} <span className="text-cyan-400 font-semibold">{filteredBots.length}</span> {t.of} {bots.length} {t.bots}
          {isPending && <span className="ml-2 text-[#00ffff] animate-pulse">...</span>}
        </p>
      </div>
    </div>
  );
}
