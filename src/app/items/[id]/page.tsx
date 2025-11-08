import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ItemDetailView from "@/components/items/ItemDetailView";
import { Item } from "@/components/items/types";

interface ItemPageProps {
  params: {
    id: string;
  };
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

function getText(text: any): string {
  if (typeof text === "string") return text;
  if (typeof text === "object" && text !== null) {
    return text.en || text.es || Object.values(text)[0] || "";
  }
  return "";
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { id } = await params;
  const items = await getItems();
  const item = items.find((i) => i.id === id);

  if (!item) {
    return {
      title: "Item Not Found - Arc Raiders Kits",
    };
  }

  const itemName = getText(item.name);
  const itemDescription = getText(item.description);
  const rarity = item.rarity || "Unknown";
  const type = item.type || "Item";

  return {
    title: `${itemName} - ${type} - Arc Raiders Kits`,
    description:
      itemDescription || `${itemName} is a ${rarity} ${type} in Arc Raiders. ${item.value ? `Value: ${item.value}.` : ""} ${item.weightKg ? `Weight: ${item.weightKg}kg.` : ""}`,
    keywords: ["Arc Raiders", itemName, type, rarity, "item", "database", item.category || ""].filter(Boolean),
    openGraph: {
      title: `${itemName} - Arc Raiders Kits`,
      description: itemDescription || `${rarity} ${type} in Arc Raiders`,
      type: "website",
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

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params;
  const items = await getItems();
  const item = items.find((i) => i.id === id);

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
        <ItemDetailView item={item} relatedItems={relatedItems} allItems={items} />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const items = await getItems();
  return items.map((item) => ({
    id: item.id,
  }));
}
