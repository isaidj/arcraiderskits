import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ItemDetailView from "@/components/items/ItemDetailView";
import { Item } from "@/components/items/types";
import { Locale, locales } from "@/config/i18n";
import { generateSlug } from "@/components/items/utils";

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

function getText(text: any, lang: Locale): string {
  if (typeof text === "string") return text;
  if (typeof text === "object" && text !== null) {
    return text[lang] || text.en || Object.values(text)[0] || "";
  }
  return "";
}

// Generar todos los parámetros estáticos (lang × item)
export async function generateStaticParams() {
  const items = await getItems();
  const params: { lang: string; id: string }[] = [];

  // Solo generar páginas estáticas para idiomas principales durante el build
  // Los demás idiomas se generarán bajo demanda (on-demand ISR)
  const primaryLocales = ["en", "es", "de", "fr", "pt"];

  for (const locale of primaryLocales) {
    for (const item of items) {
      const slug = generateSlug(item.name, item.id);
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

// Metadata dinámica por idioma e item
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const items = await getItems();

  // Buscar item por slug
  const item = items.find((i) => generateSlug(i.name, i.id) === id);

  if (!item) {
    const notFoundTitles: Record<Locale, string> = {
      en: "Item Not Found - Arc Raiders Kits",
      es: "Objeto No Encontrado - Arc Raiders Kits",
      de: "Gegenstand Nicht Gefunden - Arc Raiders Kits",
      fr: "Objet Non Trouvé - Arc Raiders Kits",
      pt: "Item Não Encontrado - Arc Raiders Kits",
      pl: "Przedmiot Nie Znaleziony - Arc Raiders Kits",
      no: "Gjenstand Ikke Funnet - Arc Raiders Kits",
      da: "Genstand Ikke Fundet - Arc Raiders Kits",
      it: "Oggetto Non Trovato - Arc Raiders Kits",
      uk: "Предмет Не Знайдено - Arc Raiders Kits",
      kr: "아이템을 찾을 수 없습니다 - Arc Raiders Kits",
      ru: "Предмет Не Найден - Arc Raiders Kits",
      "zh-CN": "未找到物品 - Arc Raiders Kits",
      ja: "アイテムが見つかりません - Arc Raiders Kits",
      tr: "Eşya Bulunamadı - Arc Raiders Kits",
      "zh-TW": "未找到物品 - Arc Raiders Kits",
      sr: "Предмет Није Пронађен - Arc Raiders Kits",
      hr: "Predmet Nije Pronađen - Arc Raiders Kits",
    };
    return {
      title: notFoundTitles[lang],
    };
  }

  const itemName = getText(item.name, lang);
  const itemDescription = getText(item.description, lang);
  const rarity = item.rarity || "Unknown";
  const type = item.type || "Item";

  // Crear alternates para todos los idiomas
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/items/${id}`;
  });

  return {
    title: `${itemName} - ${type} - Arc Raiders Kits`,
    description:
      itemDescription || `${itemName} is a ${rarity} ${type} in Arc Raiders. ${item.value ? `Value: ${item.value}.` : ""} ${item.weightKg ? `Weight: ${item.weightKg}kg.` : ""}`,
    keywords: ["Arc Raiders", itemName, type, rarity, "item", "database", item.category || ""].filter(Boolean),
    alternates: {
      canonical: `/${lang}/items/${id}`,
      languages,
    },
    openGraph: {
      title: `${itemName} - Arc Raiders Kits`,
      description: itemDescription || `${rarity} ${type} in Arc Raiders`,
      type: "website",
      locale: lang,
      images:
        item.imageFilename || item.image
          ? [
              {
                url: item.imageFilename || item.image || "",
                alt: itemName,
              },
            ]
          : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${itemName} - Arc Raiders Kits`,
      description: itemDescription || `${rarity} ${type} in Arc Raiders`,
      images: item.imageFilename || item.image ? [item.imageFilename || item.image || ""] : [],
    },
  };
}

export default async function ItemPage({ params }: { params: Promise<{ lang: Locale; id: string }> }) {
  const { lang, id } = await params;
  const items = await getItems();

  // Buscar item por slug
  const item = items.find((i) => generateSlug(i.name, i.id) === id);

  if (!item) {
    notFound();
  }

  // Encontrar items relacionados
  const relatedItems = items.filter((i) => {
    // Items que se obtienen al reciclar este item
    const obtainedFromRecycling = item.recyclesInto && Object.keys(item.recyclesInto).includes(i.id);

    // Items necesarios para reciclar en este
    const neededForRecycling = i.recyclesInto && Object.keys(i.recyclesInto).includes(item.id);

    return obtainedFromRecycling || neededForRecycling;
  });

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <ItemDetailView item={item} relatedItems={relatedItems} allItems={items} lang={lang} />
      </div>
    </main>
  );
}
