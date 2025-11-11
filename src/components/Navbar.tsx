"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAds } from "@/contexts/AdsContext";
import { isValidLocale, defaultLocale, type Locale } from "@/config/i18n";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { adsEnabled, toggleAds } = useAds();
  const pathname = usePathname();

  // Extract current language from pathname
  const currentLang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && isValidLocale(segments[0])) {
      return segments[0] as Locale;
    }
    return defaultLocale;
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d111d]/50 backdrop-blur-sm backdrop-blur-md border-b border-red-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${currentLang}`} className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white tracking-tight">ARC RAIDERS</span>
            <span className="text-red-500 font-semibold">KITS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={`/${currentLang}`} className="text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider">
              Home
            </Link>
            <Link
              href="https://arcraiders.wiki/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider"
            >
              Wiki
            </Link>
            <span className="text-gray-600 cursor-not-allowed text-sm font-medium uppercase tracking-wider" title="Coming Soon">
              Tools
            </span>
            <span className="text-gray-600 cursor-not-allowed text-sm font-medium uppercase tracking-wider" title="Coming Soon">
              Guides
            </span>
            <span className="text-gray-600 cursor-not-allowed text-sm font-medium uppercase tracking-wider" title="Coming Soon">
              News
            </span>

            {/* Language Selector */}
            <LanguageSelector currentLang={currentLang} />

            {/* Ads Toggle */}
            <button
              onClick={toggleAds}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider"
              title={adsEnabled ? "Disable ads" : "Enable ads"}
            >
              <div className={`relative w-11 h-6 rounded-full transition-colors ${adsEnabled ? "bg-red-600" : "bg-gray-700"}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-lg ${adsEnabled ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-xs">ADS</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-t border-red-900/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href={`/${currentLang}`}
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md text-base font-medium uppercase tracking-wider transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="https://arcraiders.wiki/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md text-base font-medium uppercase tracking-wider transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Wiki
            </Link>
            <div className="block px-3 py-2 text-gray-600 cursor-not-allowed rounded-md text-base font-medium uppercase tracking-wider" title="Coming Soon">
              Tools
            </div>
            <div className="block px-3 py-2 text-gray-600 cursor-not-allowed rounded-md text-base font-medium uppercase tracking-wider" title="Coming Soon">
              Guides
            </div>
            <div className="block px-3 py-2 text-gray-600 cursor-not-allowed rounded-md text-base font-medium uppercase tracking-wider" title="Coming Soon">
              News
            </div>

            {/* Language Selector (Mobile) */}
            <LanguageSelector currentLang={currentLang} isMobile={true} />

            <button
              onClick={toggleAds}
              className="flex items-center justify-between w-full px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md text-base font-medium uppercase tracking-wider transition-colors"
            >
              <span>ADS</span>
              <div className={`relative w-11 h-6 rounded-full transition-colors ${adsEnabled ? "bg-red-600" : "bg-gray-700"}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-lg ${adsEnabled ? "translate-x-5" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
