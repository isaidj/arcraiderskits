import Image from "next/image";
import Link from "next/link";
import { Item, RarityColors } from "./types";
import { getText, generateSlug } from "./utils";
import { Locale } from "@/config/i18n";

export type ViewMode = "normal" | "compact";

interface ItemCardProps {
  item: Item;
  lang?: Locale;
  viewMode?: ViewMode;
  rarityColors: RarityColors;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

export default function ItemCard({ item, lang, viewMode = "normal", rarityColors, onMouseEnter, onMouseLeave }: ItemCardProps) {
  const itemName = getText(item.name, lang);
  const itemImage = item.imageFilename || item.image;
  const slug = generateSlug(item.name, item.id);
  const itemUrl = lang ? `/${lang}/items/${slug}` : `/items/${slug}`;

  // Clases según el modo
  const paddingClass = viewMode === "compact" ? "p-1.5" : "p-3";
  const marginBottomClass = viewMode === "compact" ? "mb-1" : "mb-2";
  const cornerSize = viewMode === "compact" ? "w-8 h-8" : "w-12 h-12";

  return (
    <div className="h-full" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Link href={itemUrl} className="h-full group relative flex flex-col justify-end cursor-pointer">
        <div
          className={`card-chrome-border h-full relative flex flex-col justify-end bg-black/50 ${rarityColors.gradient} border-2 ${rarityColors.border} rounded-lg ${paddingClass} hover:scale-105 transition-all duration-300 ${rarityColors.shadow} overflow-hidden`}
        >
          {/* Marca decorativa curva en esquina inferior izquierda */}
          <div className={`absolute bottom-0 left-0 ${cornerSize} pointer-events-none rounded-bl-sm overflow-hidden`}>
            <svg viewBox="0 0 100 100" className="w-full h-full group-hover:opacity-100 opacity-70 transition-opacity">
              <path d="M 0 100 L 0 0 Q 0 100 100 100 Z" fill={rarityColors.color} />
            </svg>
          </div>

          {itemImage && (
            <div className={`relative w-full aspect-square ${marginBottomClass} rounded overflow-hidden`}>
              <Image
                src={itemImage}
                alt={itemName || "Item"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                className="object-contain p-1 group-hover:scale-110 transition-transform"
              />
            </div>
          )}

          <h3 className="text-sm font-semibold text-gray-200 truncate mb-1 relative z-10">{itemName || "Unknown Item"}</h3>

          <div className="flex items-center justify-between text-xs relative z-10">
            {item.type && <span className="text-gray-400 truncate flex-1 mr-1">{item.type}</span>}
            {item.rarity && <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${rarityColors.bg} text-white`}>{item.rarity.charAt(0)}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}
