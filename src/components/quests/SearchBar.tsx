"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search quests..." }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-12 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ffff] transition-colors"
      />
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ffff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {value && (
        <button onClick={() => onChange("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors" aria-label="Clear search">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
