"use client";

import { useState } from "react";
import Image from "next/image";
import { Item } from "./types";
import { getText } from "./utils";
import { getRarityColors } from "./rarityColors";
import { translateLocations } from "./locationTranslations";
import { Locale } from "@/config/i18n";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ItemPopoverProps {
  item: Item;
  lang?: Locale;
  children: React.ReactNode;
}

export default function ItemPopover({ item, lang = "en", children }: ItemPopoverProps) {
  const [open, setOpen] = useState(false);
  const rarityColors = getRarityColors(item.rarity || "");

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
        className={`w-80 bg-[#0d111d]/50 border-2 ${rarityColors.border}  rounded-lg p-4 shadow-2xl backdrop-blur-sm`}
        style={{
          boxShadow: `0 0 20px ${rarityColors.glow}`,
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Header con imagen y nombre */}
        <div className="flex items-start gap-3 mb-3">
          {(item.imageFilename || item.image) && (
            <div className="relative w-16 h-16 shrink-0 bg-gray-900 rounded overflow-hidden">
              <Image src={item.imageFilename || item.image || ""} alt={getText(item.name, lang)} fill className="object-contain p-1" unoptimized />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-100 mb-1">{getText(item.name, lang)}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {item.rarity && <span className={`px-2 py-0.5 rounded text-xs font-medium ${rarityColors.bg} text-white`}>{item.rarity}</span>}
              {item.type && <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">{item.type}</span>}
            </div>
          </div>
        </div>

        {/* Descripción */}
        {item.description && (
          <div className="mb-3 pb-3 border-b border-gray-700">
            <p className="text-sm text-gray-300 leading-relaxed">{getText(item.description, lang)}</p>
          </div>
        )}

        {/* Stats Grid - Compacto con iconos */}
        <div className="flex gap-3 mb-3 text-xs">
          {item.value !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-500" title={lang === "es" ? "Valor" : "Value"}>
                💰
              </span>
              <span className="font-semibold text-green-400">{item.value}</span>
            </div>
          )}
          {item.weightKg !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400" title={lang === "es" ? "Peso" : "Weight"}>
                ⚖️
              </span>
              <span className="font-semibold text-gray-200">{item.weightKg}kg</span>
            </div>
          )}
          {item.stackSize !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="text-blue-400" title={lang === "es" ? "Pila" : "Stack"}>
                📦
              </span>
              <span className="font-semibold text-gray-200">{item.stackSize}</span>
            </div>
          )}
        </div>

        {/* Location Tags */}
        {item.foundIn && (
          <div className="mb-3 pb-3 border-b border-gray-700">
            <span className="text-[10px] text-gray-500 uppercase block mb-1.5">{lang === "es" ? "Encontrado en" : "Found In"}</span>
            <div className="flex flex-wrap gap-1.5">
              {item.foundIn.split(",").map((location: string, idx: number) => (
                <span key={idx} className="px-2 py-0.5 bg-cyan-900/30 border border-cyan-700/50 rounded text-xs text-cyan-400 font-medium">
                  {translateLocations(location.trim(), lang)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Effects */}
        {item.effects && Object.keys(item.effects).length > 0 && (
          <div className="mb-3 pb-3 ">
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">{lang === "es" ? "Efectos" : "Effects"}</h4>
            <div className="space-y-1">
              {Object.entries(item.effects).map(([key, effect]: [string, any]) => (
                <div key={key} className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{typeof effect === "string" ? effect : getText(effect, lang)}</span>
                  {typeof effect === "object" && effect?.value && <span className="text-[#00ffff] font-medium">{effect.value}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
