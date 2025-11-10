import { Locale } from "@/config/i18n";

export function getText(value: string | { [key: string]: string } | undefined, lang?: Locale): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  // Si se proporciona un idioma, intentar usarlo
  if (lang && value[lang]) {
    return value[lang];
  }

  // Fallback a inglés o al primer valor disponible
  return value.en || value[Object.keys(value)[0]] || "";
}
