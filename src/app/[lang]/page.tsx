import type { Metadata } from "next";
import { Locale, locales } from "@/config/i18n";
import TrendingSection from "@/components/TrendingSection";
import AdBanner from "@/components/AdBanner";
import MobileAdBanner from "@/components/MobileAdBanner";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Revalidate trending data every 5 minutes
export const revalidate = 300;

// Generate static params for all languages
export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale,
  }));
}

// Metadata per language
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Locale, string> = {
    en: "Arc Raiders Kits - Items, Quests & Database",
    es: "Arc Raiders Kits - Objetos, Misiones y Base de Datos",
    de: "Arc Raiders Kits - Gegenstände, Quests & Datenbank",
    fr: "Arc Raiders Kits - Objets, Quêtes & Base de Données",
    pt: "Arc Raiders Kits - Itens, Missões & Base de Dados",
    pl: "Arc Raiders Kits - Przedmioty, Zadania i Baza Danych",
    no: "Arc Raiders Kits - Gjenstander, Oppdrag & Database",
    da: "Arc Raiders Kits - Genstande, Quests & Database",
    it: "Arc Raiders Kits - Oggetti, Missioni & Database",
    uk: "Arc Raiders Kits - Предмети, Завдання та База Даних",
    kr: "Arc Raiders Kits - 아이템, 퀘스트 및 데이터베이스",
    ru: "Arc Raiders Kits - Предметы, Квесты и База Данных",
    "zh-CN": "Arc Raiders Kits - 物品、任务和数据库",
    ja: "Arc Raiders Kits - アイテム、クエスト、データベース",
    tr: "Arc Raiders Kits - Eşyalar, Görevler ve Veritabanı",
    "zh-TW": "Arc Raiders Kits - 物品、任務和資料庫",
    sr: "Arc Raiders Kits - Предмети, Задаци и База Података",
    hr: "Arc Raiders Kits - Predmeti, Zadaci i Baza Podataka",
  };

  const descriptions: Record<Locale, string> = {
    en: "Complete database for Arc Raiders game. Browse items, quests, hideout modules, skill nodes and more. Interactive tools and countdown timers.",
    es: "Base de datos completa del juego Arc Raiders. Explora objetos, misiones, módulos de refugio, nodos de habilidades y más. Herramientas interactivas y temporizadores.",
    de: "Vollständige Datenbank für Arc Raiders. Durchsuchen Sie Gegenstände, Quests, Hideout-Module, Skill-Knoten und mehr. Interaktive Tools und Countdown-Timer.",
    fr: "Base de données complète pour Arc Raiders. Parcourez les objets, quêtes, modules de refuge, nœuds de compétences et plus. Outils interactifs et compte à rebours.",
    pt: "Base de dados completa para Arc Raiders. Navegue por itens, missões, módulos de refúgio, nós de habilidades e mais. Ferramentas interativas e temporizadores.",
    pl: "Kompletna baza danych dla Arc Raiders. Przeglądaj przedmioty, zadania, moduły kryjówki, węzły umiejętności i więcej. Interaktywne narzędzia i liczniki.",
    no: "Fullstendig database for Arc Raiders. Bla gjennom gjenstander, oppdrag, skjulested-moduler, ferdighetsnoder og mer. Interaktive verktøy og nedtellinger.",
    da: "Komplet database til Arc Raiders. Gennemse genstande, quests, gemmestedsmoduler, færdighedsknuder og mere. Interaktive værktøjer og nedtællinger.",
    it: "Database completo per Arc Raiders. Sfoglia oggetti, missioni, moduli rifugio, nodi abilità e altro. Strumenti interattivi e timer conto alla rovescia.",
    uk: "Повна база даних для Arc Raiders. Переглядайте предмети, завдання, модулі притулку, вузли навичок та інше. Інтерактивні інструменти та таймери зворотного відліку.",
    kr: "Arc Raiders 완전한 데이터베이스. 아이템, 퀘스트, 은신처 모듈, 스킬 노드 등을 탐색하세요. 대화형 도구 및 카운트다운 타이머.",
    ru: "Полная база данных для Arc Raiders. Просматривайте предметы, квесты, модули убежища, узлы навыков и многое другое. Интерактивные инструменты и таймеры обратного отсчета.",
    "zh-CN": "Arc Raiders 完整数据库。浏览物品、任务、藏身处模块、技能节点等。交互式工具和倒计时器。",
    ja: "Arc Raiders の完全なデータベース。アイテム、クエスト、ハイドアウトモジュール、スキルノードなどを閲覧できます。インタラクティブなツールとカウントダウンタイマー。",
    tr: "Arc Raiders için eksiksiz veritabanı. Eşyalar, görevler, sığınak modülleri, yetenek düğümleri ve daha fazlasına göz atın. Etkileşimli araçlar ve geri sayım sayaçları.",
    "zh-TW": "Arc Raiders 完整資料庫。瀏覽物品、任務、藏身處模組、技能節點等。互動式工具和倒數計時器。",
    sr: "Потпуна база података за Arc Raiders. Прегледајте предмете, задатке, модуле скровишта, чворове вештина и више. Интерактивни алати и одбројавање.",
    hr: "Potpuna baza podataka za Arc Raiders. Pregledajte predmete, zadatke, module skloništa, čvorove vještina i više. Interaktivni alati i odbrojavanje.",
  };

  // Create alternates for all languages
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}`;
  });

  return {
    title: titles[lang],
    description: descriptions[lang],
    keywords: ["Arc Raiders", "game database", "items", "quests", "tools", "countdown", "wiki", "hideout", "skills"],
    alternates: {
      canonical: `/${lang}`,
      languages,
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      type: "website",
      locale: lang,
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang],
      description: descriptions[lang],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;

  // Fetch trending data from server
  let trendingData: any = { period: "24h", items: [], quests: [] };

  try {
    // Leer archivos de datos
    const itemsPath = path.join(process.cwd(), "public", "data", "items.json");
    const questsPath = path.join(process.cwd(), "public", "data", "quests.json");

    const [itemsContent, questsContent] = await Promise.all([fs.readFile(itemsPath, "utf8"), fs.readFile(questsPath, "utf8")]);

    const itemsData = JSON.parse(itemsContent);
    const questsData = JSON.parse(questsContent);

    // Si Supabase está configurado, obtener datos de trending
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Obtener trending items con ranking actual
      let { data: trendingItems } = await supabase.from("trending_items_24h_ranked").select("*").limit(12);

      // Fallback a vista simple si la ranked no existe
      if (!trendingItems || trendingItems.length === 0) {
        const { data: simpleItems } = await supabase.from("trending_items_24h").select("*").limit(12);
        trendingItems = simpleItems;
      }

      // Obtener rankings anteriores para comparar
      const { data: previousItems } = await supabase.from("trending_items_previous_24h_ranked").select("*");
      const previousItemsMap = new Map((previousItems || []).map((item: any) => [item.item_id, item.previous_rank]));

      // Obtener trending quests con ranking actual
      let { data: trendingQuests } = await supabase.from("trending_quests_24h_ranked").select("*").limit(12);

      // Fallback a vista simple si la ranked no existe
      if (!trendingQuests || trendingQuests.length === 0) {
        const { data: simpleQuests } = await supabase.from("trending_quests_24h").select("*").limit(12);
        trendingQuests = simpleQuests;
      }

      // Obtener rankings anteriores para quests
      const { data: previousQuests } = await supabase.from("trending_quests_previous_24h_ranked").select("*");
      const previousQuestsMap = new Map((previousQuests || []).map((quest: any) => [quest.quest_id, quest.previous_rank]));

      // Función para calcular dirección de tendencia
      const getTrendDirection = (currentRank: number | undefined, previousRank: number | null): { direction: "up" | "down" | "same" | "new"; change: number } => {
        if (previousRank === null || previousRank === undefined) {
          return { direction: "new", change: 0 };
        }
        const current = currentRank || 999;
        const change = previousRank - current;
        if (change > 0) {
          return { direction: "up", change };
        } else if (change < 0) {
          return { direction: "down", change };
        }
        return { direction: "same", change: 0 };
      };

      // Enriquecer los datos de items
      const enrichedItems = (trendingItems || [])
        .map((item: any, index: number) => {
          const itemData = itemsData.find((i: any) => i.id === item.item_id);
          const previousRank = previousItemsMap.get(item.item_id) || null;
          const currentRank = item.current_rank || index + 1;
          const { direction, change } = getTrendDirection(currentRank, previousRank);
          return {
            ...item,
            current_rank: currentRank,
            previous_rank: previousRank,
            trend_direction: direction,
            rank_change: change,
            data: itemData,
          };
        })
        .filter((item) => item.data);

      // Enriquecer los datos de quests
      const enrichedQuests = (trendingQuests || [])
        .map((quest: any, index: number) => {
          const questData = questsData.find((q: any) => q.id === quest.quest_id);
          const previousRank = previousQuestsMap.get(quest.quest_id) || null;
          const currentRank = quest.current_rank || index + 1;
          const { direction, change } = getTrendDirection(currentRank, previousRank);
          return {
            ...quest,
            current_rank: currentRank,
            previous_rank: previousRank,
            trend_direction: direction,
            rank_change: change,
            data: questData,
          };
        })
        .filter((quest) => quest.data);

      trendingData = {
        period: "24h",
        items: enrichedItems,
        quests: enrichedQuests,
      };
    } else {
      // Fallback: usar items y quests aleatorios del JSON local cuando no hay Supabase
      console.log("Supabase not configured, using fallback data for trending");

      // Seleccionar items aleatorios
      const shuffledItems = [...itemsData].sort(() => Math.random() - 0.5).slice(0, 12);
      const shuffledQuests = [...questsData].sort(() => Math.random() - 0.5).slice(0, 12);

      const fallbackItems = shuffledItems.map((item: any, index: number) => ({
        item_id: item.id,
        view_count: Math.floor(Math.random() * 100) + 10,
        last_viewed: new Date().toISOString(),
        current_rank: index + 1,
        previous_rank: null,
        trend_direction: "new" as const,
        rank_change: 0,
        data: item,
      }));

      const fallbackQuests = shuffledQuests.map((quest: any, index: number) => ({
        quest_id: quest.id,
        view_count: Math.floor(Math.random() * 50) + 5,
        last_viewed: new Date().toISOString(),
        current_rank: index + 1,
        previous_rank: null,
        trend_direction: "new" as const,
        rank_change: 0,
        data: quest,
      }));

      trendingData = {
        period: "24h",
        items: fallbackItems,
        quests: fallbackQuests,
      };
    }
  } catch (error) {
    console.error("Error fetching trending data:", error);
  }

  return (
    <>
      <AdBanner position="left" />
      <AdBanner position="right" />
      <TrendingSection lang={lang} trendingData={trendingData} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-700/10 rounded-full blur-[120px]" style={{ zIndex: -15 }} />
      <MobileAdBanner />
    </>
  );
}
