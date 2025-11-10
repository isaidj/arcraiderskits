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
  // Obtener el texto en inglés o el primero disponible
  let name = "";
  if (typeof text === "string") {
    name = text;
  } else if (typeof text === "object" && text !== null) {
    name = text.en || Object.values(text)[0] || "";
  }

  if (!name) return id;

  // Convertir a minúsculas, remover caracteres especiales y reemplazar espacios con guiones
  const slug = name
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
