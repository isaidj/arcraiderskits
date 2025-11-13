import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import { Locale, locales } from "@/config/i18n";

interface HideoutLevel {
  level: number;
  requirementItemIds?: Array<{ itemId: string; quantity: number }>;
}

interface HideoutModule {
  id: string;
  name: { [key: string]: string };
  maxLevel: number;
  levels: HideoutLevel[];
}

interface Item {
  id: string;
  name: string | { [key: string]: string };
  imageFilename?: string;
}

async function getHideoutModules(): Promise<Record<string, HideoutModule>> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "hideoutModules.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading hideout modules:", error);
    return {};
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

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Locale, string> = {
    en: "Hideout Modules - Arc Raiders Kits",
    es: "Módulos de Escondite - Arc Raiders Kits",
    de: "Versteck-Module - Arc Raiders Kits",
    fr: "Modules de Cachette - Arc Raiders Kits",
    pt: "Módulos de Esconderijo - Arc Raiders Kits",
    pl: "Moduły Kryjówki - Arc Raiders Kits",
    no: "Skjulested Moduler - Arc Raiders Kits",
    da: "Skjulested Moduler - Arc Raiders Kits",
    it: "Moduli del Nascondiglio - Arc Raiders Kits",
    uk: "Модулі Сховища - Arc Raiders Kits",
    kr: "은신처 모듈 - Arc Raiders Kits",
    ru: "Модули Убежища - Arc Raiders Kits",
    "zh-CN": "藏身处模块 - Arc Raiders Kits",
    ja: "隠れ家モジュール - Arc Raiders Kits",
    tr: "Sığınak Modülleri - Arc Raiders Kits",
    "zh-TW": "藏身處模組 - Arc Raiders Kits",
    sr: "Модули Скровишта - Arc Raiders Kits",
    hr: "Moduli Skrovišta - Arc Raiders Kits",
  };

  const descriptions: Record<Locale, string> = {
    en: "Upgrade your hideout with various modules. Track requirements and progress for each level.",
    es: "Mejora tu escondite con varios módulos. Rastrea requisitos y progreso para cada nivel.",
    de: "Rüsten Sie Ihr Versteck mit verschiedenen Modulen auf. Verfolgen Sie Anforderungen und Fortschritt für jede Stufe.",
    fr: "Améliorez votre cachette avec divers modules. Suivez les exigences et les progrès pour chaque niveau.",
    pt: "Melhore seu esconderijo com vários módulos. Acompanhe os requisitos e o progresso de cada nível.",
    pl: "Ulepsz swoją kryjówkę za pomocą różnych modułów. Śledź wymagania i postępy dla każdego poziomu.",
    no: "Oppgrader ditt skjulested med forskjellige moduler. Spor krav og fremgang for hvert nivå.",
    da: "Opgrader dit skjulested med forskellige moduler. Spor krav og fremskridt for hvert niveau.",
    it: "Migliora il tuo nascondiglio con vari moduli. Tieni traccia dei requisiti e dei progressi per ogni livello.",
    uk: "Покращуйте своє сховище різними модулями. Відстежуйте вимоги та прогрес для кожного рівня.",
    kr: "다양한 모듈로 은신처를 업그레이드하세요. 각 레벨의 요구 사항과 진행 상황을 추적하세요.",
    ru: "Улучшайте свое убежище различными модулями. Отслеживайте требования и прогресс для каждого уровня.",
    "zh-CN": "使用各种模块升级您的藏身处。跟踪每个级别的要求和进度。",
    ja: "さまざまなモジュールで隠れ家をアップグレードします。各レベルの要件と進捗状況を追跡します。",
    tr: "Çeşitli modüllerle sığınağınızı yükseltin. Her seviye için gereksinimleri ve ilerlemeyi takip edin.",
    "zh-TW": "使用各種模組升級您的藏身處。追蹤每個級別的要求和進度。",
    sr: "Унапредите своје скровиште различитим модулима. Пратите захтеве и напредак за сваки ниво.",
    hr: "Unaprijedite svoje skrovište različitim modulima. Pratite zahtjeve i napredak za svaku razinu.",
  };

  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/hideout`;
  });

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `/${lang}/hideout`,
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

export default async function HideoutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const modulesData = await getHideoutModules();
  const items = await getItems();
  const modules = Object.values(modulesData);

  const pageTexts: Record<Locale, { title: string; subtitle: string; maxLevel: string; level: string; requirements: string; noRequirements: string }> = {
    en: { title: "Hideout Modules", subtitle: "Upgrade your hideout facilities", maxLevel: "Max Level", level: "Level", requirements: "Requirements", noRequirements: "No requirements" },
    es: { title: "Módulos de Escondite", subtitle: "Mejora las instalaciones de tu escondite", maxLevel: "Nivel Máximo", level: "Nivel", requirements: "Requisitos", noRequirements: "Sin requisitos" },
    de: { title: "Versteck-Module", subtitle: "Rüsten Sie Ihre Versteck-Einrichtungen auf", maxLevel: "Max. Stufe", level: "Stufe", requirements: "Anforderungen", noRequirements: "Keine Anforderungen" },
    fr: { title: "Modules de Cachette", subtitle: "Améliorez les installations de votre cachette", maxLevel: "Niveau Max", level: "Niveau", requirements: "Exigences", noRequirements: "Aucune exigence" },
    pt: { title: "Módulos de Esconderijo", subtitle: "Melhore as instalações do seu esconderijo", maxLevel: "Nível Máximo", level: "Nível", requirements: "Requisitos", noRequirements: "Sem requisitos" },
    pl: { title: "Moduły Kryjówki", subtitle: "Ulepsz obiekty swojej kryjówki", maxLevel: "Maks. Poziom", level: "Poziom", requirements: "Wymagania", noRequirements: "Brak wymagań" },
    no: { title: "Skjulested Moduler", subtitle: "Oppgrader dine skjulestedfasiliteter", maxLevel: "Maks Nivå", level: "Nivå", requirements: "Krav", noRequirements: "Ingen krav" },
    da: { title: "Skjulested Moduler", subtitle: "Opgrader dine skjulestedfaciliteter", maxLevel: "Maks Niveau", level: "Niveau", requirements: "Krav", noRequirements: "Ingen krav" },
    it: { title: "Moduli del Nascondiglio", subtitle: "Migliora le strutture del tuo nascondiglio", maxLevel: "Livello Max", level: "Livello", requirements: "Requisiti", noRequirements: "Nessun requisito" },
    uk: { title: "Модулі Сховища", subtitle: "Покращте об'єкти вашого сховища", maxLevel: "Макс. Рівень", level: "Рівень", requirements: "Вимоги", noRequirements: "Немає вимог" },
    kr: { title: "은신처 모듈", subtitle: "은신처 시설 업그레이드", maxLevel: "최대 레벨", level: "레벨", requirements: "요구 사항", noRequirements: "요구 사항 없음" },
    ru: { title: "Модули Убежища", subtitle: "Улучшайте объекты вашего убежища", maxLevel: "Макс. Уровень", level: "Уровень", requirements: "Требования", noRequirements: "Нет требований" },
    "zh-CN": { title: "藏身处模块", subtitle: "升级您的藏身处设施", maxLevel: "最大等级", level: "等级", requirements: "要求", noRequirements: "无要求" },
    ja: { title: "隠れ家モジュール", subtitle: "隠れ家の施設をアップグレード", maxLevel: "最大レベル", level: "レベル", requirements: "要件", noRequirements: "要件なし" },
    tr: { title: "Sığınak Modülleri", subtitle: "Sığınak tesislerinizi yükseltin", maxLevel: "Maks Seviye", level: "Seviye", requirements: "Gereksinimler", noRequirements: "Gereksinim yok" },
    "zh-TW": { title: "藏身處模組", subtitle: "升級您的藏身處設施", maxLevel: "最大等級", level: "等級", requirements: "要求", noRequirements: "無要求" },
    sr: { title: "Модули Скровишта", subtitle: "Унапредите објекте вашег скровишта", maxLevel: "Макс. Ниво", level: "Ниво", requirements: "Захтеви", noRequirements: "Нема захтева" },
    hr: { title: "Moduli Skrovišta", subtitle: "Unaprijedite objekte vašeg skrovišta", maxLevel: "Maks. Razina", level: "Razina", requirements: "Zahtjevi", noRequirements: "Nema zahtjeva" },
  };

  const texts = pageTexts[lang];

  const getItemDetails = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return { name: itemId, image: null };

    const name = typeof item.name === "object" ? item.name[lang] || item.name.en : item.name;
    const image = item.imageFilename ? `/data/images/items/${item.imageFilename}` : null;

    return { name, image };
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00ffff] mb-4">{texts.title}</h1>
          <p className="text-gray-400 text-lg">{texts.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => {
            const moduleName = typeof module.name === "object" ? module.name[lang] || module.name.en : module.name;

            return (
              <div key={module.id} className="bg-[#0d111d]/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-[#00ffff] transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-[#00ffff]">{moduleName}</h2>
                  <span className="bg-[#00ffff]/20 text-[#00ffff] px-3 py-1 rounded-full text-sm font-semibold">
                    {texts.maxLevel}: {module.maxLevel}
                  </span>
                </div>

                <div className="space-y-4">
                  {module.levels.map((levelData) => (
                    <div key={levelData.level} className="bg-gray-900/50 border border-gray-700 rounded p-4">
                      <h3 className="text-lg font-semibold text-gray-300 mb-3">
                        {texts.level} {levelData.level}
                      </h3>

                      {levelData.requirementItemIds && levelData.requirementItemIds.length > 0 ? (
                        <div>
                          <p className="text-sm text-gray-400 mb-2">{texts.requirements}:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {levelData.requirementItemIds.map((req) => {
                              const { name, image } = getItemDetails(req.itemId);
                              return (
                                <div key={req.itemId} className="bg-gray-800/50 border border-gray-600 rounded p-2 flex items-center gap-2">
                                  {image && <img src={image} alt={name} className="w-8 h-8 object-contain" />}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-300 text-xs truncate">{name}</p>
                                    <p className="text-[#00ffff] text-sm font-semibold">x{req.quantity}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">{texts.noRequirements}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
