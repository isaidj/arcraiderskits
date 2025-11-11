"use client";

interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortSelector({ value, onChange }: SortSelectorProps) {
  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "rarity-asc", label: "Rarity (↑)" },
    { value: "rarity-desc", label: "Rarity (↓)" },
    { value: "value-asc", label: "Value (↑)" },
    { value: "value-desc", label: "Value (↓)" },
    { value: "weight-asc", label: "Weight (↑)" },
    { value: "weight-desc", label: "Weight (↓)" },
  ];

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm text-gray-400 whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0d111d]/50 backdrop-blur-sm border  text-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00ffff] hover:border-[#00ffff]/50 transition-colors"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
