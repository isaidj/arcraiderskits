import { promises as fs } from "fs";
import path from "path";
import { Suspense } from "react";
import type { Metadata } from "next";
import ArcPageContent from "@/components/arc/ArcPageContent";
import { Locale, locales } from "@/config/i18n";
import { Bot } from "@/components/arc/types";

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

// Generar parámetros estáticos para todos los idiomas
export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale,
  }));
}

// Metadata dinámica por idioma
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Locale, string> = {
    en: "ARC Enemies Database - Arc Raiders Kits",
    es: "Base de Datos de Enemigos ARC - Arc Raiders Kits",
    de: "ARC-Feinde Datenbank - Arc Raiders Kits",
    fr: "Base de Données des Ennemis ARC - Arc Raiders Kits",
    pt: "Banco de Dados de Inimigos ARC - Arc Raiders Kits",
    pl: "Baza Wrogów ARC - Arc Raiders Kits",
    no: "ARC-fiender Database - Arc Raiders Kits",
    da: "ARC-fjender Database - Arc Raiders Kits",
    it: "Database Nemici ARC - Arc Raiders Kits",
    uk: "База Даних Ворогів ARC - Arc Raiders Kits",
    kr: "ARC 적 데이터베이스 - Arc Raiders Kits",
    ru: "База Данных Врагов ARC - Arc Raiders Kits",
    "zh-CN": "ARC敌人数据库 - Arc Raiders Kits",
    ja: "ARC敵データベース - Arc Raiders Kits",
    tr: "ARC Düşmanları Veritabanı - Arc Raiders Kits",
    "zh-TW": "ARC敵人資料庫 - Arc Raiders Kits",
    sr: "База ARC Непријатеља - Arc Raiders Kits",
    hr: "Baza ARC Neprijatelja - Arc Raiders Kits",
  };

  const descriptions: Record<Locale, string> = {
    en: "Explore all ARC enemy types from Arc Raiders. Learn about their threat levels, loot drops, and combat strategies.",
    es: "Explora todos los tipos de enemigos ARC de Arc Raiders. Aprende sobre sus niveles de amenaza, botín y estrategias de combate.",
    de: "Erkunden Sie alle ARC-Feindtypen aus Arc Raiders. Erfahren Sie mehr über ihre Bedrohungsstufen, Beutegegenstände und Kampfstrategien.",
    fr: "Explorez tous les types d'ennemis ARC d'Arc Raiders. Découvrez leurs niveaux de menace, leur butin et leurs stratégies de combat.",
    pt: "Explore todos os tipos de inimigos ARC do Arc Raiders. Saiba mais sobre seus níveis de ameaça, saque e estratégias de combate.",
    pl: "Poznaj wszystkie typy wrogów ARC z Arc Raiders. Dowiedz się o ich poziomach zagrożenia, łupach i strategiach walki.",
    no: "Utforsk alle ARC-fiendetyper fra Arc Raiders. Lær om deres trusselsnivåer, byttegjenstander og kampstrategier.",
    da: "Udforsk alle ARC-fjendetyper fra Arc Raiders. Lær om deres trusselsniveauer, bytteudbytte og kampstrategier.",
    it: "Esplora tutti i tipi di nemici ARC di Arc Raiders. Scopri i loro livelli di minaccia, bottino e strategie di combattimento.",
    uk: "Досліджуйте всі типи ворогів ARC з Arc Raiders. Дізнайтеся про їх рівні загрози, здобич та бойові стратегії.",
    kr: "Arc Raiders의 모든 ARC 적 유형을 탐색하세요. 위협 수준, 전리품 및 전투 전략에 대해 알아보세요.",
    ru: "Изучите все типы врагов ARC из Arc Raiders. Узнайте об их уровнях угрозы, добыче и боевых стратегиях.",
    "zh-CN": "探索Arc Raiders中的所有ARC敌人类型。了解他们的威胁等级、战利品掉落和战斗策略。",
    ja: "Arc RaidersのすべてのARC敵タイプを探索します。脅威レベル、戦利品、戦闘戦略について学びましょう。",
    tr: "Arc Raiders'tan tüm ARC düşman türlerini keşfedin. Tehdit seviyelerini, ganimet düşüşlerini ve savaş stratejilerini öğrenin.",
    "zh-TW": "探索Arc Raiders中的所有ARC敵人類型。了解他們的威脅等級、戰利品掉落和戰鬥策略。",
    sr: "Истражите све типове ARC непријатеља из Arc Raiders. Сазнајте о њиховим нивоима претње, плену и борбеним стратегијама.",
    hr: "Istražite sve vrste ARC neprijatelja iz Arc Raiders. Saznajte o njihovim razinama prijetnje, plijenu i borbenim strategijama.",
  };

  // Crear alternates para todos los idiomas
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/arc`;
  });

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `/${lang}/arc`,
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

export default async function ArcPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const bots = await getBots();

  const pageTexts: Record<Locale, { title: string; subtitle: string; loading: string; noData: string }> = {
    en: {
      title: "ARC Enemies",
      subtitle: "Combat intel on all hostile ARC units",
      loading: "Loading ARC enemies...",
      noData: "No ARC enemy data available yet.",
    },
    es: {
      title: "Enemigos ARC",
      subtitle: "Información de combate sobre todas las unidades ARC hostiles",
      loading: "Cargando enemigos ARC...",
      noData: "No hay datos de enemigos ARC disponibles aún.",
    },
    de: {
      title: "ARC-Feinde",
      subtitle: "Kampfinformationen über alle feindlichen ARC-Einheiten",
      loading: "ARC-Feinde werden geladen...",
      noData: "Noch keine ARC-Feinddaten verfügbar.",
    },
    fr: {
      title: "Ennemis ARC",
      subtitle: "Renseignements de combat sur toutes les unités ARC hostiles",
      loading: "Chargement des ennemis ARC...",
      noData: "Aucune donnée d'ennemi ARC disponible pour le moment.",
    },
    pt: {
      title: "Inimigos ARC",
      subtitle: "Inteligência de combate sobre todas as unidades ARC hostis",
      loading: "Carregando inimigos ARC...",
      noData: "Nenhum dado de inimigo ARC disponível ainda.",
    },
    pl: {
      title: "Wrogowie ARC",
      subtitle: "Dane bojowe o wszystkich wrogich jednostkach ARC",
      loading: "Ładowanie wrogów ARC...",
      noData: "Brak dostępnych danych o wrogach ARC.",
    },
    no: {
      title: "ARC-fiender",
      subtitle: "Kampinformasjon om alle fiendtlige ARC-enheter",
      loading: "Laster ARC-fiender...",
      noData: "Ingen ARC-fiendedata tilgjengelig ennå.",
    },
    da: {
      title: "ARC-fjender",
      subtitle: "Kampinformation om alle fjendtlige ARC-enheder",
      loading: "Indlæser ARC-fjender...",
      noData: "Ingen ARC-fjendedata tilgængelig endnu.",
    },
    it: {
      title: "Nemici ARC",
      subtitle: "Intelligence di combattimento su tutte le unità ARC ostili",
      loading: "Caricamento nemici ARC...",
      noData: "Nessun dato nemico ARC disponibile ancora.",
    },
    uk: {
      title: "Вороги ARC",
      subtitle: "Бойова розвідка про всі ворожі підрозділи ARC",
      loading: "Завантаження ворогів ARC...",
      noData: "Дані ворогів ARC ще недоступні.",
    },
    kr: {
      title: "ARC 적",
      subtitle: "모든 적대적 ARC 유닛에 대한 전투 정보",
      loading: "ARC 적 로딩 중...",
      noData: "ARC 적 데이터가 아직 없습니다.",
    },
    ru: {
      title: "Враги ARC",
      subtitle: "Боевая разведка о всех враждебных подразделениях ARC",
      loading: "Загрузка врагов ARC...",
      noData: "Данные врагов ARC пока недоступны.",
    },
    "zh-CN": {
      title: "ARC敌人",
      subtitle: "所有敌对ARC单位的战斗情报",
      loading: "加载ARC敌人中...",
      noData: "暂无ARC敌人数据。",
    },
    ja: {
      title: "ARC敵",
      subtitle: "すべての敵対的ARCユニットに関する戦闘情報",
      loading: "ARC敵読み込み中...",
      noData: "ARC敵データはまだありません。",
    },
    tr: {
      title: "ARC Düşmanları",
      subtitle: "Tüm düşman ARC birimleri hakkında savaş istihbaratı",
      loading: "ARC düşmanları yükleniyor...",
      noData: "Henüz ARC düşman verisi yok.",
    },
    "zh-TW": {
      title: "ARC敵人",
      subtitle: "所有敵對ARC單位的戰鬥情報",
      loading: "載入ARC敵人中...",
      noData: "暫無ARC敵人資料。",
    },
    sr: {
      title: "ARC Непријатељи",
      subtitle: "Борбена обавештења о свим непријатељским ARC јединицама",
      loading: "Учитавање ARC непријатеља...",
      noData: "Подаци о ARC непријатељима још нису доступни.",
    },
    hr: {
      title: "ARC Neprijatelji",
      subtitle: "Borbene obavještajne informacije o svim neprijateljskim ARC jedinicama",
      loading: "Učitavanje ARC neprijatelja...",
      noData: "Podaci o ARC neprijateljima još nisu dostupni.",
    },
  };

  const texts = pageTexts[lang];

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-300 mb-3 md:mb-4">{texts.title}</h1>
          <p className="text-gray-400 text-base md:text-lg">{texts.subtitle}</p>
        </div>

        {bots.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">{texts.noData}</p>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">{texts.loading}</p>
              </div>
            }
          >
            <ArcPageContent bots={bots} lang={lang} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
