"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales, localeNames, isValidLocale, type Locale } from "@/config/i18n";

interface LanguageSelectorProps {
  currentLang: Locale;
  isMobile?: boolean;
}

export default function LanguageSelector({ currentLang, isMobile = false }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageChange = (newLang: Locale) => {
    // Extract the current path without the language prefix
    const pathSegments = pathname.split("/").filter(Boolean);
    let pathWithoutLang = "";

    // Check if first segment is a language code
    if (pathSegments.length > 0 && isValidLocale(pathSegments[0])) {
      // Remove language from path
      pathWithoutLang = "/" + pathSegments.slice(1).join("/");
    } else {
      // No language in current path
      pathWithoutLang = pathname;
    }

    // Ensure path starts with /
    if (!pathWithoutLang.startsWith("/")) {
      pathWithoutLang = "/" + pathWithoutLang;
    }

    // Navigate to the new language path
    router.push(`/${newLang}${pathWithoutLang === "/" ? "" : pathWithoutLang}`);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="px-3 py-2">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Language</div>
        <select
          value={currentLang}
          onChange={(e) => handleLanguageChange(e.target.value as Locale)}
          className="w-full bg-gray-800 text-gray-300 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          {locales.map((locale) => (
            <option key={locale} value={locale}>
              {localeNames[locale]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider"
        aria-label="Select language"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className="hidden lg:inline">{localeNames[currentLang]}</span>
        <span className="lg:hidden">{currentLang.toUpperCase()}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-black/95 border border-red-900/20 rounded-lg shadow-lg overflow-hidden z-50 backdrop-blur-md">
          <div className="max-h-96 overflow-y-auto">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  locale === currentLang ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{localeNames[locale]}</span>
                  {locale === currentLang && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
