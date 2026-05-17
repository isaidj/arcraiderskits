import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HideoutModuleDetailView from "@/components/hideout-modules/HideoutModuleDetailView";
import { HideoutModule } from "@/components/hideout-modules/types";
import { Item } from "@/components/items/types";
import { Locale } from "@/config/i18n";
import { generateSlug } from "@/components/hideout-modules/utils";
import { generateHideoutModuleMetadata } from "./metadata";

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

// Generate all static params (lang × module)
export async function generateStaticParams() {
  const modules = await getHideoutModules();
  const params: { lang: string; id: string }[] = [];

  // Only generate static pages for primary languages during build
  // Other languages will be generated on-demand (on-demand ISR)
  const primaryLocales = ["en", "es", "de", "fr", "pt"];

  for (const locale of primaryLocales) {
    for (const module of modules) {
      const slug = generateSlug(module.name, module.id);
      params.push({
        lang: locale,
        id: slug,
      });
    }
  }

  return params;
}

// Configure dynamic generation for other languages
export const dynamicParams = true;

// Dynamic metadata per language and module
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const modules = await getHideoutModules();

  // Find module by slug
  const module = modules.find((m) => generateSlug(m.name, m.id) === id);

  return generateHideoutModuleMetadata(module, lang, id);
}

export default async function HideoutModulePage({ params }: { params: Promise<{ lang: Locale; id: string }> }) {
  const { lang, id } = await params;
  const modules = await getHideoutModules();
  const items = await getItems();

  // Find module by slug
  const module = modules.find((m) => generateSlug(m.name, m.id) === id);

  if (!module) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-10 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <HideoutModuleDetailView module={module} allItems={items} lang={lang} />
      </div>
    </main>
  );
}
