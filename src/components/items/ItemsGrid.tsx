"use client";

import { Item } from "./types";
import ItemCard from "./ItemCard";
import { getRarityColors } from "./rarityColors";

interface ItemsGridProps {
  items: Item[];
  onItemHover: (item: Item, position: { x: number; y: number }) => void;
  onItemLeave: () => void;
}

export default function ItemsGrid({ items, onItemHover, onItemLeave }: ItemsGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl">No se encontraron items.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {items.map((item, index) => {
        const rarityColors = getRarityColors(item.rarity || "");

        return (
          <ItemCard
            key={`${item.id}-${index}`}
            item={item}
            rarityColors={rarityColors}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onItemHover(item, {
                x: rect.left + rect.width / 2,
                y: rect.top,
              });
            }}
            onMouseLeave={onItemLeave}
          />
        );
      })}
    </div>
  );
}
