import type { Metadata } from "next";
import { Locale, locales } from "@/config/i18n";
import TrendingSection from "@/components/TrendingSection";
import AdBanner from "@/components/AdBanner";
import MobileAdBanner from "@/components/MobileAdBanner";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Leer archivos de datos
    const itemsPath = path.join(process.cwd(), "public", "data", "items.json");
    const questsPath = path.join(process.cwd(), "public", "data", "quests.json");

    const [itemsContent, questsContent] = await Promise.all([fs.readFile(itemsPath, "utf8"), fs.readFile(questsPath, "utf8")]);

    const itemsData = JSON.parse(itemsContent);
    const questsData = JSON.parse(questsContent);

    // Intentar obtener de vistas materializadas primero
    let { data: trendingItems } = await supabase.from("trending_items_24h").select("*").limit(12);

    // Si está vacío, calcular directamente de la tabla base
    if (!trendingItems || trendingItems.length === 0) {
      const { data: directItems } = await supabase
        .from("item_views")
        .select("item_id")
        .gte("viewed_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (directItems && directItems.length > 0) {
        // Contar vistas por item_id
        const itemCounts = directItems.reduce((acc: any, curr: any) => {
          acc[curr.item_id] = (acc[curr.item_id] || 0) + 1;
          return acc;
        }, {});

        // Convertir a array y ordenar
        trendingItems = Object.entries(itemCounts)
          .map(([item_id, count]) => ({
            item_id,
            view_count: count as number,
            last_viewed: new Date().toISOString(),
          }))
          .sort((a, b) => b.view_count - a.view_count)
          .slice(0, 12);
      }
    }

    // Hacer lo mismo para quests
    let { data: trendingQuests } = await supabase.from("trending_quests_24h").select("*").limit(12);

    if (!trendingQuests || trendingQuests.length === 0) {
      const { data: directQuests } = await supabase
        .from("quest_views")
        .select("quest_id")
        .gte("viewed_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (directQuests && directQuests.length > 0) {
        const questCounts = directQuests.reduce((acc: any, curr: any) => {
          acc[curr.quest_id] = (acc[curr.quest_id] || 0) + 1;
          return acc;
        }, {});

        trendingQuests = Object.entries(questCounts)
          .map(([quest_id, count]) => ({
            quest_id,
            view_count: count as number,
            last_viewed: new Date().toISOString(),
          }))
          .sort((a, b) => b.view_count - a.view_count)
          .slice(0, 12);
      }
    }

    // Enriquecer los datos
    const enrichedItems = (trendingItems || [])
      .map((item: any) => {
        const itemData = itemsData.find((i: any) => i.id === item.item_id);
        return {
          ...item,
          data: itemData,
        };
      })
      .filter((item) => item.data);

    const enrichedQuests = (trendingQuests || [])
      .map((quest: any) => {
        const questData = questsData.find((q: any) => q.id === quest.quest_id);
        return {
          ...quest,
          data: questData,
        };
      })
      .filter((quest) => quest.data);

    trendingData = {
      period: "24h",
      items: enrichedItems,
      quests: enrichedQuests,
    };
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
