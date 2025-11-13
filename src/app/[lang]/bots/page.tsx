import { promises as fs } from "fs";
import path from "path";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Locale, locales } from "@/config/i18n";
import BotsFilter from "@/components/bots/BotsFilter";

interface Bot {
  id: string;
  name: string;
  image?: string;
  type?: string;
  threat?: string;
  description?: string;
  destroyXp?: number;
  lootXp?: number;
  drops?: string[];
}

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

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Locale, string> = {
    en: "Bots Database - Arc Raiders Kits",
    es: "Base de Datos de Bots - Arc Raiders Kits",
    de: "Bot-Datenbank - Arc Raiders Kits",
    fr: "Base de Données de Bots - Arc Raiders Kits",
    pt: "Banco de Dados de Bots - Arc Raiders Kits",
    pl: "Baza Botów - Arc Raiders Kits",
    no: "Bot Database - Arc Raiders Kits",
    da: "Bot Database - Arc Raiders Kits",
    it: "Database Bot - Arc Raiders Kits",
    uk: "База Даних Ботів - Arc Raiders Kits",
    kr: "봇 데이터베이스 - Arc Raiders Kits",
    ru: "База Данных Ботов - Arc Raiders Kits",
    "zh-CN": "机器人数据库 - Arc Raiders Kits",
    ja: "ボットデータベース - Arc Raiders Kits",
    tr: "Bot Veritabanı - Arc Raiders Kits",
    "zh-TW": "機器人資料庫 - Arc Raiders Kits",
    sr: "База Ботова - Arc Raiders Kits",
    hr: "Baza Botova - Arc Raiders Kits",
  };

  const descriptions: Record<Locale, string> = {
    en: "Browse all Arc Raiders bots with details about their type, threat level, drops, and XP rewards.",
    es: "Explora todos los bots de Arc Raiders con detalles sobre su tipo, nivel de amenaza, botín y recompensas de XP.",
    de: "Durchsuchen Sie alle Arc Raiders Bots mit Details zu ihrem Typ, Bedrohungsstufe, Beute und XP-Belohnungen.",
    fr: "Parcourez tous les bots d'Arc Raiders avec des détails sur leur type, niveau de menace, butin et récompenses XP.",
    pt: "Navegue por todos os bots do Arc Raiders com detalhes sobre seu tipo, nível de ameaça, drops e recompensas de XP.",
    pl: "Przeglądaj wszystkie boty Arc Raiders ze szczegółami dotyczącymi ich typu, poziomu zagrożenia, łupów i nagród XP.",
    no: "Bla gjennom alle Arc Raiders-botter med detaljer om type, trusselnivå, drops og XP-belønninger.",
    da: "Gennemse alle Arc Raiders-bots med detaljer om deres type, trusselsniveau, drops og XP-belønninger.",
    it: "Sfoglia tutti i bot di Arc Raiders con dettagli sul loro tipo, livello di minaccia, drop e ricompense XP.",
    uk: "Переглядайте всіх ботів Arc Raiders з деталями про їх тип, рівень загрози, дропи та винагороди XP.",
    kr: "Arc Raiders의 모든 봇을 찾아보고 유형, 위협 수준, 드롭 및 XP 보상에 대한 세부 정보를 확인하세요.",
    ru: "Просматривайте всех ботов Arc Raiders с подробностями об их типе, уровне угрозы, добыче и наградах XP.",
    "zh-CN": "浏览所有Arc Raiders机器人，包含类型、威胁等级、掉落物和经验奖励的详细信息。",
    ja: "Arc Raidersのすべてのボットを、タイプ、脅威レベル、ドロップ、XP報酬の詳細とともに閲覧できます。",
    tr: "Tüm Arc Raiders botlarını türleri, tehdit seviyeleri, düşürdükleri eşyalar ve XP ödülleriyle birlikte göz atın.",
    "zh-TW": "瀏覽所有Arc Raiders機器人，包含類型、威脅等級、掉落物和經驗獎勵的詳細資訊。",
    sr: "Прегледајте све Arc Raiders ботове са детаљима о њиховом типу, нивоу претње, дропу и XP наградама.",
    hr: "Pregledajte sve Arc Raiders botove s detaljima o njihovom tipu, razini prijetnje, dropu i XP nagradama.",
  };

  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/bots`;
  });

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `/${lang}/bots`,
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

export default async function BotsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const bots = await getBots();

  const pageTexts: Record<Locale, { title: string; subtitle: string; loading: string }> = {
    en: { title: "Bots Database", subtitle: "Discover all ARC bots and their characteristics", loading: "Loading bots..." },
    es: { title: "Base de Datos de Bots", subtitle: "Descubre todos los bots ARC y sus características", loading: "Cargando bots..." },
    de: { title: "Bot-Datenbank", subtitle: "Entdecken Sie alle ARC-Bots und ihre Eigenschaften", loading: "Bots werden geladen..." },
    fr: { title: "Base de Données de Bots", subtitle: "Découvrez tous les bots ARC et leurs caractéristiques", loading: "Chargement des bots..." },
    pt: { title: "Banco de Dados de Bots", subtitle: "Descubra todos os bots ARC e suas características", loading: "Carregando bots..." },
    pl: { title: "Baza Botów", subtitle: "Odkryj wszystkie boty ARC i ich cechy", loading: "Ładowanie botów..." },
    no: { title: "Bot Database", subtitle: "Oppdag alle ARC-botter og deres egenskaper", loading: "Laster botter..." },
    da: { title: "Bot Database", subtitle: "Opdag alle ARC-bots og deres egenskaber", loading: "Indlæser bots..." },
    it: { title: "Database Bot", subtitle: "Scopri tutti i bot ARC e le loro caratteristiche", loading: "Caricamento bot..." },
    uk: { title: "База Даних Ботів", subtitle: "Відкрийте для себе всіх ботів ARC та їх характеристики", loading: "Завантаження ботів..." },
    kr: { title: "봇 데이터베이스", subtitle: "모든 ARC 봇과 그 특성을 발견하세요", loading: "봇 로딩 중..." },
    ru: { title: "База Данных Ботов", subtitle: "Откройте для себя всех ботов ARC и их характеристики", loading: "Загрузка ботов..." },
    "zh-CN": { title: "机器人数据库", subtitle: "发现所有ARC机器人及其特性", loading: "加载机器人中..." },
    ja: { title: "ボットデータベース", subtitle: "すべてのARCボットとその特性を発見", loading: "ボット読み込み中..." },
    tr: { title: "Bot Veritabanı", subtitle: "Tüm ARC botlarını ve özelliklerini keşfedin", loading: "Botlar yükleniyor..." },
    "zh-TW": { title: "機器人資料庫", subtitle: "發現所有ARC機器人及其特性", loading: "載入機器人中..." },
    sr: { title: "База Ботова", subtitle: "Откријте све ARC ботове и њихове карактеристике", loading: "Учитавање ботова..." },
    hr: { title: "Baza Botova", subtitle: "Otkrijte sve ARC botove i njihove karakteristike", loading: "Učitavanje botova..." },
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
          <BotsFilter bots={bots} lang={lang} />
        </Suspense>
      </div>
    </main>
  );
}
