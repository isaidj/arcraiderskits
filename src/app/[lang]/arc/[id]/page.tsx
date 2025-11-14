import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BotDetailView from "@/components/arc/BotDetailView";
import { Bot } from "@/components/arc/types";
import { Locale } from "@/config/i18n";
import { generateSlug } from "@/components/arc/utils";
import { generateBotMetadata } from "./metadata";

async function getBots(): Promise<Bot[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "bots.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading bots:", error);
    return [];
  }
}

async function getItems(): Promise<any[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "items.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading items:", error);
    return [];
  }
}

// Generar todos los parámetros estáticos (lang × bot)
export async function generateStaticParams() {
  const bots = await getBots();
  const params: { lang: string; id: string }[] = [];

  // Solo generar páginas estáticas para idiomas principales durante el build
  const primaryLocales = ["en", "es", "de", "fr", "pt"];

  for (const locale of primaryLocales) {
    for (const bot of bots) {
      const slug = generateSlug(bot.name, bot.id);
      params.push({
        lang: locale,
        id: slug,
      });
    }
  }

  return params;
}

// Configurar generación dinámica para otros idiomas
export const dynamicParams = true;

// Metadata dinámica por idioma y bot
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const bots = await getBots();

  // Buscar bot por slug
  const bot = bots.find((b) => generateSlug(b.name, b.id) === id);

  return generateBotMetadata(bot, lang, id);
}

export default async function BotPage({ params }: { params: Promise<{ lang: Locale; id: string }> }) {
  const { lang, id } = await params;
  const bots = await getBots();
  const items = await getItems();

  // Buscar bot por slug
  const bot = bots.find((b) => generateSlug(b.name, b.id) === id);

  if (!bot) {
    notFound();
  }

  // Encontrar bots relacionados (mismo tipo o nivel de amenaza similar)
  const relatedBots = bots
    .filter((b) => {
      if (b.id === bot.id) return false;
      return b.type === bot.type || b.threat === bot.threat;
    })
    .slice(0, 6);

  return (
    <main className="min-h-screen pt-10 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <BotDetailView bot={bot} relatedBots={relatedBots} allBots={bots} lang={lang} items={items} />
      </div>
    </main>
  );
}
