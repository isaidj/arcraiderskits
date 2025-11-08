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

export function useFilteredItems(items: Item[], searchTerm: string, selectedCategory: string) {
  return useMemo(() => {
    if (searchTerm === "" && selectedCategory === "All") {
      return items;
    }

    const searchLower = searchTerm.toLowerCase();

    return items.filter((item) => {
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
  }, [items, searchTerm, selectedCategory]);
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
