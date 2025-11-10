import Image from "next/image";
import Link from "next/link";
import { Item } from "@/components/items/types";
import { Locale } from "@/config/i18n";
import { getText, generateSlug } from "@/components/items/utils";
import { getRarityColors } from "@/components/items/rarityColors";

interface QuestItemCardProps {
  item: Item;
  quantity: number;
  lang: Locale;
}

export default function QuestItemCard({ item, quantity, lang }: QuestItemCardProps) {
  const itemName = getText(item.name, lang);
  const itemImage = item.imageFilename || item.image;
  const rarityColors = getRarityColors(item.rarity || "Common");
  const slug = generateSlug(item.name, item.id);

  return (
    <Link
      href={`/${lang}/items/${slug}`}
      className={`card-chrome-border group relative bg-black/50 ${rarityColors.gradient} border-2 ${rarityColors.border} rounded-lg p-3 hover:scale-105 transition-all duration-300 ${rarityColors.shadow} cursor-pointer overflow-hidden block`}
    >
      {/* Decorative corner mark */}
      <div className="absolute bottom-0 left-0 w-10 h-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full group-hover:opacity-100 opacity-70 transition-opacity">
          <path d="M 0 100 L 0 0 Q 0 100 100 100 Z" fill={rarityColors.color} />
        </svg>
      </div>

      {/* Quantity badge */}
      {quantity > 1 && <div className="absolute top-2 right-2 z-10 bg-[#00ffff]/90 text-black font-bold text-xs px-2 py-1 rounded-full">x{quantity}</div>}

      {/* Item Image */}
      {itemImage && (
        <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
          <Image
            src={itemImage}
            alt={itemName || "Item"}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 150px"
            className="object-contain p-1 group-hover:scale-110 transition-transform"
          />
        </div>
      )}

      {/* Item Name */}
      <h3 className="text-sm font-semibold text-gray-200 truncate mb-1 relative z-10">{itemName || "Unknown Item"}</h3>

      {/* Item Info */}
      <div className="flex items-center justify-between text-xs relative z-10">
        {item.type && <span className="text-gray-500 truncate flex-1 mr-1">{item.type}</span>}
        {item.rarity && <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${rarityColors.bg} text-white`}>{item.rarity.charAt(0)}</span>}
      </div>
    </Link>
  );
}
