"use client";

import Image from "next/image";
import Link from "next/link";
import { Item, RarityColors } from "./types";
import { getText } from "./utils";

interface ItemCardProps {
  item: Item;
  rarityColors: RarityColors;
  onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave: () => void;
}

export default function ItemCard({ item, rarityColors, onMouseEnter, onMouseLeave }: ItemCardProps) {
  const itemName = getText(item.name);
  const itemImage = item.imageFilename || item.image;

  return (
    <Link
      href={`/items/${item.id}`}
      className={`group relative bg-black/50 ${rarityColors.gradient} border-2 ${rarityColors.border} rounded-lg p-3 hover:scale-105 transition-all duration-300 ${rarityColors.shadow} cursor-pointer overflow-hidden block`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Marca decorativa curva en esquina inferior izquierda */}
      <div className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full group-hover:opacity-100 opacity-70 transition-opacity">
          <path d="M 0 100 L 0 0 Q 0 100 100 100 Z" fill={rarityColors.color} />
        </svg>
      </div>

      {itemImage && (
        <div className="relative w-full aspect-square mb-2 rounded overflow-hidden">
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
        {item.type && <span className="text-gray-500 truncate flex-1 mr-1">{item.type}</span>}
        {item.rarity && <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${rarityColors.bg} text-white`}>{item.rarity.charAt(0)}</span>}
      </div>
    </Link>
  );
}
