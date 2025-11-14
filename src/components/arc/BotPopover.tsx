"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bot } from "./types";
import { getText, getBotImage, generateSlug } from "./utils";
import { getThreatColors } from "./threatColors";
import { Locale } from "@/config/i18n";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BotPopoverProps {
  bot: Bot;
  lang?: Locale;
  children: React.ReactNode;
}

export default function BotPopover({ bot, lang = "en", children }: BotPopoverProps) {
  const [open, setOpen] = useState(false);
  const threatColors = getThreatColors(bot.threat || "");

  const labels = {
    en: {
      description: "Description",
      destroyXp: "Destroy XP",
      lootXp: "Loot XP",
      drops: "Drops",
      type: "Type",
      threat: "Threat Level",
    },
    es: {
      description: "Descripción",
      destroyXp: "XP por Destruir",
      lootXp: "XP por Saqueo",
      drops: "Botín",
      type: "Tipo",
      threat: "Nivel de Amenaza",
    },
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  // Convertir nombre de drop a slug para URL
  const dropNameToSlug = (dropName: string): string => {
    return dropName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const getDropUrl = (dropName: string): string => {
    const slug = dropNameToSlug(dropName);
    return lang ? `/${lang}/items/${slug}` : `/items/${slug}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className={`w-96 bg-[#0d111d]/95 border-2 ${threatColors.border} rounded-lg p-4 shadow-2xl backdrop-blur-md`}
        style={{
          boxShadow: `0 0 30px ${threatColors.glow}`,
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Header con imagen y nombre */}
        <div className="flex items-start gap-3 mb-3">
          {bot.image && (
            <div className="relative w-20 h-20 shrink-0 bg-gray-900/50 rounded overflow-hidden border border-gray-700">
              <Image src={getBotImage(bot)} alt={getText(bot.name, lang)} fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-100 mb-2">{getText(bot.name, lang)}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {bot.threat && <span className={`px-2 py-1 rounded text-xs font-bold ${threatColors.bg} text-white`}>{bot.threat}</span>}
              {bot.type && <span className="px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300">{bot.type}</span>}
            </div>
          </div>
        </div>

        {/* Descripción */}
        {bot.description && (
          <div className="mb-4 pb-4 border-b border-gray-700">
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">{t.description}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">{getText(bot.description, lang)}</p>
          </div>
        )}

        {/* XP Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-700">
          <div className="bg-blue-950/30 border border-blue-700/50 rounded p-2">
            <span className="text-[10px] text-blue-400 uppercase block mb-1">{t.destroyXp}</span>
            <span className="text-lg font-bold text-blue-300">{bot.destroyXp}</span>
          </div>
          <div className="bg-purple-950/30 border border-purple-700/50 rounded p-2">
            <span className="text-[10px] text-purple-400 uppercase block mb-1">{t.lootXp}</span>
            <span className="text-lg font-bold text-purple-300">{bot.lootXp}</span>
          </div>
        </div>

        {/* Drops */}
        {bot.drops && bot.drops.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">{t.drops}</h4>
            <div className="flex flex-wrap gap-1.5">
              {bot.drops.map((drop: string, idx: number) => (
                <Link key={idx} href={getDropUrl(drop)} onClick={(e) => e.stopPropagation()}>
                  <span className="px-2 py-1 bg-cyan-900/30 border border-cyan-700/50 rounded text-xs text-cyan-300 font-medium hover:bg-cyan-800/50 hover:border-cyan-600 transition-colors cursor-pointer">
                    {drop.replace(/_/g, " ")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
