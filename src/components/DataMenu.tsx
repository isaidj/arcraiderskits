"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Home", path: "/", disabled: false },
  { name: "Items", path: "/items", disabled: false },
  { name: "Quests", path: "/quests", disabled: true },
  { name: "Projects", path: "/projects", disabled: true },
  { name: "Hideout Modules", path: "/hideout", disabled: true },
  { name: "Skill Nodes", path: "/skills", disabled: true },
];

export default function DataMenu() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-16 left-0 right-0 z-40 bg-[#110918] backdrop-blur-sm border-b-[0.5px] border-[#646081] shadow-[0_0_20px_rgba(100,96,129,0.6)] overflow-visible">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center gap-2 sm:gap-6 overflow-x-auto py-3 overflow-visible">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path} className="relative">
                {item.disabled ? (
                  <div className="relative group">
                    <div
                      className="px-4 py-2 rounded text-sm sm:text-base
                      transition-all duration-300 whitespace-nowrap uppercase tracking-wider font-medium
                      border bg-transparent text-gray-600 border-gray-700 cursor-not-allowed opacity-50"
                    >
                      {item.name}
                    </div>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-[#00ffff] text-[#00ffff] text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      Coming Soon
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`
                      px-4 py-2 rounded text-sm sm:text-base
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
      </div>
    </nav>
  );
}
