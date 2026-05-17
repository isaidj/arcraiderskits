"use client";

import { useState, useEffect } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const visibleCount = 6; // Número de categorías visibles inicialmente en mobile

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const hasMore = categories.length > visibleCount;
  const displayedCategories = isMobile && !isExpanded && hasMore ? categories.slice(0, visibleCount) : categories;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {displayedCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            aria-pressed={selectedCategory === category}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00ffff] focus-visible:outline-none ${
              selectedCategory === category
                ? "bg-gray-100 text-gray-700"
                : "bg-[#2a2d3c]/50 card-chrome-border backdrop-blur-sm text-gray-300 hover:border-[#00ffff]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isMobile && hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#0d111d]/50 backdrop-blur-sm text-gray-300 border border-gray-700 hover:border-[#00ffff]/50 transition-all focus-visible:ring-2 focus-visible:ring-[#00ffff] focus-visible:outline-none"
        >
          <span>{isExpanded ? "Show less" : `Show more (${categories.length - visibleCount})`}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
