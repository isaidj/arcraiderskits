import Image from "next/image";
import Link from "next/link";
import { Item } from "./types";
import { getText, generateSlug } from "./utils";
import { getRarityColors } from "./rarityColors";
import { translateLocations } from "./locationTranslations";
import BackButton from "@/components/BackButton";
import { Locale } from "@/config/i18n";
import ItemCard from "./ItemCard";
import VideoGuide from "@/components/quests/VideoGuide";

interface ItemDetailViewProps {
  item: Item;
  relatedItems: Item[];
  allItems: Item[];
  lang: Locale;
}

export default function ItemDetailView({ item, relatedItems, allItems, lang }: ItemDetailViewProps) {
  const rarityColors = getRarityColors(item.rarity || "");
  const itemImage = item.imageFilename || item.image;

  // Armar el término de búsqueda para el video
  const itemName = getText(item.name, lang);
  const videoSearchQuery = `Arc Raiders "${itemName}" how to get location`;

  // Items que se obtienen al reciclar este item
  const recyclingResults = item.recyclesInto
    ? Object.entries(item.recyclesInto)
        .map(([itemId, quantity]) => {
          const relatedItem = allItems.find((i) => i.id === itemId);
          return relatedItem ? { item: relatedItem, quantity } : null;
        })
        .filter(Boolean)
    : [];

  // Items que pueden reciclarse en este item
  const canBeRecycledInto = allItems.filter((i) => {
    if (i.recyclesInto && typeof i.recyclesInto === "object") {
      return Object.keys(i.recyclesInto).includes(item.id);
    }
    return false;
  });

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <BackButton label={lang === "es" ? "Volver" : "Back"} fallbackUrl={`/${lang}/items`} />
      </nav>

      {/* Main Content */}
      <div className="mb-8">
        {/* Header Section - Image, Title and Stats */}
        <div
          className={`bg-[#0d111d]/50 backdrop-blur-sm ${rarityColors.gradient} border-2 ${rarityColors.border} rounded-lg p-4 mb-6`}
          style={{ boxShadow: `0 0 5px ${rarityColors.glow}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Image */}
            <div className="md:col-span-1 max-w-[200px] mx-auto md:max-w-none w-full">
              {itemImage && (
                <div
                  className={`relative w-full aspect-square ${rarityColors.gradient}  rounded-2xl overflow-hidden border-2 ${rarityColors.border}`}
                  style={{ boxShadow: `0 0 5px ${rarityColors.glow}` }}
                >
                  {/* Marca decorativa curva en esquina inferior izquierda */}
                  <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 pointer-events-none z-10">
                    <svg viewBox="0 0 100 100" className="w-full h-full opacity-70">
                      <path d="M 0 100 L 0 0 Q 0 100 100 100 Z" fill={rarityColors.color} />
                    </svg>
                  </div>
                  <Image src={itemImage} alt={getText(item.name, lang)} fill className="object-contain p-2 rounded item-image-transition" priority />
                </div>
              )}
            </div>

            {/* Title and Stats */}
            <div className="md:col-span-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-100 mb-2 item-title-transition">{getText(item.name, lang)}</h1>

              <div className="flex items-center gap-2 flex-wrap mb-3 md:mb-4">
                {item.rarity && <span className={`px-2 py-1 rounded text-xs font-medium ${rarityColors.bg} text-white`}>{item.rarity}</span>}
                {item.type && <span className="px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300">{item.type}</span>}
                {item.category && <span className="px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-400">{item.category}</span>}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {item.value !== undefined && (
                  <div className="bg-gray-900/50 rounded p-2">
                    <span className="text-[10px] text-gray-500 uppercase block mb-0.5">{lang === "es" ? "Valor" : "Value"}</span>
                    <p className="text-sm md:text-base font-bold text-green-400">{item.value}</p>
                  </div>
                )}
                {item.weightKg !== undefined && (
                  <div className="bg-gray-900/50 rounded p-2">
                    <span className="text-[10px] text-gray-500 uppercase block mb-0.5">{lang === "es" ? "Peso" : "Weight"}</span>
                    <p className="text-sm md:text-base font-bold text-gray-200">{item.weightKg} kg</p>
                  </div>
                )}
                {item.stackSize !== undefined && (
                  <div className="bg-gray-900/50 rounded p-2">
                    <span className="text-[10px] text-gray-500 uppercase block mb-0.5">{lang === "es" ? "Pila" : "Stack"}</span>
                    <p className="text-sm md:text-base font-bold text-gray-200">{item.stackSize}</p>
                  </div>
                )}
              </div>

              {/* Location Tags */}
              {item.foundIn && (
                <div className="mt-2 md:mt-3">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1.5">{lang === "es" ? "Ubicación" : "Location"}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.foundIn.split(",").map((location: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-cyan-900/30 border border-cyan-700/50 rounded text-xs text-cyan-400 font-medium">
                        {translateLocations(location.trim(), lang)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {item.description && (
                <div className="mt-2 md:mt-3">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1.5">{lang === "es" ? "Descripción" : "Description"}</span>
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{getText(item.description, lang)}</p>
                </div>
              )}

              {/* Effects */}
              {item.effects && Object.keys(item.effects).length > 0 && (
                <div className="mt-3 md:mt-4">
                  <span className="text-[10px] text-gray-500 uppercase block mb-1.5">{lang === "es" ? "Efectos" : "Effects"}</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {Object.entries(item.effects).map(([key, effect]: [string, any]) => (
                      <div key={key} className="bg-gray-900/50 rounded p-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400">{getText(effect, lang)}</span>
                          {effect.value && <span className="text-[#00ffff] font-bold text-sm">{effect.value}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-gray-500 mt-2">
                <span className="text-gray-600">ID:</span> <span className="font-mono">{item.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          {/* Recycling Results */}
          {recyclingResults.length > 0 && (
            <div className="bg-[#0d111d]/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#00ffff] mb-4 flex items-center gap-2">♻️ {lang === "es" ? "Se recicla en" : "Recycles Into"}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {recyclingResults.map((result: any, idx: number) => {
                  return <ItemCard key={idx} item={result.item} lang={lang} rarityColors={getRarityColors(result.item.rarity || "")} />;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Video Guide Section */}
      <VideoGuide videoUrl={item.videoUrl} searchQuery={videoSearchQuery} />

      {/* Related Items Section */}
      <div className="space-y-6">
        {/* Can be recycled into this */}
        {canBeRecycledInto.length > 0 && (
          <div className="bg-[#0d111d]/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#00ffff] mb-4 flex items-center gap-2">🔄 {lang === "es" ? "Obtenido al reciclar" : "Obtained by Recycling"}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {canBeRecycledInto.map((relatedItem: Item, idx: number) => (
                <ItemCard key={idx} item={relatedItem} lang={lang} rarityColors={getRarityColors(relatedItem.rarity || "")} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
