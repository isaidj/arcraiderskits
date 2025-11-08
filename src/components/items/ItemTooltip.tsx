"use client";

import Image from "next/image";
import { Item } from "./types";
import { getText } from "./utils";
import { getRarityColors } from "./rarityColors";

interface ItemTooltipProps {
  item: Item;
  position: { x: number; y: number };
}

export default function ItemTooltip({ item, position }: ItemTooltipProps) {
  const rarityColors = getRarityColors(item.rarity || "");

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%) translateY(-10px)",
      }}
    >
      <div
        className={`bg-black/95 border-2 ${rarityColors.border} rounded-lg p-4 shadow-2xl max-w-md backdrop-blur-sm`}
        style={{
          boxShadow: `0 0 20px ${rarityColors.glow}`,
        }}
      >
        {/* Header con imagen y nombre */}
        <div className="flex items-start gap-3 mb-3">
          {(item.imageFilename || item.image) && (
            <div className="relative w-16 h-16 shrink-0 bg-gray-900 rounded overflow-hidden">
              <Image src={item.imageFilename || item.image || ""} alt={getText(item.name)} fill className="object-contain p-1" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-100 mb-1">{getText(item.name)}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {item.rarity && <span className={`px-2 py-0.5 rounded text-xs font-medium ${rarityColors.bg} text-white`}>{item.rarity}</span>}
              {item.type && <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">{item.type}</span>}
            </div>
          </div>
        </div>

        {/* Descripción */}
        {item.description && (
          <div className="mb-3 pb-3 border-b border-gray-700">
            <p className="text-sm text-gray-300 leading-relaxed">{getText(item.description)}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {item.value !== undefined && (
            <div className="bg-gray-900/50 rounded px-2 py-1.5">
              <span className="text-[10px] text-gray-500 uppercase">Valor</span>
              <p className="text-sm font-semibold text-green-400">{item.value}</p>
            </div>
          )}
          {item.weightKg !== undefined && (
            <div className="bg-gray-900/50 rounded px-2 py-1.5">
              <span className="text-[10px] text-gray-500 uppercase">Peso</span>
              <p className="text-sm font-semibold text-gray-200">{item.weightKg} kg</p>
            </div>
          )}
          {item.stackSize !== undefined && (
            <div className="bg-gray-900/50 rounded px-2 py-1.5">
              <span className="text-[10px] text-gray-500 uppercase">Stack</span>
              <p className="text-sm font-semibold text-gray-200">{item.stackSize}</p>
            </div>
          )}
        </div>

        {/* Location Tags */}
        {item.foundIn && (
          <div className="mb-3 pb-3 border-b border-gray-700">
            <span className="text-[10px] text-gray-500 uppercase block mb-1.5">Encontrado en</span>
            <div className="flex flex-wrap gap-1.5">
              {item.foundIn.split(",").map((location: string, idx: number) => (
                <span key={idx} className="px-2 py-0.5 bg-cyan-900/30 border border-cyan-700/50 rounded text-xs text-cyan-400 font-medium">
                  {location.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Effects */}
        {item.effects && Object.keys(item.effects).length > 0 && (
          <div className="mb-3 pb-3 border-b border-gray-700">
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Efectos</h4>
            <div className="space-y-1">
              {Object.entries(item.effects).map(([key, effect]: [string, any]) => (
                <div key={key} className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{getText(effect)}</span>
                  {effect.value && <span className="text-[#00ffff] font-medium">{effect.value}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="space-y-1 text-xs">
          {item.category && (
            <div className="flex justify-between">
              <span className="text-gray-500">Categoría:</span>
              <span className="text-gray-300">{item.category}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">ID:</span>
            <span className="text-gray-400 font-mono text-[10px]">{item.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
