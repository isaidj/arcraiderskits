"use client";

import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({ value, onChange, placeholder = "Search...", debounceMs = 300 }: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronizar con el valor externo cuando cambia
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce: solo llamar onChange después del delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onChange, value]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = () => {
    setInternalValue("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative group">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        className="w-full px-4 py-3 pl-12 bg-[#0d111d]/50 backdrop-blur-sm border border-[#444855]/90 rounded-4xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#ffffff] transition-colors"
      />
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ffff] pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      {!internalValue && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center gap-1">
          <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-[#444855] bg-[#0d111d]/80 px-2 font-mono text-[10px] font-medium text-gray-500 opacity-100 justify-center">
            <span className="text-sm">⌘</span>K
          </kbd>
        </div>
      )}

      {internalValue && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
