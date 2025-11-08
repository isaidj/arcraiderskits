import { promises as fs } from "fs";
import path from "path";
import { Suspense } from "react";
import type { Metadata } from "next";
import ItemsFilter from "@/components/ItemsFilter";

export const metadata: Metadata = {
  title: "Items Database - Arc Raiders Kits",
  description: "Browse and search through all items from Arc Raiders. Filter by category, rarity, and sort by various properties including value, weight, and name.",
  keywords: ["Arc Raiders", "items", "database", "loot", "weapons", "materials", "resources", "game items"],
  openGraph: {
    title: "Items Database - Arc Raiders Kits",
    description: "Browse and search through all items from Arc Raiders",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Items Database - Arc Raiders Kits",
    description: "Browse and search through all items from Arc Raiders",
  },
};

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

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <>
      <main className="min-h-screen pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-300 mb-4">Items Database</h1>
            <p className="text-gray-400 text-lg">Browse all items from Arc Raiders</p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-4">No items data available yet.</p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="text-center py-20">
                  <p className="text-gray-400 text-xl">Loading items...</p>
                </div>
              }
            >
              <ItemsFilter items={items} />
            </Suspense>
          )}
        </div>
      </main>
    </>
  );
}
