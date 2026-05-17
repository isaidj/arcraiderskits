import Link from "next/link";
import { HideoutModule } from "./types";
import { getLocalizedName, generateSlug } from "./utils";
import { Locale } from "@/config/i18n";

interface HideoutModuleCardProps {
  module: HideoutModule;
  lang: Locale;
}

export default function HideoutModuleCard({ module, lang }: HideoutModuleCardProps) {
  const moduleName = getLocalizedName(module.name, lang);
  const slug = generateSlug(module.name, module.id);
  const moduleUrl = `/${lang}/hideout-modules/${slug}`;

  return (
    <Link href={moduleUrl} className="group block">
      <div className="card-chrome-border h-full w-full relative flex flex-col bg-[#0d111d]/90 border-2 border-[#00ffff]/30 rounded-lg p-4 hover:scale-105 hover:border-[#00ffff] transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none rounded-bl-sm overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full group-hover:opacity-100 opacity-70 transition-opacity">
            <path d="M 0 100 L 0 0 Q 0 100 100 100 Z" fill="#00ffff" />
          </svg>
        </div>

        {/* Module Name */}
        <h3 className="text-xl font-bold text-[#00ffff] mb-3 relative z-10 group-hover:text-white transition-colors">
          {moduleName}
        </h3>

        {/* Max Level Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-[#00ffff]/20 border border-[#00ffff]/50 rounded px-3 py-1">
            <span className="text-gray-300 text-sm">
              Max Level: <span className="text-[#00ffff] font-bold">{module.maxLevel}</span>
            </span>
          </div>
        </div>

        {/* Level Count Info */}
        <div className="text-gray-400 text-sm relative z-10">
          {module.levels.length} {module.levels.length === 1 ? 'upgrade' : 'upgrades'} available
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/0 to-[#00ffff]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
      </div>
    </Link>
  );
}
