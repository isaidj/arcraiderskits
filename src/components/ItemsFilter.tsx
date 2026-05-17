"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Item } from "./items/types";
import { Locale } from "@/config/i18n";
import { SvgGridBig, SvgGridSmall } from "@/assets/icons/index";

import CategoryFilter from "./items/CategoryFilter";
import SortSelector from "./items/SortSelector";
import ItemsGrid, { ViewMode } from "./items/ItemsGrid";
import { useFilteredItems, useCategories } from "./items/hooks";
import SearchBar from "./SearchBar";

interface ItemsFilterProps {
  items: Item[];
  lang: Locale;
}

export default function ItemsFilter({ items, lang }: ItemsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("normal");

  const categories = useCategories(items);

  // Usar los valores de searchParams para el filtrado real
  const actualSearch = searchParams.get("search") || "";
  const actualCategory = searchParams.get("category") || "All";
  const actualSort = searchParams.get("sort") || "name-asc";
  const filteredItems = useFilteredItems(items, actualSearch, actualCategory, actualSort, lang);

  const updateURL = (search: string, category: string, sort: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "All") params.set("category", category);
    if (sort && sort !== "name-asc") params.set("sort", sort);

    startTransition(() => {
      router.push(`/${lang}/items?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURL(value, selectedCategory, sortBy);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURL(searchTerm, category, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateURL(searchTerm, selectedCategory, sort);
  };

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col  sm:flex-row items-center gap-4">
          <div className="flex-1">
            <SearchBar value={searchTerm} onChange={handleSearchChange} />
          </div>
          <div className="flex gap-2">
            <SortSelector value={sortBy} onChange={handleSortChange} />

            {/* View Mode Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700 h-10">
              <button
                onClick={() => setViewMode("normal")}
                className={`px-2 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00ffff] focus:outline-none ${
                  viewMode === "normal" ? "bg-gray-100 text-gray-700" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
                title={lang === "es" ? "Vista normal" : "Normal view"}
                aria-label={lang === "es" ? "Vista normal" : "Normal view"}
                aria-pressed={viewMode === "normal"}
              >
                <SvgGridBig className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`px-2 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00ffff] focus:outline-none ${
                  viewMode === "compact" ? "bg-gray-100 text-gray-700" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
                title={lang === "es" ? "Vista compacta" : "Compact view"}
                aria-label={lang === "es" ? "Vista compacta" : "Compact view"}
                aria-pressed={viewMode === "compact"}
              >
                <SvgGridSmall className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={handleCategoryChange} />

        {/* Results Counter */}
        <p className="text-sm text-gray-400">
          Showing {filteredItems.length} of {items.length} items
          {isPending && <span className="ml-2 text-[#00ffff]">...</span>}
        </p>
      </div>

      {/* Items Grid */}
      <ItemsGrid items={filteredItems} lang={lang} viewMode={viewMode} />
    </div>
  );
}
