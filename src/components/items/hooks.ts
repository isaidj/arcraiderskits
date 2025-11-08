import { useMemo } from "react";
import { Item } from "./types";
import { getText } from "./utils";

// Helper function to get all text values from a multilingual object
function getAllTexts(textObj: any): string {
  if (!textObj) return "";
  if (typeof textObj === "string") return textObj.toLowerCase();
  if (typeof textObj === "object") {
    // Solo concatenar valores que existen
    const values = Object.values(textObj).filter(Boolean);
    return values.join(" ").toLowerCase();
  }
  return "";
}

// Cache for search strings to avoid recalculating
const searchCache = new Map<string, string>();

function getSearchableText(item: Item): string {
  const cacheKey = item.id;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const searchText = `${getAllTexts(item.name)} ${getAllTexts(item.description)} ${item.id}`.toLowerCase();
  searchCache.set(cacheKey, searchText);
  return searchText;
}

export function useFilteredItems(items: Item[], searchTerm: string, selectedCategory: string, sortBy: string = "name-asc") {
  return useMemo(() => {
    let filtered = items;

    // Aplicar filtros
    if (searchTerm !== "" || selectedCategory !== "All") {
      const searchLower = searchTerm.toLowerCase();

      filtered = items.filter((item) => {
        // Primero verificar categoría (más rápido)
        if (selectedCategory !== "All" && item.type !== selectedCategory) {
          return false;
        }

        // Luego verificar búsqueda
        if (searchTerm === "") {
          return true;
        }

        const searchableText = getSearchableText(item);
        return searchableText.includes(searchLower);
      });
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return getText(a.name).localeCompare(getText(b.name));
        case "name-desc":
          return getText(b.name).localeCompare(getText(a.name));
        case "rarity-asc": {
          const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 };
          return (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0) - (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0);
        }
        case "rarity-desc": {
          const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 };
          return (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0);
        }
        case "value-asc":
          return (a.value || 0) - (b.value || 0);
        case "value-desc":
          return (b.value || 0) - (a.value || 0);
        case "weight-asc":
          return (a.weightKg || 0) - (b.weightKg || 0);
        case "weight-desc":
          return (b.weightKg || 0) - (a.weightKg || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [items, searchTerm, selectedCategory, sortBy]);
}

export function useCategories(items: Item[]) {
  return useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => {
      if (item.type) cats.add(item.type);
    });
    return ["All", ...Array.from(cats).sort()];
  }, [items]);
}
