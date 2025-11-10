import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Quest } from "@/components/quests/types";
import { Item } from "@/components/items/types";
import { Locale, locales } from "@/config/i18n";
import { getText, generateSlug } from "@/components/quests/utils";
import QuestDetailView from "@/components/quests/QuestDetailView";

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

  // Buscar quest por slug
  const quest = quests.find((q) => generateSlug(q.name, q.id) === id);

  if (!quest) {
    const notFoundTitles: Record<Locale, string> = {
      en: "Quest Not Found - Arc Raiders Kits",
      es: "Misión No Encontrada - Arc Raiders Kits",
      de: "Quest Nicht Gefunden - Arc Raiders Kits",
      fr: "Quête Non Trouvée - Arc Raiders Kits",
      pt: "Missão Não Encontrada - Arc Raiders Kits",
      pl: "Zadanie Nie Znalezione - Arc Raiders Kits",
      no: "Oppdrag Ikke Funnet - Arc Raiders Kits",
      da: "Quest Ikke Fundet - Arc Raiders Kits",
      it: "Missione Non Trovata - Arc Raiders Kits",
      uk: "Завдання Не Знайдено - Arc Raiders Kits",
      kr: "퀘스트를 찾을 수 없습니다 - Arc Raiders Kits",
      ru: "Квест Не Найден - Arc Raiders Kits",
      "zh-CN": "未找到任务 - Arc Raiders Kits",
      ja: "クエストが見つかりません - Arc Raiders Kits",
      tr: "Görev Bulunamadı - Arc Raiders Kits",
      "zh-TW": "未找到任務 - Arc Raiders Kits",
      sr: "Задатак Није Пронађен - Arc Raiders Kits",
      hr: "Zadatak Nije Pronađen - Arc Raiders Kits",
    };
    return {
      title: notFoundTitles[lang],
    };
  }

  const questName = getText(quest.name, lang);
  const questDescription = getText(quest.description, lang);

  // Create alternates for all languages
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/quests/${id}`;
  });

  return {
    title: `${questName} - ${quest.trader} - Arc Raiders Kits`,
    description:
      questDescription ||
      `Complete ${questName} quest from ${quest.trader}. ${quest.xp ? `Earn ${quest.xp} XP.` : ""} ${quest.objectives ? `${quest.objectives.length} objectives.` : ""}`,
    keywords: ["Arc Raiders", "quest", "mission", questName, quest.trader, "rewards", "objectives"].filter(Boolean),
    alternates: {
      canonical: `/${lang}/quests/${id}`,
      languages,
    },
    openGraph: {
      title: `${questName} - Arc Raiders Kits`,
      description: questDescription || `${quest.trader} quest in Arc Raiders`,
      type: "website",
      locale: lang,
    },
    twitter: {
      card: "summary_large_image",
      title: `${questName} - Arc Raiders Kits`,
      description: questDescription || `${quest.trader} quest in Arc Raiders`,
    },
  };
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
      <div className="container mx-auto max-w-7xl">
        <QuestDetailView quest={quest} allQuests={quests} allItems={items} lang={lang} />
      </div>
    </main>
  );
}
