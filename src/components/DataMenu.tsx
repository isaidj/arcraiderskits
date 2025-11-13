"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { isValidLocale, defaultLocale, type Locale } from "@/config/i18n";
import { menuTranslations } from "./DataMenu/translations";

type MenuItemKey = "home" | "items" | "quests" | "projects" | "hideoutModules" | "skillNodes" | "expeditions";

const menuItems: Array<{ key: MenuItemKey; path: string; disabled: boolean }> = [
  { key: "home", path: "/", disabled: false },
  { key: "items", path: "/items", disabled: false },
  { key: "quests", path: "/quests", disabled: false },
  { key: "expeditions", path: "/expeditions", disabled: false },
  // { key: "projects", path: "/projects", disabled: true },
  { key: "hideoutModules", path: "/hideout", disabled: true },
  // { key: "skillNodes", path: "/skills", disabled: true },
];

export default function DataMenu() {
  const pathname = usePathname();

  // Extract current language from pathname
  const currentLang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && isValidLocale(segments[0])) {
      return segments[0] as Locale;
    }
    return defaultLocale;
  }, [pathname]);

  // Get translations for current language
  const t = menuTranslations[currentLang];

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
                      {t[item.key]}
                    </div>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-[#00ffff] text-[#00ffff] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {t.comingSoon}
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
                    {t[item.key]}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu - Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <ul className="flex items-center gap-2 py-2 min-w-max px-2">
            {menuItems.map((item) => {
              const localizedPath = getLocalizedPath(item.path);
              const isActive = isItemActive(item);
              return (
                <li key={item.path} className="relative shrink-0">
                  {item.disabled ? (
                    <div className="relative group">
                      <div
                        className="px-3 py-1.5 rounded text-xs
                        transition-all duration-300 whitespace-nowrap uppercase tracking-wider font-medium
                        border bg-transparent text-gray-600 border-gray-700 cursor-not-allowed opacity-50"
                      >
                        {t[item.key]}
                      </div>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-[#00ffff] text-[#00ffff] text-xs px-2 py-1 rounded opacity-0 group-active:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                        {t.comingSoon}
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={localizedPath}
                      className={`
                        px-3 py-1.5 rounded text-xs
                        transition-all duration-300 whitespace-nowrap uppercase tracking-wider font-medium
                        border
                        ${isActive ? "bg-[#e5a10f] text-black border-[#e5a10f]" : "bg-transparent text-gray-300 border-gray-600 hover:text-[#e5a10f] hover:border-[#e5a10f]"}
                      `}
                    >
                      {t[item.key]}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
