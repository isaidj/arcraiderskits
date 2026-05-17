export function generateSlug(name: string | { [key: string]: string }, id: string): string {
  const nameText = typeof name === "string" ? name : name.en || id;
  return `${nameText.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id}`;
}

export function getLocalizedName(name: string | { [key: string]: string }, lang: string): string {
  if (typeof name === "string") return name;
  return name[lang] || name.en || "";
}
