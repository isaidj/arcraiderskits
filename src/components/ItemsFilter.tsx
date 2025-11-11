"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Item } from "./items/types";
import { Locale } from "@/config/i18n";

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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar value={searchTerm} onChange={handleSearchChange} />
          </div>
          <div className="flex gap-2">
            <SortSelector value={sortBy} onChange={handleSortChange} />

            {/* View Mode Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setViewMode("normal")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === "normal" ? "bg-[#00ffff] text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                title={lang === "es" ? "Vista normal" : "Normal view"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                  <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                  <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === "compact" ? "bg-[#00ffff] text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                title={lang === "es" ? "Vista compacta" : "Compact view"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="4" height="4" strokeWidth="2" />
                  <rect x="10" y="3" width="4" height="4" strokeWidth="2" />
                  <rect x="17" y="3" width="4" height="4" strokeWidth="2" />
                  <rect x="3" y="10" width="4" height="4" strokeWidth="2" />
                  <rect x="10" y="10" width="4" height="4" strokeWidth="2" />
                  <rect x="17" y="10" width="4" height="4" strokeWidth="2" />
                  <rect x="3" y="17" width="4" height="4" strokeWidth="2" />
                  <rect x="10" y="17" width="4" height="4" strokeWidth="2" />
                  <rect x="17" y="17" width="4" height="4" strokeWidth="2" />
                </svg>
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
