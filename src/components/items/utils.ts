export function getText(value: string | { [key: string]: string } | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || value[Object.keys(value)[0]] || "";
}
