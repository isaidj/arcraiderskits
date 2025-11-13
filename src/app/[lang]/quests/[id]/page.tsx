import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Quest } from "@/components/quests/types";
import { Item } from "@/components/items/types";
import { Locale } from "@/config/i18n";
import { generateSlug } from "@/components/quests/utils";
import QuestDetailView from "@/components/quests/QuestDetailView";
import TrackQuestView from "@/components/TrackQuestView";
import { generateQuestMetadata } from "./metadata";

async function getQuests(): Promise<Quest[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "quests.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading quests:", error);
    return [];
  }
}

async function getItems(): Promise<Item[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "items.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading items:", error);
    return [];
  }
}

// Generate all static params (lang × quest)
export async function generateStaticParams() {
  const quests = await getQuests();
  const params: { lang: string; id: string }[] = [];

  // Solo generar páginas estáticas para idiomas principales durante el build
  // Los demás idiomas se generarán bajo demanda (on-demand ISR)
  const primaryLocales = ["en", "es", "de", "fr", "pt"];

  for (const locale of primaryLocales) {
    for (const quest of quests) {
      const slug = generateSlug(quest.name, quest.id);
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

// Dynamic metadata per language and quest
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const quests = await getQuests();
  const quest = quests.find((q) => generateSlug(q.name, q.id) === id);

  return generateQuestMetadata(quest, lang, id);
}

export default async function QuestPage({ params }: { params: Promise<{ lang: Locale; id: string }> }) {
  const { lang, id } = await params;
  const quests = await getQuests();
  const items = await getItems();

  // Buscar quest por slug
  const quest = quests.find((q) => generateSlug(q.name, q.id) === id);

  if (!quest) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <TrackQuestView questId={quest.id} />
      <div className="container mx-auto max-w-7xl">
        <QuestDetailView quest={quest} allQuests={quests} allItems={items} lang={lang} />
      </div>
    </main>
  );
}
