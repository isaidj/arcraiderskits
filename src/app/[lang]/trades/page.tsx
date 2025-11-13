import { promises as fs } from "fs";
import path from "path";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Locale, locales } from "@/config/i18n";
import TradesFilter from "@/components/trades/TradesFilter";

interface Trade {
  trader: string;
  itemId: string;
  quantity: number;
  cost: {
    itemId: string;
    quantity: number;
  };
  dailyLimit?: number | null;
}

async function getTrades(): Promise<Trade[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "trades.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading trades:", error);
    return [];
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Locale, string> = {
    en: "Trades - Arc Raiders Kits",
    es: "Intercambios - Arc Raiders Kits",
    de: "Handel - Arc Raiders Kits",
    fr: "Échanges - Arc Raiders Kits",
    pt: "Trocas - Arc Raiders Kits",
    pl: "Wymiana - Arc Raiders Kits",
    no: "Handel - Arc Raiders Kits",
    da: "Handel - Arc Raiders Kits",
    it: "Scambi - Arc Raiders Kits",
    uk: "Торгівля - Arc Raiders Kits",
    kr: "거래 - Arc Raiders Kits",
    ru: "Торговля - Arc Raiders Kits",
    "zh-CN": "交易 - Arc Raiders Kits",
    ja: "取引 - Arc Raiders Kits",
    tr: "Ticaret - Arc Raiders Kits",
    "zh-TW": "交易 - Arc Raiders Kits",
    sr: "Трговина - Arc Raiders Kits",
    hr: "Trgovina - Arc Raiders Kits",
  };

  const descriptions: Record<Locale, string> = {
    en: "Browse all trader exchanges in Arc Raiders. Find the best deals and plan your trades.",
    es: "Explora todos los intercambios de comerciantes en Arc Raiders. Encuentra las mejores ofertas y planifica tus intercambios.",
    de: "Durchsuchen Sie alle Händler-Tauschgeschäfte in Arc Raiders. Finden Sie die besten Angebote und planen Sie Ihre Geschäfte.",
    fr: "Parcourez tous les échanges de commerçants dans Arc Raiders. Trouvez les meilleures offres et planifiez vos échanges.",
    pt: "Navegue por todas as trocas de comerciantes em Arc Raiders. Encontre as melhores ofertas e planeje suas trocas.",
    pl: "Przeglądaj wszystkie wymiany handlarzy w Arc Raiders. Znajdź najlepsze oferty i zaplanuj swoje wymiany.",
    no: "Bla gjennom alle handelsbytte i Arc Raiders. Finn de beste tilbudene og planlegg dine handler.",
    da: "Gennemse alle handlerbytte i Arc Raiders. Find de bedste tilbud og planlæg dine handler.",
    it: "Sfoglia tutti gli scambi dei mercanti in Arc Raiders. Trova le migliori offerte e pianifica i tuoi scambi.",
    uk: "Переглядайте всі обміни торговців у Arc Raiders. Знайдіть найкращі пропозиції та плануйте свої обміни.",
    kr: "Arc Raiders의 모든 상인 교환을 찾아보세요. 최고의 거래를 찾고 거래를 계획하세요.",
    ru: "Просматривайте все обмены торговцев в Arc Raiders. Найдите лучшие предложения и планируйте свои сделки.",
    "zh-CN": "浏览Arc Raiders中的所有商人交换。找到最优惠的交易并计划您的交易。",
    ja: "Arc Raidersのすべてのトレーダー交換を閲覧します。最良の取引を見つけて、取引を計画します。",
    tr: "Arc Raiders'taki tüm tüccar takaslarına göz atın. En iyi fırsatları bulun ve işlemlerinizi planlayın.",
    "zh-TW": "瀏覽Arc Raiders中的所有商人交換。找到最優惠的交易並計劃您的交易。",
    sr: "Прегледајте све размене трговаца у Arc Raiders. Пронађите најбоље понуде и планирајте своје трговине.",
    hr: "Pregledajte sve razmjene trgovaca u Arc Raiders. Pronađite najbolje ponude i planirajte svoje razmjene.",
  };

  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/trades`;
  });

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `/${lang}/trades`,
      languages,
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      type: "website",
      locale: lang,
    },
  };
}

export default async function TradesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const trades = await getTrades();

  const pageTexts: Record<Locale, { title: string; subtitle: string; loading: string }> = {
    en: { title: "Trades", subtitle: "Exchange items with traders", loading: "Loading trades..." },
    es: { title: "Intercambios", subtitle: "Intercambia objetos con comerciantes", loading: "Cargando intercambios..." },
    de: { title: "Handel", subtitle: "Tausche Gegenstände mit Händlern", loading: "Handel wird geladen..." },
    fr: { title: "Échanges", subtitle: "Échangez des objets avec des commerçants", loading: "Chargement des échanges..." },
    pt: { title: "Trocas", subtitle: "Troque itens com comerciantes", loading: "Carregando trocas..." },
    pl: { title: "Wymiana", subtitle: "Wymieniaj przedmioty z handlarzami", loading: "Ładowanie wymian..." },
    no: { title: "Handel", subtitle: "Bytt gjenstander med handelsmenn", loading: "Laster handler..." },
    da: { title: "Handel", subtitle: "Byt genstande med handelsmænd", loading: "Indlæser handler..." },
    it: { title: "Scambi", subtitle: "Scambia oggetti con i mercanti", loading: "Caricamento scambi..." },
    uk: { title: "Торгівля", subtitle: "Обмінюйте предмети з торговцями", loading: "Завантаження торгівлі..." },
    kr: { title: "거래", subtitle: "상인과 아이템 교환", loading: "거래 로딩 중..." },
    ru: { title: "Торговля", subtitle: "Обменивайте предметы с торговцами", loading: "Загрузка торговли..." },
    "zh-CN": { title: "交易", subtitle: "与商人交换物品", loading: "加载交易中..." },
    ja: { title: "取引", subtitle: "トレーダーとアイテムを交換", loading: "取引読み込み中..." },
    tr: { title: "Ticaret", subtitle: "Tüccarlarla eşya takası yapın", loading: "Ticaret yükleniyor..." },
    "zh-TW": { title: "交易", subtitle: "與商人交換物品", loading: "載入交易中..." },
    sr: { title: "Трговина", subtitle: "Разменити предмете са трговцима", loading: "Учитавање трговине..." },
    hr: { title: "Trgovina", subtitle: "Razmijeni predmete s trgovcima", loading: "Učitavanje trgovine..." },
  };

  const texts = pageTexts[lang];

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00ffff] mb-4">{texts.title}</h1>
          <p className="text-gray-400 text-lg">{texts.subtitle}</p>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffff]"></div>
              <p className="text-gray-400 mt-4">{texts.loading}</p>
            </div>
          }
        >
          <TradesFilter trades={trades} lang={lang} />
        </Suspense>
      </div>
    </main>
  );
}
