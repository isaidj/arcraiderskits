import Image from "next/image";
import Link from "next/link";
import { Item, RarityColors } from "./types";
import { getText, generateSlug } from "./utils";
import { Locale } from "@/config/i18n";
import ItemPopover from "./ItemPopover";
import TrendIndicator from "@/components/TrendIndicator";

export type ViewMode = "normal" | "compact" | "horizontal";

type TrendDirection = "up" | "down" | "same" | "new";

interface ItemCardProps {
  item: Item;
  lang?: Locale;
  viewMode?: ViewMode;
  rarityColors: RarityColors;
  quantity?: number;
  topRightValue?: string | number;
  trendDirection?: TrendDirection;
  rankChange?: number;
}

export default function ItemCard({ item, lang, viewMode = "normal", rarityColors, quantity, topRightValue, trendDirection, rankChange = 0 }: ItemCardProps) {
  const itemName = getText(item.name, lang);
  const itemImage = item.imageFilename || item.image;
  const slug = generateSlug(item.name, item.id);
  const itemUrl = lang ? `/${lang}/items/${slug}` : `/items/${slug}`;

  // Vista horizontal (imagen a la izquierda, título a la derecha)
  if (viewMode === "horizontal") {
    return (
      <ItemPopover item={item} lang={lang}>
        <div className="w-full">
          <Link href={itemUrl} className="group relative flex cursor-pointer">
            <div
              className={`card-chrome-border w-full relative flex items-center bg-[#0d111d]/90 ${rarityColors.gradient} border-2 ${rarityColors.border} rounded-lg p-2 hover:scale-[1.02] transition-all duration-300 ${rarityColors.shadow} overflow-hidden`}
            >
              {/* Valor arriba a la derecha */}
              {topRightValue !== undefined && (
                <div
                  className={`absolute -top-2 -right-2 bg-linear-to-br from-[#0d111d] to-[#1a1f2e] border-2 ${rarityColors.border} text-gray-100 text-sm font-bold px-2.5 py-1 rounded-md shadow-lg z-20 backdrop-blur-sm`}
                >
                  {topRightValue}
                </div>
              )}

              {/* Trend Indicator */}
              {trendDirection && (
                <div className="absolute -bottom-1.5 -right-2 z-20">
                  <TrendIndicator direction={trendDirection} rankChange={rankChange} size="md" showLabel={false} />
                </div>
              )}

              {/* Imagen a la izquierda */}
              {itemImage ? (
                <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
                  <Image src={itemImage} alt={itemName || "Item"} fill sizes="64px" className="object-contain p-1 group-hover:scale-110 transition-transform" unoptimized />
                </div>
              ) : (
                <div className="w-16 h-16 shrink-0 bg-[#0d111d]/90 rounded flex items-center justify-center ">
                  <span className="text-gray-500 text-sm"></span>
                </div>
              )}

              {/* Título a la derecha */}
              <div className="flex-1 ml-3 min-w-0">
                <h3 className="text-base font-semibold text-gray-200 truncate relative z-10">{itemName || "Unknown Item"}</h3>
              </div>

              {/* Quantity badge */}
              {quantity && quantity > 1 && <div className="ml-2 bg-[#00ffff]/90 text-black font-bold text-xs px-2 py-1 rounded-full shrink-0">x{quantity}</div>}

              {/* Marca decorativa curva en esquina inferior izquierda */}
              <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none rounded-bl-sm overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full group-hover:opacity-100 opacity-70 transition-opacity">
                  <path d="M 0 100 L 0 0 Q 0 100 100 100 Z" fill={rarityColors.color} />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </ItemPopover>
    );
  }

  // Clases según el modo (normal/compact)
  const paddingClass = viewMode === "compact" ? "p-1.5" : "p-3";
  const marginBottomClass = viewMode === "compact" ? "mb-1" : "mb-2";
  const cornerSize = viewMode === "compact" ? "w-8 h-8" : "w-12 h-12";

  return (
    <ItemPopover item={item} lang={lang}>
      <div className="w-full aspect-square">
        <Link href={itemUrl} className="h-full w-full group relative flex flex-col justify-end cursor-pointer">
          <div
            className={`card-chrome-border h-full w-full relative flex flex-col justify-end bg-[#0d111d]/50 backdrop-blur-sm ${rarityColors.gradient} border-2 ${rarityColors.border} rounded-lg ${paddingClass} hover:scale-105 transition-all duration-300 ${rarityColors.shadow} overflow-hidden`}
          >
            {/* Marca decorativa curva en esquina inferior izquierda */}
            <div className={`absolute bottom-0 left-0 ${cornerSize} pointer-events-none rounded-bl-sm overflow-hidden`}>
              <svg viewBox="0 0 100 100" className="w-full h-full group-hover:opacity-100 opacity-70 transition-opacity">
                <path d="M 0 100 L 0 0 Q 0 100 100 100 Z" fill={rarityColors.color} />
              </svg>
            </div>

            {/* Quantity badge */}
            {quantity && quantity > 1 && <div className="absolute top-2 right-2 z-10 bg-[#00ffff]/90 text-black font-bold text-xs px-2 py-1 rounded-full">x{quantity}</div>}

            {itemImage && (
              <div className={`relative w-full aspect-square ${marginBottomClass} rounded overflow-hidden`}>
                <Image
                  src={itemImage}
                  alt={itemName || "Item"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  className="object-contain p-1 group-hover:scale-110 transition-transform  "
                  unoptimized
                />
              </div>
            )}
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-gray-200 truncate  relative z-10 ">{itemName || "Unknown Item"}</h3>

              <div className="flex items-center justify-between text-xs relative z-10">
                {item.type && <span className="text-gray-400 truncate flex-1 mr-1">{item.type}</span>}
                {item.rarity && <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${rarityColors.bg} text-white`}>{item.rarity.charAt(0)}</span>}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </ItemPopover>
  );
}
