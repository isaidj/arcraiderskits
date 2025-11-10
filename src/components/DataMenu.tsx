"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { isValidLocale, defaultLocale, type Locale } from "@/config/i18n";

const menuItems = [
  { name: "Home", path: "/", disabled: false },
  { name: "Items", path: "/items", disabled: false },
  { name: "Quests", path: "/quests", disabled: false },
  { name: "Projects", path: "/projects", disabled: true },
  { name: "Hideout Modules", path: "/hideout", disabled: true },
  { name: "Skill Nodes", path: "/skills", disabled: true },
];

export default function DataMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Extract current language from pathname
  const currentLang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && isValidLocale(segments[0])) {
      return segments[0] as Locale;
    }
    return defaultLocale;
  }, [pathname]);

  // Generate paths with language prefix
  const getLocalizedPath = (path: string) => {
    if (path === "/") {
      // Home path is just the language
      return `/${currentLang}`;
    }
    return `/${currentLang}${path}`;
  };

  // Check if a menu item is active
  const isItemActive = (item: (typeof menuItems)[0]) => {
    const localizedPath = getLocalizedPath(item.path);

    if (item.path === "/") {
      // Home is active only if we're exactly at /{lang} or /
      return pathname === `/${currentLang}` || pathname === "/";
    }

    // For other items, check if pathname starts with the localized path
    return pathname.startsWith(localizedPath);
  };

  return (
    <nav className="fixed top-16 left-0 right-0 z-40 bg-[#110918] backdrop-blur-sm border-b-[0.5px] border-[#646081] shadow-[0_0_20px_rgba(100,96,129,0.6)]">
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center justify-center gap-2 sm:gap-4 py-2">
          {menuItems.map((item) => {
            const localizedPath = getLocalizedPath(item.path);
            const isActive = isItemActive(item);
            return (
              <li key={item.path} className="relative">
                {item.disabled ? (
                  <div className="relative group">
                    <div
                      className="px-3 py-1.5 rounded text-xs sm:text-sm
                      transition-all duration-300 whitespace-nowrap uppercase tracking-wider font-medium
                      border bg-transparent text-gray-600 border-gray-700 cursor-not-allowed opacity-50"
                    >
                      {item.name}
                    </div>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-[#00ffff] text-[#00ffff] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      Coming Soon
                    </span>
                  </div>
                ) : (
                  <Link
                    href={localizedPath}
                    className={`
                      px-3 py-1.5 rounded text-xs sm:text-sm
                      transition-all duration-300 whitespace-nowrap uppercase tracking-wider font-medium
                      border
                      ${isActive ? "bg-[#e5a10f] text-black border-[#e5a10f]" : "bg-transparent text-gray-300 border-gray-600 hover:text-[#e5a10f] hover:border-[#e5a10f]"}
                    `}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between py-2 text-gray-300 hover:text-white transition-colors">
            <span className="text-sm font-medium uppercase tracking-wider">{menuItems.find((item) => isItemActive(item))?.name || "Menu"}</span>
            <svg className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <ul className="absolute left-0 right-0 bg-[#110918] border-t border-[#646081] shadow-lg max-h-[70vh] overflow-y-auto">
              {menuItems.map((item) => {
                const localizedPath = getLocalizedPath(item.path);
                const isActive = isItemActive(item);
                return (
                  <li key={item.path} className="border-b border-gray-800 last:border-b-0">
                    {item.disabled ? (
                      <div className="px-4 py-3 text-gray-600 text-sm uppercase tracking-wider font-medium flex items-center justify-between">
                        <span>{item.name}</span>
                        <span className="text-xs text-[#00ffff]">Coming Soon</span>
                      </div>
                    ) : (
                      <Link
                        href={localizedPath}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 text-sm uppercase tracking-wider font-medium transition-colors ${
                          isActive ? "bg-[#e5a10f] text-black" : "text-gray-300 hover:bg-gray-800/50 hover:text-[#e5a10f]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
