import { MultiLangText } from "./types";
import { Locale } from "@/config/i18n";

export function getText(multiLangText: MultiLangText | undefined, language?: Locale): string {
  if (!multiLangText) return "";
  const lang = language || "en";
  return multiLangText[lang] || multiLangText.en || "";
}

export function generateSlug(name: MultiLangText, id: string): string {
  // Obtener el texto en inglés
  const text = name.en || Object.values(name)[0] || "";

  if (!text) return id;

  // Convertir a minúsculas, remover caracteres especiales y reemplazar espacios con guiones
  const slug = text
    .toLowerCase()
    .normalize("NFD") // Normalizar caracteres unicode
    .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos
    .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/-+/g, "-"); // Remover guiones duplicados

  // Agregar el ID al final para garantizar unicidad
  return `${slug}-${id}`;
}

// Trader color mapping
export const traderColors: Record<string, string> = {
  Shani: "text-cyan-400",
  Celeste: "text-purple-400",
  "Tian Wen": "text-amber-400",
  Apollo: "text-green-400",
};

// Get trader badge color
export const getTraderBadgeColor = (trader: string): string => {
  const colors: Record<string, string> = {
    Shani: "bg-cyan-500/20 border-cyan-500/50 text-cyan-400",
    Celeste: "bg-purple-500/20 border-purple-500/50 text-purple-400",
    "Tian Wen": "bg-amber-500/20 border-amber-500/50 text-amber-400",
    Apollo: "bg-green-500/20 border-green-500/50 text-green-400",
  };
  return colors[trader] || "bg-gray-500/20 border-gray-500/50 text-gray-400";
};
