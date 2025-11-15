import { promises as fs } from "fs";
import path from "path";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Locale, locales } from "@/config/i18n";
import { HideoutModule } from "@/components/hideout-modules/types";
import HideoutModuleCard from "@/components/hideout-modules/HideoutModuleCard";

async function getHideoutModules(): Promise<HideoutModule[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "hideoutModules.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileContents);
    // Convert object to array
    return Object.values(data);
  } catch (error) {
    console.error("Error loading hideout modules:", error);
    return [];
  }
}

// Generate static params for all languages
export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale,
  }));
}

// Dynamic metadata per language
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Locale, string> = {
    en: "Hideout Modules - Arc Raiders Kits",
    es: "Módulos de Refugio - Arc Raiders Kits",
    de: "Versteck-Module - Arc Raiders Kits",
    fr: "Modules de Planque - Arc Raiders Kits",
    pt: "Módulos de Esconderijo - Arc Raiders Kits",
    pl: "Moduły Kryjówki - Arc Raiders Kits",
    no: "Skjulested-moduler - Arc Raiders Kits",
    da: "Skjulested-moduler - Arc Raiders Kits",
    it: "Moduli Nascondiglio - Arc Raiders Kits",
    uk: "Модулі Схованки - Arc Raiders Kits",
    kr: "은신처 모듈 - Arc Raiders Kits",
    ru: "Модули Убежища - Arc Raiders Kits",
    "zh-CN": "藏身处模块 - Arc Raiders Kits",
    ja: "隠れ家モジュール - Arc Raiders Kits",
    tr: "Sığınak Modülleri - Arc Raiders Kits",
    "zh-TW": "藏身處模組 - Arc Raiders Kits",
    sr: "Модули Скривнице - Arc Raiders Kits",
    hr: "Moduli Skrovišta - Arc Raiders Kits",
  };

  const descriptions: Record<Locale, string> = {
    en: "Upgrade your hideout modules in Arc Raiders. View requirements and items needed for each level upgrade.",
    es: "Mejora tus módulos de refugio en Arc Raiders. Ve los requisitos y objetos necesarios para cada nivel.",
    de: "Verbessern Sie Ihre Versteck-Module in Arc Raiders. Sehen Sie die Anforderungen und benötigten Gegenstände für jede Stufe.",
    fr: "Améliorez vos modules de planque dans Arc Raiders. Consultez les exigences et les objets nécessaires pour chaque niveau.",
    pt: "Atualize seus módulos de esconderijo em Arc Raiders. Veja os requisitos e itens necessários para cada nível.",
    pl: "Ulepsz swoje moduły kryjówki w Arc Raiders. Zobacz wymagania i przedmioty potrzebne do każdego poziomu.",
    no: "Oppgrader skjulested-modulene dine i Arc Raiders. Se krav og gjenstander som trengs for hvert nivå.",
    da: "Opgrader dine skjulested-moduler i Arc Raiders. Se krav og genstande, der er nødvendige for hvert niveau.",
    it: "Aggiorna i tuoi moduli nascondiglio in Arc Raiders. Visualizza i requisiti e gli oggetti necessari per ogni livello.",
    uk: "Покращуйте модулі схованки в Arc Raiders. Переглядайте вимоги та предмети, необхідні для кожного рівня.",
    kr: "Arc Raiders에서 은신처 모듈을 업그레이드하세요. 각 레벨 업그레이드에 필요한 요구사항과 아이템을 확인하세요.",
    ru: "Улучшайте модули убежища в Arc Raiders. Просматривайте требования и предметы, необходимые для каждого уровня.",
    "zh-CN": "升级Arc Raiders中的藏身处模块。查看每个等级升级所需的要求和物品。",
    ja: "Arc Raidersで隠れ家モジュールをアップグレードします。各レベルアップグレードに必要な要件とアイテムを表示します。",
    tr: "Arc Raiders'ta sığınak modüllerinizi yükseltin. Her seviye yükseltmesi için gereken gereksinimleri ve eşyaları görüntüleyin.",
    "zh-TW": "升級Arc Raiders中的藏身處模組。查看每個等級升級所需的要求和物品。",
    sr: "Надоградите модуле скривнице у Arc Raiders. Погледајте захтеве и ставке потребне за сваки ниво.",
    hr: "Nadogradite module skrovišta u Arc Raiders. Pogledajte zahtjeve i predmete potrebne za svaku razinu.",
  };

  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/hideout-modules`;
  });

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `/${lang}/hideout-modules`,
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

export default async function HideoutModulesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const modules = await getHideoutModules();

  const pageTexts: Record<Locale, { title: string; subtitle: string; loading: string; noData: string }> = {
    en: {
      title: "Hideout Modules",
      subtitle: "Upgrade your hideout to unlock new crafting capabilities",
      loading: "Loading modules...",
      noData: "No hideout modules data available yet.",
    },
    es: {
      title: "Módulos de Refugio",
      subtitle: "Mejora tu refugio para desbloquear nuevas capacidades de fabricación",
      loading: "Cargando módulos...",
      noData: "No hay datos de módulos de refugio disponibles aún.",
    },
    de: {
      title: "Versteck-Module",
      subtitle: "Verbessern Sie Ihr Versteck, um neue Herstellungsfähigkeiten freizuschalten",
      loading: "Module werden geladen...",
      noData: "Noch keine Versteck-Modul-Daten verfügbar.",
    },
    fr: {
      title: "Modules de Planque",
      subtitle: "Améliorez votre planque pour débloquer de nouvelles capacités de fabrication",
      loading: "Chargement des modules...",
      noData: "Aucune donnée de module de planque disponible pour le moment.",
    },
    pt: {
      title: "Módulos de Esconderijo",
      subtitle: "Atualize seu esconderijo para desbloquear novas capacidades de fabricação",
      loading: "Carregando módulos...",
      noData: "Nenhum dado de módulo de esconderijo disponível ainda.",
    },
    pl: {
      title: "Moduły Kryjówki",
      subtitle: "Ulepsz swoją kryjówkę, aby odblokować nowe możliwości wytwarzania",
      loading: "Ładowanie modułów...",
      noData: "Brak dostępnych danych o modułach kryjówki.",
    },
    no: {
      title: "Skjulested-moduler",
      subtitle: "Oppgrader skjulestedet ditt for å låse opp nye produksjonsmuligheter",
      loading: "Laster moduler...",
      noData: "Ingen skjulested-moduldata tilgjengelig ennå.",
    },
    da: {
      title: "Skjulested-moduler",
      subtitle: "Opgrader dit skjulested for at låse nye fremstillingsevner op",
      loading: "Indlæser moduler...",
      noData: "Ingen skjulested-moduldata tilgængelig endnu.",
    },
    it: {
      title: "Moduli Nascondiglio",
      subtitle: "Aggiorna il tuo nascondiglio per sbloccare nuove capacità di fabbricazione",
      loading: "Caricamento moduli...",
      noData: "Nessun dato modulo nascondiglio disponibile ancora.",
    },
    uk: {
      title: "Модулі Схованки",
      subtitle: "Покращуйте схованку, щоб розблокувати нові можливості виготовлення",
      loading: "Завантаження модулів...",
      noData: "Дані модулів схованки ще недоступні.",
    },
    kr: {
      title: "은신처 모듈",
      subtitle: "새로운 제작 기능을 잠금 해제하려면 은신처를 업그레이드하세요",
      loading: "모듈 로딩 중...",
      noData: "은신처 모듈 데이터가 아직 없습니다.",
    },
    ru: {
      title: "Модули Убежища",
      subtitle: "Улучшайте убежище, чтобы разблокировать новые возможности крафта",
      loading: "Загрузка модулей...",
      noData: "Данные модулей убежища пока недоступны.",
    },
    "zh-CN": {
      title: "藏身处模块",
      subtitle: "升级藏身处以解锁新的制作能力",
      loading: "加载模块中...",
      noData: "暂无藏身处模块数据。",
    },
    ja: {
      title: "隠れ家モジュール",
      subtitle: "隠れ家をアップグレードして新しいクラフト機能をアンロック",
      loading: "モジュール読み込み中...",
      noData: "隠れ家モジュールデータはまだありません。",
    },
    tr: {
      title: "Sığınak Modülleri",
      subtitle: "Yeni üretim yeteneklerinin kilidini açmak için sığınağınızı yükseltin",
      loading: "Modüller yükleniyor...",
      noData: "Henüz sığınak modülü verisi yok.",
    },
    "zh-TW": {
      title: "藏身處模組",
      subtitle: "升級藏身處以解鎖新的製作能力",
      loading: "載入模組中...",
      noData: "暫無藏身處模組資料。",
    },
    sr: {
      title: "Модули Скривнице",
      subtitle: "Надоградите скривницу да откључате нове могућности израде",
      loading: "Учитавање модула...",
      noData: "Подаци о модулима скривнице још нису доступни.",
    },
    hr: {
      title: "Moduli Skrovišta",
      subtitle: "Nadogradite skrovište da otključate nove mogućnosti izrade",
      loading: "Učitavanje modula...",
      noData: "Podaci o modulima skrovišta još nisu dostupni.",
    },
  };

  const texts = pageTexts[lang];

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00ffff] mb-4">{texts.title}</h1>
          <p className="text-gray-400 text-lg">{texts.subtitle}</p>
        </div>

        {modules.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <HideoutModuleCard key={module.id} module={module} lang={lang} />
              ))}
            </div>
          </Suspense>
        )}
      </div>
    </main>
  );
}
