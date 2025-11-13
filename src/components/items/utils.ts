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

export function generateSlug(text: string | { [key: string]: string }, id: string): string {
  // El ID ya está en formato slug adecuado (snake_case), usarlo directamente
  // Convertir guiones bajos a guiones para mantener consistencia en URLs
  return id.replace(/_/g, "-");
}
