import Image from "next/image";
import { Bot } from "./types";
import { getText, generateSlug, getBotImage } from "./utils";
import { getThreatColors } from "./threatColors";
import BackButton from "@/components/BackButton";
import { Locale } from "@/config/i18n";
import BotCard from "./BotCard";
import ItemCard from "@/components/items/ItemCard";
import { getRarityColors } from "@/components/items/rarityColors";
import {
  backText,
  descriptionText,
  destroyXpText,
  lootXpText,
  dropsText,
  typeText,
  threatText,
  relatedBotsText,
  combatInfoText,
  rewardsText,
  weaknessText,
  foundInText,
} from "@/app/[lang]/arc/[id]/translations";

interface MapEntry {
  id: string;
  name: { en: string; [key: string]: string };
  image: string;
}

interface BotDetailViewProps {
  bot: Bot;
  relatedBots: Bot[];
  allBots: Bot[];
  lang: Locale;
  items?: Array<any>;
  maps?: MapEntry[];
}

export default function BotDetailView({ bot, relatedBots, allBots, lang, items = [], maps = [] }: BotDetailViewProps) {
  const threatColors = getThreatColors(bot.threat || "");

  const t = {
    back: backText[lang],
    description: descriptionText[lang],
    destroyXp: destroyXpText[lang],
    lootXp: lootXpText[lang],
    drops: dropsText[lang],
    type: typeText[lang],
    threat: threatText[lang],
    relatedBots: relatedBotsText[lang],
    combatInfo: combatInfoText[lang],
    rewards: rewardsText[lang],
    weakness: weaknessText[lang],
    foundIn: foundInText[lang],
  };

  const getMapName = (mapId: string): string => {
    const mapEntry = maps.find((m) => m.id === mapId);
    if (!mapEntry) return mapId.replace(/_/g, " ");
    const langKey = lang === "kr" ? "ko-KR" : lang;
    return mapEntry.name[langKey] || mapEntry.name.en || mapId;
  };

  // Encontrar item por nombre del drop
  const getItemByDropName = (dropName: string) => {
    // Normalizar el nombre del drop para comparación
    const normalizedDropName = dropName.toLowerCase().trim();

    return items.find((item: any) => {
      // Comparar por ID (el drop name suele ser el ID del item)
      if (item.id && item.id.toLowerCase() === normalizedDropName) {
        return true;
      }

      // Comparar por nombre en diferentes idiomas
      if (item.name) {
        if (typeof item.name === "string") {
          return item.name.toLowerCase() === normalizedDropName;
        } else if (typeof item.name === "object") {
          // Verificar en todos los idiomas
          return Object.values(item.name).some((name) => typeof name === "string" && name.toLowerCase() === normalizedDropName);
        }
      }

      return false;
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-3">
        <BackButton label={t.back} fallbackUrl={`/${lang}/arc`} />
      </nav>

      {/* Main Content */}
      <div className="mb-4">
        {/* Header Section - Image, Title and Stats */}
        <div className={`bg-[#0d111d]/50 backdrop-blur-xs border-2 ${threatColors.border} rounded-lg p-3 mb-4`} style={{ boxShadow: `0 0 20px ${threatColors.glow}` }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Image */}
            <div className="md:col-span-1 max-w-[300px] mx-auto md:max-w-none w-full">
              {bot.image && (
                <div
                  className={`relative w-full aspect-square ${threatColors.gradient} rounded-2xl overflow-hidden border-2 ${threatColors.border}`}
                  style={{ boxShadow: `0 0 15px ${threatColors.glow}` }}
                >
                  {/* Marca decorativa curva en esquina inferior izquierda */}
                  <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full opacity-70">
                      <path d="M 0 100 L 0 0 Q 0 100 100 100 Z" fill={threatColors.color} />
                    </svg>
                  </div>
                  <Image src={getBotImage(bot)} alt={getText(bot.name, lang)} fill className="object-cover" priority unoptimized />
                </div>
              )}
            </div>

            {/* Title and Stats */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">{getText(bot.name, lang)}</h1>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                {bot.threat && <span className={`px-3 py-1.5 rounded text-sm font-bold ${threatColors.bg} text-white`}>{bot.threat}</span>}
                {bot.type && <span className="px-3 py-1.5 rounded text-sm font-medium bg-gray-700 text-gray-300">{bot.type}</span>}
              </div>

              {/* Description */}
              {bot.description && (
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">{t.description}</h3>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">{getText(bot.description, lang)}</p>
                </div>
              )}

              {/* Weakness */}
              {bot.weakness && (
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-yellow-500 uppercase mb-1">{t.weakness}</h3>
                  <p className="text-sm md:text-base text-yellow-200 leading-relaxed bg-yellow-950/30 border border-yellow-700/40 rounded-lg px-3 py-2">
                    ⚠️ {bot.weakness}
                  </p>
                </div>
              )}

              {/* Maps */}
              {bot.maps && bot.maps.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">{t.foundIn}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {bot.maps.map((mapId) => (
                      <span key={mapId} className="px-2 py-1 rounded text-xs font-medium bg-gray-800 border border-gray-600 text-gray-300">
                        {getMapName(mapId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Combat Info Section */}
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">{t.combatInfo}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-2">
                    <span className="text-[10px] text-gray-500 uppercase block mb-0.5">{t.type}</span>
                    <p className="text-sm font-bold text-gray-200">{bot.type}</p>
                  </div>
                  <div className={`${threatColors.bg} bg-opacity-20 border ${threatColors.border} rounded-lg p-2`}>
                    <span className="text-[10px] text-gray-200  uppercase block mb-0.5">{t.threat}</span>
                    <p className={`text-sm font-bold ${threatColors.text}`}>{bot.threat}</p>
                  </div>
                </div>
              </div>

              {/* Rewards Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">{t.rewards}</h3>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-blue-950/30 border border-blue-700/50 rounded-lg p-2">
                    <span className="text-[10px] text-blue-400 uppercase block mb-0.5">{t.destroyXp}</span>
                    <p className="text-lg font-bold text-blue-300">{bot.destroyXp}</p>
                  </div>
                  <div className="bg-purple-950/30 border border-purple-700/50 rounded-lg p-2">
                    <span className="text-[10px] text-purple-400 uppercase block mb-0.5">{t.lootXp}</span>
                    <p className="text-lg font-bold text-purple-300">{bot.lootXp}</p>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-gray-500 mt-2">
                <span className="text-gray-600">ID:</span> <span className="font-mono">{bot.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loot Drops Section */}
        {bot.drops && bot.drops.length > 0 && (
          <div className="bg-[#0d111d]/50 backdrop-blur-sm rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold text-[#e8e4cf]  mb-3 flex items-center gap-2"> {t.drops}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {bot.drops.map((drop: string, idx: number) => {
                const item = getItemByDropName(drop);
                if (!item) {
                  console.log(`Item not found for drop: ${drop}`);
                  return null;
                }
                const rarityColors = getRarityColors(item.rarity || "");
                return <ItemCard key={idx} item={item} lang={lang} viewMode="compact" rarityColors={rarityColors} />;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Related Bots Section */}
      {relatedBots.length > 0 && (
        <div className="bg-[#0d111d]/50 backdrop-blur-sm rounded-lg p-4">
          <h2 className="text-lg font-bold text-[#00ffff] mb-3 flex items-center gap-2">🤖 {t.relatedBots}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {relatedBots.map((relatedBot: Bot) => {
              const relatedThreatColors = getThreatColors(relatedBot.threat || "");
              return <BotCard key={relatedBot.id} bot={relatedBot} lang={lang} threatColors={relatedThreatColors} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
