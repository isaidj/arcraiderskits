import { promises as fs } from "fs";
import path from "path";
import { Suspense } from "react";
import type { Metadata } from "next";
import ItemsFilter from "@/components/ItemsFilter";
import { Locale, locales, localeNames } from "@/config/i18n";

interface Item {
  id: string;
  name: string | { [key: string]: string };
  description?: string | { [key: string]: string };
  category?: string;
  type?: string;
  rarity?: string;
  image?: string;
  imageFilename?: string;
  [key: string]: any;
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
    en: "Items Database - Arc Raiders Kits",
    es: "Base de Datos de Objetos - Arc Raiders Kits",
    de: "Gegenstandsdatenbank - Arc Raiders Kits",
    fr: "Base de Données d'Objets - Arc Raiders Kits",
    pt: "Banco de Dados de Itens - Arc Raiders Kits",
    pl: "Baza Przedmiotów - Arc Raiders Kits",
    no: "Gjenstandsdatabase - Arc Raiders Kits",
    da: "Genstands Database - Arc Raiders Kits",
    it: "Database Oggetti - Arc Raiders Kits",
    uk: "База Даних Предметів - Arc Raiders Kits",
    kr: "아이템 데이터베이스 - Arc Raiders Kits",
    ru: "База Данных Предметов - Arc Raiders Kits",
    "zh-CN": "物品数据库 - Arc Raiders Kits",
    ja: "アイテムデータベース - Arc Raiders Kits",
    tr: "Eşya Veritabanı - Arc Raiders Kits",
    "zh-TW": "物品資料庫 - Arc Raiders Kits",
    sr: "База Предмета - Arc Raiders Kits",
    hr: "Baza Predmeta - Arc Raiders Kits",
  };

  const descriptions: Record<Locale, string> = {
    en: "Browse and search through all items from Arc Raiders. Filter by category, rarity, and sort by various properties.",
    es: "Explora y busca todos los objetos de Arc Raiders. Filtra por categoría, rareza y ordena por varias propiedades.",
    de: "Durchsuchen Sie alle Gegenstände von Arc Raiders. Filtern Sie nach Kategorie, Seltenheit und sortieren Sie nach verschiedenen Eigenschaften.",
    fr: "Parcourez et recherchez tous les objets d'Arc Raiders. Filtrez par catégorie, rareté et triez par diverses propriétés.",
    pt: "Navegue e pesquise todos os itens do Arc Raiders. Filtre por categoria, raridade e ordene por várias propriedades.",
    pl: "Przeglądaj i wyszukuj wszystkie przedmioty z Arc Raiders. Filtruj według kategorii, rzadkości i sortuj według różnych właściwości.",
    no: "Bla gjennom og søk i alle gjenstander fra Arc Raiders. Filtrer etter kategori, sjeldenhet og sorter etter ulike egenskaper.",
    da: "Gennemse og søg i alle genstande fra Arc Raiders. Filtrer efter kategori, sjeldenhed og sorter efter forskellige egenskaber.",
    it: "Sfoglia e cerca tutti gli oggetti di Arc Raiders. Filtra per categoria, rarità e ordina per varie proprietà.",
    uk: "Переглядайте та шукайте всі предмети з Arc Raiders. Фільтруйте за категорією, рідкістю та сортуйте за різними властивостями.",
    kr: "Arc Raiders의 모든 아이템을 찾아보고 검색하세요. 카테고리, 희귀도별로 필터링하고 다양한 속성으로 정렬하세요.",
    ru: "Просматривайте и ищите все предметы из Arc Raiders. Фильтруйте по категории, редкости и сортируйте по различным свойствам.",
    "zh-CN": "浏览和搜索Arc Raiders的所有物品。按类别、稀有度筛选并按各种属性排序。",
    ja: "Arc Raidersのすべてのアイテムを閲覧・検索できます。カテゴリ、レアリティでフィルタリングし、さまざまなプロパティで並べ替えます。",
    tr: "Arc Raiders'tan tüm eşyalara göz atın ve arayın. Kategoriye, nadirliğe göre filtreleyin ve çeşitli özelliklere göre sıralayın.",
    "zh-TW": "瀏覽和搜尋Arc Raiders的所有物品。按類別、稀有度篩選並按各種屬性排序。",
    sr: "Прегледајте и претражујте све предмете из Arc Raiders. Филтрирајте по категорији, реткости и сортирајте по различитим својствима.",
    hr: "Pregledajte i pretražujte sve predmete iz Arc Raiders. Filtrirajte po kategoriji, rijetkosti i sortirajte po različitim svojstvima.",
  };

  // Crear alternates para todos los idiomas
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/items`;
  });

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `/${lang}/items`,
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

export default async function ItemsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const items = await getItems();

  const pageTexts: Record<Locale, { title: string; subtitle: string; loading: string; noData: string }> = {
    en: { title: "Items Database", subtitle: "Browse all items from Arc Raiders", loading: "Loading items...", noData: "No items data available yet." },
    es: {
      title: "Base de Datos de Objetos",
      subtitle: "Explora todos los objetos de Arc Raiders",
      loading: "Cargando objetos...",
      noData: "No hay datos de objetos disponibles aún.",
    },
    de: {
      title: "Gegenstandsdatenbank",
      subtitle: "Durchsuchen Sie alle Gegenstände von Arc Raiders",
      loading: "Gegenstände werden geladen...",
      noData: "Noch keine Gegenstandsdaten verfügbar.",
    },
    fr: {
      title: "Base de Données d'Objets",
      subtitle: "Parcourez tous les objets d'Arc Raiders",
      loading: "Chargement des objets...",
      noData: "Aucune donnée d'objet disponible pour le moment.",
    },
    pt: {
      title: "Banco de Dados de Itens",
      subtitle: "Navegue por todos os itens do Arc Raiders",
      loading: "Carregando itens...",
      noData: "Nenhum dado de item disponível ainda.",
    },
    pl: {
      title: "Baza Przedmiotów",
      subtitle: "Przeglądaj wszystkie przedmioty z Arc Raiders",
      loading: "Ładowanie przedmiotów...",
      noData: "Brak dostępnych danych o przedmiotach.",
    },
    no: {
      title: "Gjenstandsdatabase",
      subtitle: "Bla gjennom alle gjenstander fra Arc Raiders",
      loading: "Laster gjenstander...",
      noData: "Ingen gjenstandsdata tilgjengelig ennå.",
    },
    da: { title: "Genstands Database", subtitle: "Gennemse alle genstande fra Arc Raiders", loading: "Indlæser genstande...", noData: "Ingen genstandsdata tilgængelig endnu." },
    it: { title: "Database Oggetti", subtitle: "Sfoglia tutti gli oggetti di Arc Raiders", loading: "Caricamento oggetti...", noData: "Nessun dato oggetto disponibile ancora." },
    uk: { title: "База Даних Предметів", subtitle: "Переглядайте всі предмети з Arc Raiders", loading: "Завантаження предметів...", noData: "Дані предметів ще недоступні." },
    kr: { title: "아이템 데이터베이스", subtitle: "Arc Raiders의 모든 아이템 찾아보기", loading: "아이템 로딩 중...", noData: "아이템 데이터가 아직 없습니다." },
    ru: { title: "База Данных Предметов", subtitle: "Просмотрите все предметы из Arc Raiders", loading: "Загрузка предметов...", noData: "Данные предметов пока недоступны." },
    "zh-CN": { title: "物品数据库", subtitle: "浏览Arc Raiders的所有物品", loading: "加载物品中...", noData: "暂无物品数据。" },
    ja: { title: "アイテムデータベース", subtitle: "Arc Raidersのすべてのアイテムを閲覧", loading: "アイテム読み込み中...", noData: "アイテムデータはまだありません。" },
    tr: { title: "Eşya Veritabanı", subtitle: "Arc Raiders'tan tüm eşyalara göz atın", loading: "Eşyalar yükleniyor...", noData: "Henüz eşya verisi yok." },
    "zh-TW": { title: "物品資料庫", subtitle: "瀏覽Arc Raiders的所有物品", loading: "載入物品中...", noData: "暫無物品資料。" },
    sr: { title: "База Предмета", subtitle: "Прегледајте све предмете из Arc Raiders", loading: "Учитавање предмета...", noData: "Подаци о предметима још нису доступни." },
    hr: { title: "Baza Predmeta", subtitle: "Pregledajte sve predmete iz Arc Raiders", loading: "Učitavanje predmeta...", noData: "Podaci o predmetima još nisu dostupni." },
  };

  const texts = pageTexts[lang];

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-300 mb-4">{texts.title}</h1>
          <p className="text-gray-400 text-lg">{texts.subtitle}</p>
        </div>

        {items.length === 0 ? (
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
            <ItemsFilter items={items} lang={lang} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
