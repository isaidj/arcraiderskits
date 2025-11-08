import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
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
