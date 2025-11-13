"use client";

import { useState } from "react";
import { Locale } from "@/config/i18n";

interface Bot {
  id: string;
  name: string;
  image?: string;
  type?: string;
  threat?: string;
  description?: string;
  destroyXp?: number;
  lootXp?: number;
  drops?: string[];
}

interface BotsFilterProps {
  bots: Bot[];
  lang: Locale;
}

// Threat level colors using solid colors as requested
const threatColors: Record<string, string> = {
  Low: "bg-green-600",
  Medium: "bg-yellow-600",
  High: "bg-orange-600",
  Critical: "bg-red-600",
};

export default function BotsFilter({ bots, lang }: BotsFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedThreat, setSelectedThreat] = useState("All");

  const texts: Record<Locale, { search: string; allTypes: string; allThreats: string; type: string; threat: string; destroyXp: string; lootXp: string; drops: string; noResults: string }> = {
    en: { search: "Search bots...", allTypes: "All Types", allThreats: "All Threats", type: "Type", threat: "Threat", destroyXp: "Destroy XP", lootXp: "Loot XP", drops: "Drops", noResults: "No bots found" },
    es: { search: "Buscar bots...", allTypes: "Todos los Tipos", allThreats: "Todas las Amenazas", type: "Tipo", threat: "Amenaza", destroyXp: "XP por Destruir", lootXp: "XP por Saquear", drops: "Botín", noResults: "No se encontraron bots" },
    de: { search: "Bots suchen...", allTypes: "Alle Typen", allThreats: "Alle Bedrohungen", type: "Typ", threat: "Bedrohung", destroyXp: "Zerstörungs-XP", lootXp: "Beute-XP", drops: "Beute", noResults: "Keine Bots gefunden" },
    fr: { search: "Rechercher des bots...", allTypes: "Tous les types", allThreats: "Toutes les menaces", type: "Type", threat: "Menace", destroyXp: "XP de destruction", lootXp: "XP de butin", drops: "Butin", noResults: "Aucun bot trouvé" },
    pt: { search: "Pesquisar bots...", allTypes: "Todos os Tipos", allThreats: "Todas as Ameaças", type: "Tipo", threat: "Ameaça", destroyXp: "XP de Destruição", lootXp: "XP de Saque", drops: "Drops", noResults: "Nenhum bot encontrado" },
    pl: { search: "Szukaj botów...", allTypes: "Wszystkie typy", allThreats: "Wszystkie zagrożenia", type: "Typ", threat: "Zagrożenie", destroyXp: "XP za zniszczenie", lootXp: "XP za łup", drops: "Zrzuty", noResults: "Nie znaleziono botów" },
    no: { search: "Søk botter...", allTypes: "Alle typer", allThreats: "Alle trusler", type: "Type", threat: "Trussel", destroyXp: "Ødelegg XP", lootXp: "Plyndre XP", drops: "Drops", noResults: "Ingen botter funnet" },
    da: { search: "Søg bots...", allTypes: "Alle typer", allThreats: "Alle trusler", type: "Type", threat: "Trussel", destroyXp: "Destruer XP", lootXp: "Loot XP", drops: "Drops", noResults: "Ingen bots fundet" },
    it: { search: "Cerca bot...", allTypes: "Tutti i tipi", allThreats: "Tutte le minacce", type: "Tipo", threat: "Minaccia", destroyXp: "XP distruzione", lootXp: "XP bottino", drops: "Drop", noResults: "Nessun bot trovato" },
    uk: { search: "Пошук ботів...", allTypes: "Всі типи", allThreats: "Всі загрози", type: "Тип", threat: "Загроза", destroyXp: "XP за знищення", lootXp: "XP за здобич", drops: "Дропи", noResults: "Ботів не знайдено" },
    kr: { search: "봇 검색...", allTypes: "모든 유형", allThreats: "모든 위협", type: "유형", threat: "위협", destroyXp: "파괴 XP", lootXp: "약탈 XP", drops: "드롭", noResults: "봇을 찾을 수 없음" },
    ru: { search: "Поиск ботов...", allTypes: "Все типы", allThreats: "Все угрозы", type: "Тип", threat: "Угроза", destroyXp: "XP за уничтожение", lootXp: "XP за добычу", drops: "Дропы", noResults: "Боты не найдены" },
    "zh-CN": { search: "搜索机器人...", allTypes: "所有类型", allThreats: "所有威胁", type: "类型", threat: "威胁", destroyXp: "摧毁经验", lootXp: "掠夺经验", drops: "掉落", noResults: "未找到机器人" },
    ja: { search: "ボット検索...", allTypes: "全タイプ", allThreats: "全脅威", type: "タイプ", threat: "脅威", destroyXp: "破壊XP", lootXp: "略奪XP", drops: "ドロップ", noResults: "ボットが見つかりません" },
    tr: { search: "Bot ara...", allTypes: "Tüm Tipler", allThreats: "Tüm Tehditler", type: "Tip", threat: "Tehdit", destroyXp: "Yok Etme XP", lootXp: "Yağmalama XP", drops: "Düşüşler", noResults: "Bot bulunamadı" },
    "zh-TW": { search: "搜尋機器人...", allTypes: "所有類型", allThreats: "所有威脅", type: "類型", threat: "威脅", destroyXp: "摧毀經驗", lootXp: "掠奪經驗", drops: "掉落", noResults: "未找到機器人" },
    sr: { search: "Претрага ботова...", allTypes: "Сви типови", allThreats: "Све претње", type: "Тип", threat: "Претња", destroyXp: "XP за уништење", lootXp: "XP за пљачку", drops: "Дропови", noResults: "Ботови нису пронађени" },
    hr: { search: "Pretraži botove...", allTypes: "Svi tipovi", allThreats: "Sve prijetnje", type: "Tip", threat: "Prijetnja", destroyXp: "XP za uništenje", lootXp: "XP za pljačku", drops: "Dropovi", noResults: "Botovi nisu pronađeni" },
  };

  const t = texts[lang];

  // Get unique types and threats
  const types = ["All", ...Array.from(new Set(bots.map((b) => b.type).filter(Boolean))) as string[]];
  const threats = ["All", ...Array.from(new Set(bots.map((b) => b.threat).filter(Boolean))) as string[]];

  // Filter bots
  const filteredBots = bots.filter((bot) => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) || bot.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || bot.type === selectedType;
    const matchesThreat = selectedThreat === "All" || bot.threat === selectedThreat;
    return matchesSearch && matchesType && matchesThreat;
  });

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#00ffff] transition-colors"
          />

          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-[#00ffff] transition-colors">
            {types.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? t.allTypes : type}
              </option>
            ))}
          </select>

          <select value={selectedThreat} onChange={(e) => setSelectedThreat(e.target.value)} className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-[#00ffff] transition-colors">
            {threats.map((threat) => (
              <option key={threat} value={threat}>
                {threat === "All" ? t.allThreats : threat}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-400">
          Showing {filteredBots.length} of {bots.length} bots
        </p>
      </div>

      {/* Results */}
      {filteredBots.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">{t.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBots.map((bot) => {
            const localImagePath = bot.image ? `/data/images/bots/${bot.id}.png` : null;

            return (
              <div key={bot.id} className="bg-[#0d111d]/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-[#00ffff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                {localImagePath && (
                  <div className="mb-4 flex justify-center">
                    <img src={localImagePath} alt={bot.name} className="w-32 h-32 object-contain" onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }} />
                  </div>
                )}

                <h3 className="text-xl font-bold text-[#00ffff] mb-2 text-center">{bot.name}</h3>

                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {bot.type && <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">{bot.type}</span>}
                  {bot.threat && <span className={`px-3 py-1 text-white text-sm rounded-full font-semibold ${threatColors[bot.threat] || "bg-gray-600"}`}>{bot.threat}</span>}
                </div>

                {bot.description && <p className="text-gray-300 text-sm mb-4">{bot.description}</p>}

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {bot.destroyXp !== undefined && (
                    <div className="bg-gray-900/50 border border-gray-700 rounded p-2">
                      <p className="text-xs text-gray-400">{t.destroyXp}</p>
                      <p className="text-[#00ffff] font-semibold">{bot.destroyXp}</p>
                    </div>
                  )}
                  {bot.lootXp !== undefined && (
                    <div className="bg-gray-900/50 border border-gray-700 rounded p-2">
                      <p className="text-xs text-gray-400">{t.lootXp}</p>
                      <p className="text-[#00ffff] font-semibold">{bot.lootXp}</p>
                    </div>
                  )}
                </div>

                {bot.drops && bot.drops.length > 0 && (
                  <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
                    <p className="text-xs text-gray-400 mb-2">{t.drops}:</p>
                    <div className="flex flex-wrap gap-1">
                      {bot.drops.map((drop, idx) => (
                        <span key={idx} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {drop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
