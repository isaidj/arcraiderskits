import { Locale } from "@/config/i18n";
import type { Bot } from "./types";

export function getText(value: string | { [key: string]: string } | undefined, lang?: Locale): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang || "en"] || value.en || Object.values(value)[0] || "";
}

export function generateSlug(name: string | { [key: string]: string }, id: string): string {
  const nameStr = typeof name === "string" ? name : name.en || Object.values(name)[0] || id;
  const slug = nameStr
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug}-${id}`;
}

// Mapeo de IDs de bots a nombres de archivos de imágenes locales
export const getBotImage = (bot: Bot): string => {
  const imageMap: Record<string, string> = {
    arc_surveyor: "arc_surveyor.png",
    bastion: "arc_bastion.png",
    bombardier: "arc_bombardier.png",
    fireball: "arc_fireball.png",
    hornet: "arc_hornet.png",
    leaper: "arc_bison.png",
    matriarch: "arc_matriarch.png",
    pop: "arc_pop.png",
    rocketeer: "arc_rocketeer.png",
    sentinel: "arc_sentinel.png",
    shredder: "arc_shredder.png",
    snitch: "arc_snitch.png",
    spotter: "arc_spotter.webp",
    the_queen: "arc_the_queen.png",
    tick: "arc_tick.png",
    turret: "arc_turret.png",
    wasp: "arc_wasp.png",
    probe: "arc_probe.png",
  };

  const imageName = imageMap[bot.id];
  if (imageName) {
    return `/data/images/bots/${imageName}`;
  }

  // Fallback: intentar usar el ID directamente
  return `/data/images/bots/${bot.id}.png`;
};
