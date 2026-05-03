import { promises as fs } from "fs";
import path from "path";
import Image from "next/image";
import type { Metadata } from "next";
import { Locale, locales } from "@/config/i18n";

interface MapEntry {
  id: string;
  name: { en: string; [key: string]: string };
  image: string;
}

const mapsPageTitle: Record<Locale, string> = {
  en: "Maps",
  es: "Mapas",
  de: "Karten",
  fr: "Cartes",
  pt: "Mapas",
  pl: "Mapy",
  no: "Kart",
  da: "Kort",
  it: "Mappe",
  uk: "Карти",
  kr: "지도",
  ru: "Карты",
  "zh-CN": "地图",
  ja: "マップ",
  tr: "Haritalar",
  "zh-TW": "地圖",
  sr: "Mape",
  hr: "Karte",
};

const mapsPageSubtitle: Record<Locale, string> = {
  en: "All available maps in ARC Raiders",
  es: "Todos los mapas disponibles en ARC Raiders",
  de: "Alle verfügbaren Karten in ARC Raiders",
  fr: "Toutes les cartes disponibles dans ARC Raiders",
  pt: "Todos os mapas disponíveis em ARC Raiders",
  pl: "Wszystkie dostępne mapy w ARC Raiders",
  no: "Alle tilgjengelige kart i ARC Raiders",
  da: "Alle tilgængelige kort i ARC Raiders",
  it: "Tutte le mappe disponibili in ARC Raiders",
  uk: "Усі доступні карти в ARC Raiders",
  kr: "ARC Raiders의 모든 맵",
  ru: "Все доступные карты в ARC Raiders",
  "zh-CN": "ARC Raiders 中所有可用地图",
  ja: "ARC Raidersの全マップ",
  tr: "ARC Raiders'daki tüm haritalar",
  "zh-TW": "ARC Raiders 中所有可用地圖",
  sr: "Sve dostupne mape u ARC Raiders",
  hr: "Sve dostupne karte u ARC Raiders",
};

async function getMaps(): Promise<MapEntry[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "maps.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading maps:", error);
    return [];
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = `${mapsPageTitle[lang]} - ARC Raiders Kits`;
  return {
    title,
    description: mapsPageSubtitle[lang],
    alternates: {
      canonical: `/${lang}/maps`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/maps`])),
    },
  };
}

function getMapDisplayName(map: MapEntry, lang: Locale): string {
  const langKey = lang === "kr" ? "ko-KR" : lang;
  const name = map.name[langKey] || map.name.en;
  // Clean up underscore-separated slugs that some locales still use
  if (name && !name.includes(" ") && name.includes("_")) {
    return map.name.en;
  }
  return name || map.name.en;
}

export default async function MapsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const maps = await getMaps();

  // Deduplicate stella_montis upper/lower into one entry
  const deduped = maps.reduce<MapEntry[]>((acc, map) => {
    if (map.id === "stella_montis_lower") {
      // Skip lower — upper already represents Stella Montis
      return acc;
    }
    if (map.id === "stella_montis_upper") {
      return [...acc, { ...map, id: "stella_montis" }];
    }
    return [...acc, map];
  }, []);

  return (
    <main className="min-h-screen pt-10 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">{mapsPageTitle[lang]}</h1>
          <p className="text-gray-400">{mapsPageSubtitle[lang]}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deduped.map((map) => (
            <div
              key={map.id}
              className="group relative bg-[#0d111d]/70 border border-gray-700/50 rounded-xl overflow-hidden hover:border-[#e5a10f]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(229,161,15,0.15)]"
            >
              <div className="relative w-full aspect-video bg-gray-900">
                <Image
                  src={map.image}
                  alt={getMapDisplayName(map, lang)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-xl font-bold text-white drop-shadow-lg">{getMapDisplayName(map, lang)}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
