// Idiomas soportados en la aplicación
export const locales = ["en", "es", "de", "fr", "pt", "pl", "no", "da", "it", "uk", "kr", "ru", "zh-CN", "ja", "tr", "zh-TW", "sr", "hr"] as const;

export type Locale = (typeof locales)[number];

// Idioma por defecto
export const defaultLocale: Locale = "en";

// Nombres de los idiomas para mostrar en el selector
export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  pt: "Português",
  pl: "Polski",
  no: "Norsk",
  da: "Dansk",
  it: "Italiano",
  uk: "Українська",
  kr: "한국어",
  ru: "Русский",
  "zh-CN": "简体中文",
  ja: "日本語",
  tr: "Türkçe",
  "zh-TW": "繁體中文",
  sr: "Српски",
  hr: "Hrvatski",
};

// Validar si un string es un locale válido
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
