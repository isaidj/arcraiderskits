import { Item } from "./types";
import ItemCard from "./ItemCard";
import { getRarityColors } from "./rarityColors";
import { Locale } from "@/config/i18n";

export type ViewMode = "normal" | "compact";

interface ItemsGridProps {
  items: Item[];
  lang?: Locale;
  viewMode?: ViewMode;
  onItemHover: (item: Item, position: { x: number; y: number }) => void;
  onItemLeave: () => void;
}

export default function ItemsGrid({ items, lang, viewMode = "normal", onItemHover, onItemLeave }: ItemsGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl">No se encontraron items.</p>
      </div>
    );
  }

  // Configuración de grid según el modo
  const gridClasses =
    viewMode === "compact"
      ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2"
      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3";

  return (
    <div className={gridClasses}>
      {items.map((item, index) => {
        const rarityColors = getRarityColors(item.rarity || "");

        return (
          <ItemCard
            key={`${item.id}-${index}`}
            item={item}
            lang={lang}
            viewMode={viewMode}
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
