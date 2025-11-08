"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Item } from "./items/types";
import SearchBar from "./items/SearchBar";
import CategoryFilter from "./items/CategoryFilter";
import ItemsGrid from "./items/ItemsGrid";
import ItemTooltip from "./items/ItemTooltip";
import { useFilteredItems, useCategories } from "./items/hooks";

interface ItemsFilterProps {
  items: Item[];
}

export default function ItemsFilter({ items }: ItemsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const categories = useCategories(items);

  // Usar los valores de searchParams para el filtrado real
  const actualSearch = searchParams.get("search") || "";
  const actualCategory = searchParams.get("category") || "All";
  const filteredItems = useFilteredItems(items, actualSearch, actualCategory);

  const updateURL = (search: string, category: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "All") params.set("category", category);

    startTransition(() => {
      router.push(`/items?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Actualizar URL después de 300ms
    const timer = setTimeout(() => {
      updateURL(value, selectedCategory);
    }, 300);
    return () => clearTimeout(timer);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURL(searchTerm, category);
  };

  const handleItemHover = (item: Item, position: { x: number; y: number }) => {
    setHoveredItem(item);
    setTooltipPosition(position);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <SearchBar value={searchTerm} onChange={handleSearchChange} />
        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleCategoryChange} />

        {/* Results Counter */}
        <p className="text-sm text-gray-400">
          Mostrando {filteredItems.length} de {items.length} items
          {isPending && <span className="ml-2 text-[#00ffff]">...</span>}
        </p>
      </div>

      {/* Items Grid */}
      <ItemsGrid items={filteredItems} onItemHover={handleItemHover} onItemLeave={handleItemLeave} />

      {/* Tooltip */}
      {hoveredItem && <ItemTooltip item={hoveredItem} position={tooltipPosition} />}
    </div>
  );
}
