import Link from "next/link";
import { HideoutModule } from "./types";
import { getLocalizedName, generateSlug as generateModuleSlug } from "./utils";
import { generateSlug as generateItemSlug } from "@/components/items/utils";
import BackButton from "@/components/BackButton";
import { Locale } from "@/config/i18n";
import { Item } from "@/components/items/types";

interface HideoutModuleDetailViewProps {
  module: HideoutModule;
  allItems: Item[];
  lang: Locale;
}

export default function HideoutModuleDetailView({ module, allItems, lang }: HideoutModuleDetailViewProps) {
  const moduleName = getLocalizedName(module.name, lang);

  const getItemById = (itemId: string): Item | undefined => {
    return allItems.find((item) => item.id === itemId);
  };

  const getItemName = (item: Item | undefined): string => {
    if (!item) return "Unknown Item";
    if (typeof item.name === "string") return item.name;
    return item.name[lang] || item.name.en || "Unknown Item";
  };

  const getItemImage = (item: Item | undefined): string => {
    if (!item) return "";
    return item.imageFilename || item.image || "";
  };

  const texts: Record<Locale, any> = {
    en: {
      back: "Back",
      maxLevel: "Max Level",
      upgradeGuide: "Upgrade Guide",
      level: "Level",
      requirements: "Requirements",
      noRequirements: "No requirements",
      otherRequirements: "Other Requirements",
      clickToView: "Click to view item details",
    },
    es: {
      back: "Volver",
      maxLevel: "Nivel Máximo",
      upgradeGuide: "Guía de Mejora",
      level: "Nivel",
      requirements: "Requisitos",
      noRequirements: "Sin requisitos",
      otherRequirements: "Otros Requisitos",
      clickToView: "Haz clic para ver detalles del objeto",
    },
    de: {
      back: "Zurück",
      maxLevel: "Max. Stufe",
      upgradeGuide: "Upgrade-Leitfaden",
      level: "Stufe",
      requirements: "Anforderungen",
      noRequirements: "Keine Anforderungen",
      otherRequirements: "Andere Anforderungen",
      clickToView: "Klicken Sie, um Artikeldetails anzuzeigen",
    },
    fr: {
      back: "Retour",
      maxLevel: "Niveau Max",
      upgradeGuide: "Guide d'Amélioration",
      level: "Niveau",
      requirements: "Exigences",
      noRequirements: "Aucune exigence",
      otherRequirements: "Autres Exigences",
      clickToView: "Cliquez pour voir les détails de l'objet",
    },
    pt: {
      back: "Voltar",
      maxLevel: "Nível Máximo",
      upgradeGuide: "Guia de Atualização",
      level: "Nível",
      requirements: "Requisitos",
      noRequirements: "Sem requisitos",
      otherRequirements: "Outros Requisitos",
      clickToView: "Clique para ver detalhes do item",
    },
    pl: {
      back: "Wstecz",
      maxLevel: "Maks. Poziom",
      upgradeGuide: "Przewodnik Ulepszania",
      level: "Poziom",
      requirements: "Wymagania",
      noRequirements: "Brak wymagań",
      otherRequirements: "Inne Wymagania",
      clickToView: "Kliknij, aby zobaczyć szczegóły przedmiotu",
    },
    no: {
      back: "Tilbake",
      maxLevel: "Maks Nivå",
      upgradeGuide: "Oppgraderingsveiledning",
      level: "Nivå",
      requirements: "Krav",
      noRequirements: "Ingen krav",
      otherRequirements: "Andre Krav",
      clickToView: "Klikk for å se gjenstandsdetaljer",
    },
    da: {
      back: "Tilbage",
      maxLevel: "Maks Niveau",
      upgradeGuide: "Opgraderingsvejledning",
      level: "Niveau",
      requirements: "Krav",
      noRequirements: "Ingen krav",
      otherRequirements: "Andre Krav",
      clickToView: "Klik for at se genstandsdetaljer",
    },
    it: {
      back: "Indietro",
      maxLevel: "Livello Massimo",
      upgradeGuide: "Guida all'Aggiornamento",
      level: "Livello",
      requirements: "Requisiti",
      noRequirements: "Nessun requisito",
      otherRequirements: "Altri Requisiti",
      clickToView: "Clicca per vedere i dettagli dell'oggetto",
    },
    uk: {
      back: "Назад",
      maxLevel: "Макс. Рівень",
      upgradeGuide: "Посібник з Покращення",
      level: "Рівень",
      requirements: "Вимоги",
      noRequirements: "Немає вимог",
      otherRequirements: "Інші Вимоги",
      clickToView: "Клацніть, щоб переглянути деталі предмета",
    },
    kr: {
      back: "뒤로",
      maxLevel: "최대 레벨",
      upgradeGuide: "업그레이드 가이드",
      level: "레벨",
      requirements: "요구사항",
      noRequirements: "요구사항 없음",
      otherRequirements: "기타 요구사항",
      clickToView: "아이템 세부 정보를 보려면 클릭하세요",
    },
    ru: {
      back: "Назад",
      maxLevel: "Макс. Уровень",
      upgradeGuide: "Руководство по Улучшению",
      level: "Уровень",
      requirements: "Требования",
      noRequirements: "Нет требований",
      otherRequirements: "Другие Требования",
      clickToView: "Нажмите, чтобы просмотреть детали предмета",
    },
    "zh-CN": {
      back: "返回",
      maxLevel: "最大等级",
      upgradeGuide: "升级指南",
      level: "等级",
      requirements: "要求",
      noRequirements: "无要求",
      otherRequirements: "其他要求",
      clickToView: "点击查看物品详情",
    },
    ja: {
      back: "戻る",
      maxLevel: "最大レベル",
      upgradeGuide: "アップグレードガイド",
      level: "レベル",
      requirements: "要件",
      noRequirements: "要件なし",
      otherRequirements: "その他の要件",
      clickToView: "クリックしてアイテムの詳細を表示",
    },
    tr: {
      back: "Geri",
      maxLevel: "Maks. Seviye",
      upgradeGuide: "Yükseltme Rehberi",
      level: "Seviye",
      requirements: "Gereksinimler",
      noRequirements: "Gereksinim yok",
      otherRequirements: "Diğer Gereksinimler",
      clickToView: "Eşya ayrıntılarını görmek için tıklayın",
    },
    "zh-TW": {
      back: "返回",
      maxLevel: "最大等級",
      upgradeGuide: "升級指南",
      level: "等級",
      requirements: "要求",
      noRequirements: "無要求",
      otherRequirements: "其他要求",
      clickToView: "點擊查看物品詳情",
    },
    sr: {
      back: "Назад",
      maxLevel: "Макс. Ниво",
      upgradeGuide: "Водич за Надоградњу",
      level: "Ниво",
      requirements: "Захтеви",
      noRequirements: "Нема захтева",
      otherRequirements: "Остали Захтеви",
      clickToView: "Кликните да видите детаље ставке",
    },
    hr: {
      back: "Natrag",
      maxLevel: "Maks. Razina",
      upgradeGuide: "Vodič za Nadogradnju",
      level: "Razina",
      requirements: "Zahtjevi",
      noRequirements: "Nema zahtjeva",
      otherRequirements: "Ostali Zahtjevi",
      clickToView: "Kliknite da vidite detalje predmeta",
    },
  };

  const t = texts[lang];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <BackButton label={t.back} fallbackUrl={`/${lang}/hideout-modules`} />
      </nav>

      {/* Header Section */}
      <div className="bg-[#0d111d]/90 border-2 border-[#00ffff]/50 rounded-lg p-6 mb-8 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#00ffff] mb-2">{moduleName}</h1>
            <div className="flex items-center gap-3">
              <span className="bg-[#00ffff]/20 border border-[#00ffff]/50 rounded px-3 py-1 text-gray-300">
                {t.maxLevel}: <span className="text-[#00ffff] font-bold">{module.maxLevel}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Guide Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#00ffff] mb-4">{t.upgradeGuide}</h2>

        {module.levels.map((level) => (
          <div key={level.level} className="bg-[#0d111d]/90 border-2 border-gray-700 hover:border-[#00ffff]/50 rounded-lg p-6 transition-all duration-300">
            {/* Level Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#00ffff]/20 border border-[#00ffff] rounded-lg px-4 py-2">
                <span className="text-[#00ffff] font-bold text-lg">
                  {t.level} {level.level}
                </span>
              </div>
              {level.description && <span className="text-gray-400 text-sm">{level.description}</span>}
            </div>

            {/* Requirements Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300">{t.requirements}:</h3>

              {/* Item Requirements */}
              {level.requirementItemIds && level.requirementItemIds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {level.requirementItemIds.map((req) => {
                    const item = getItemById(req.itemId);
                    const itemName = getItemName(item);
                    const itemImage = getItemImage(item);
                    const itemSlug = item ? generateItemSlug(item.name, item.id) : "";
                    const itemUrl = item ? `/${lang}/items/${itemSlug}` : "#";

                    return (
                      <Link
                        key={req.itemId}
                        href={itemUrl}
                        className="group flex items-center gap-3 bg-gray-900/50 hover:bg-gray-800/70 border border-gray-700 hover:border-[#00ffff]/50 rounded-lg p-3 transition-all duration-300"
                        title={t.clickToView}
                      >
                        {itemImage && (
                          <div className="relative w-12 h-12 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                            <img src={itemImage} alt={itemName} className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-200 font-medium truncate group-hover:text-[#00ffff] transition-colors">{itemName}</p>
                          <p className="text-[#00ffff] text-sm font-bold">x{req.quantity}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">{t.noRequirements}</p>
              )}

              {/* Other Requirements */}
              {level.otherRequirements && level.otherRequirements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-400 mb-2">{t.otherRequirements}:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {level.otherRequirements.map((req, index) => (
                      <li key={index} className="text-gray-300">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
