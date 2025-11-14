import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ItemDetailView from "@/components/items/ItemDetailView";
import TrackItemView from "@/components/TrackItemView";
import { Item } from "@/components/items/types";
import { Locale } from "@/config/i18n";
import { generateSlug } from "@/components/items/utils";
import { generateItemMetadata } from "./metadata";

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

  return generateItemMetadata(item, lang, id);
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
    <main className="min-h-screen pt-10 pb-20 px-4">
      <TrackItemView itemId={item.id} />
      <div className="container mx-auto max-w-7xl">
        <ItemDetailView item={item} relatedItems={relatedItems} allItems={items} lang={lang} />
      </div>
    </main>
  );
}
