"use client";

import { useState } from "react";
import { Locale } from "@/config/i18n";

interface Trade {
  trader: string;
  itemId: string;
  quantity: number;
  cost: {
    itemId: string;
    quantity: number;
  };
  dailyLimit?: number | null;
}

interface TradesFilterProps {
  trades: Trade[];
  lang: Locale;
}

export default function TradesFilter({ trades, lang }: TradesFilterProps) {
  const [selectedTrader, setSelectedTrader] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const texts: Record<Locale, { allTraders: string; search: string; trader: string; gives: string; costs: string; dailyLimit: string; unlimited: string; noResults: string }> = {
    en: { allTraders: "All Traders", search: "Search items...", trader: "Trader", gives: "Gives", costs: "Costs", dailyLimit: "Daily Limit", unlimited: "Unlimited", noResults: "No trades found" },
    es: { allTraders: "Todos los Comerciantes", search: "Buscar objetos...", trader: "Comerciante", gives: "Da", costs: "Cuesta", dailyLimit: "Límite Diario", unlimited: "Ilimitado", noResults: "No se encontraron intercambios" },
    de: { allTraders: "Alle Händler", search: "Gegenstände suchen...", trader: "Händler", gives: "Gibt", costs: "Kostet", dailyLimit: "Tageslimit", unlimited: "Unbegrenzt", noResults: "Keine Geschäfte gefunden" },
    fr: { allTraders: "Tous les commerçants", search: "Rechercher des objets...", trader: "Commerçant", gives: "Donne", costs: "Coûte", dailyLimit: "Limite quotidienne", unlimited: "Illimité", noResults: "Aucun échange trouvé" },
    pt: { allTraders: "Todos os Comerciantes", search: "Pesquisar itens...", trader: "Comerciante", gives: "Dá", costs: "Custa", dailyLimit: "Limite Diário", unlimited: "Ilimitado", noResults: "Nenhuma troca encontrada" },
    pl: { allTraders: "Wszyscy handlarze", search: "Szukaj przedmiotów...", trader: "Handlarz", gives: "Daje", costs: "Kosztuje", dailyLimit: "Dzienny limit", unlimited: "Nieograniczony", noResults: "Nie znaleziono wymian" },
    no: { allTraders: "Alle handelsmenn", search: "Søk gjenstander...", trader: "Handelsmann", gives: "Gir", costs: "Koster", dailyLimit: "Daglig grense", unlimited: "Ubegrenset", noResults: "Ingen handler funnet" },
    da: { allTraders: "Alle handelsmænd", search: "Søg genstande...", trader: "Handelsmand", gives: "Giver", costs: "Koster", dailyLimit: "Daglig grænse", unlimited: "Ubegrænset", noResults: "Ingen handler fundet" },
    it: { allTraders: "Tutti i mercanti", search: "Cerca oggetti...", trader: "Mercante", gives: "Dà", costs: "Costa", dailyLimit: "Limite giornaliero", unlimited: "Illimitato", noResults: "Nessuno scambio trovato" },
    uk: { allTraders: "Всі торговці", search: "Пошук предметів...", trader: "Торговець", gives: "Дає", costs: "Коштує", dailyLimit: "Щоденний ліміт", unlimited: "Необмежено", noResults: "Обмінів не знайдено" },
    kr: { allTraders: "모든 상인", search: "아이템 검색...", trader: "상인", gives: "제공", costs: "비용", dailyLimit: "일일 한도", unlimited: "무제한", noResults: "거래를 찾을 수 없음" },
    ru: { allTraders: "Все торговцы", search: "Поиск предметов...", trader: "Торговец", gives: "Даёт", costs: "Стоит", dailyLimit: "Дневной лимит", unlimited: "Неограниченно", noResults: "Сделки не найдены" },
    "zh-CN": { allTraders: "所有商人", search: "搜索物品...", trader: "商人", gives: "给予", costs: "花费", dailyLimit: "每日限额", unlimited: "无限", noResults: "未找到交易" },
    ja: { allTraders: "全トレーダー", search: "アイテム検索...", trader: "トレーダー", gives: "提供", costs: "コスト", dailyLimit: "日次制限", unlimited: "無制限", noResults: "取引が見つかりません" },
    tr: { allTraders: "Tüm Tüccarlar", search: "Eşya ara...", trader: "Tüccar", gives: "Verir", costs: "Maliyeti", dailyLimit: "Günlük Limit", unlimited: "Sınırsız", noResults: "Ticaret bulunamadı" },
    "zh-TW": { allTraders: "所有商人", search: "搜尋物品...", trader: "商人", gives: "給予", costs: "花費", dailyLimit: "每日限額", unlimited: "無限", noResults: "未找到交易" },
    sr: { allTraders: "Сви трговци", search: "Претрага предмета...", trader: "Трговац", gives: "Даје", costs: "Кошта", dailyLimit: "Дневни лимит", unlimited: "Неограничено", noResults: "Трговине нису пронађене" },
    hr: { allTraders: "Svi trgovci", search: "Pretraži predmete...", trader: "Trgovac", gives: "Daje", costs: "Košta", dailyLimit: "Dnevni limit", unlimited: "Neograničeno", noResults: "Trgovine nisu pronađene" },
  };

  const t = texts[lang];

  // Get unique traders
  const traders = ["All", ...Array.from(new Set(trades.map((trade) => trade.trader)))];

  // Filter trades
  const filteredTrades = trades.filter((trade) => {
    const matchesTrader = selectedTrader === "All" || trade.trader === selectedTrader;
    const matchesSearch = trade.itemId.toLowerCase().includes(searchTerm.toLowerCase()) || trade.cost.itemId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTrader && matchesSearch;
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

          <select value={selectedTrader} onChange={(e) => setSelectedTrader(e.target.value)} className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-[#00ffff] transition-colors">
            {traders.map((trader) => (
              <option key={trader} value={trader}>
                {trader === "All" ? t.allTraders : trader}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-400">
          Showing {filteredTrades.length} of {trades.length} trades
        </p>
      </div>

      {/* Results */}
      {filteredTrades.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">{t.noResults}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {traders
            .filter((trader) => trader !== "All")
            .map((trader) => {
              const traderTrades = filteredTrades.filter((trade) => trade.trader === trader);
              if (traderTrades.length === 0 && selectedTrader !== "All") return null;
              if (traderTrades.length === 0) return null;

              // Trader image mapping
              const traderImageMap: Record<string, string> = {
                Celeste: "celeste.png",
                Apollo: "apollo.png",
                Lance: "lance.png",
                Shani: "shani.png",
                "Tian Wen": "tianwen.png",
              };

              const traderImage = traderImageMap[trader] ? `/data/images/traders/${traderImageMap[trader]}` : null;

              return (
                <div key={trader} className="bg-[#0d111d]/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-6">
                    {traderImage && <img src={traderImage} alt={trader} className="w-16 h-16 rounded-full object-cover border-2 border-[#00ffff]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    <h2 className="text-2xl font-bold text-[#00ffff]">{trader}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {traderTrades.map((trade, idx) => (
                      <div key={idx} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-[#00ffff] transition-all duration-300">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">{t.gives}:</p>
                            <div className="flex items-center justify-between bg-gray-800/50 rounded p-2">
                              <span className="text-gray-300 text-sm">{trade.itemId}</span>
                              <span className="text-[#00ffff] font-semibold">x{trade.quantity}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-center">
                            <div className="w-8 h-8 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400 mb-1">{t.costs}:</p>
                            <div className="flex items-center justify-between bg-gray-800/50 rounded p-2">
                              <span className="text-gray-300 text-sm">{trade.cost.itemId}</span>
                              <span className="text-orange-400 font-semibold">x{trade.cost.quantity}</span>
                            </div>
                          </div>

                          {trade.dailyLimit !== null && trade.dailyLimit !== undefined && (
                            <div className="pt-2 border-t border-gray-700">
                              <p className="text-xs text-gray-400">
                                {t.dailyLimit}: <span className="text-yellow-400 font-semibold">{trade.dailyLimit}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
