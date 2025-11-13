import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Locale, locales } from "@/config/i18n";
import BackButton from "@/components/BackButton";

interface Phase {
  phase: number;
  name: { [key: string]: string };
  description?: { [key: string]: string };
  requirementItemIds?: Array<{ itemId: string; quantity: number }>;
}

interface Project {
  id: string;
  name: { [key: string]: string };
  description?: { [key: string]: string };
  phases?: Phase[];
}

interface Item {
  id: string;
  name: string | { [key: string]: string };
  imageFilename?: string;
}

async function getProjects(): Promise<Project[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "projects.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading projects:", error);
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

export async function generateStaticParams() {
  const projects = await getProjects();
  const params = [];

  for (const locale of locales) {
    for (const project of projects) {
      params.push({
        lang: locale,
        id: project.id,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return { title: "Project Not Found" };
  }

  const projectName = typeof project.name === "object" ? project.name[lang] || project.name.en : project.name;
  const title = `${projectName} - Arc Raiders Kits`;

  return {
    title,
    description: typeof project.description === "object" ? project.description[lang] || project.description.en : project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ lang: Locale; id: string }> }) {
  const { lang, id } = await params;
  const projects = await getProjects();
  const items = await getItems();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const pageTexts: Record<Locale, { phase: string; requirements: string; description: string; totalItems: string }> = {
    en: { phase: "Phase", requirements: "Requirements", description: "Description", totalItems: "Total Items" },
    es: { phase: "Fase", requirements: "Requisitos", description: "Descripción", totalItems: "Total de Objetos" },
    de: { phase: "Phase", requirements: "Anforderungen", description: "Beschreibung", totalItems: "Gesamtgegenstände" },
    fr: { phase: "Phase", requirements: "Exigences", description: "Description", totalItems: "Total des objets" },
    pt: { phase: "Fase", requirements: "Requisitos", description: "Descrição", totalItems: "Total de Itens" },
    pl: { phase: "Faza", requirements: "Wymagania", description: "Opis", totalItems: "Całkowita liczba przedmiotów" },
    no: { phase: "Fase", requirements: "Krav", description: "Beskrivelse", totalItems: "Totalt antall gjenstander" },
    da: { phase: "Fase", requirements: "Krav", description: "Beskrivelse", totalItems: "Samlet antal genstande" },
    it: { phase: "Fase", requirements: "Requisiti", description: "Descrizione", totalItems: "Totale Oggetti" },
    uk: { phase: "Фаза", requirements: "Вимоги", description: "Опис", totalItems: "Загалом предметів" },
    kr: { phase: "단계", requirements: "요구 사항", description: "설명", totalItems: "총 아이템" },
    ru: { phase: "Этап", requirements: "Требования", description: "Описание", totalItems: "Всего предметов" },
    "zh-CN": { phase: "阶段", requirements: "要求", description: "描述", totalItems: "总物品" },
    ja: { phase: "フェーズ", requirements: "要件", description: "説明", totalItems: "総アイテム" },
    tr: { phase: "Aşama", requirements: "Gereksinimler", description: "Açıklama", totalItems: "Toplam Eşya" },
    "zh-TW": { phase: "階段", requirements: "要求", description: "描述", totalItems: "總物品" },
    sr: { phase: "Фаза", requirements: "Захтеви", description: "Опис", totalItems: "Укупно предмета" },
    hr: { phase: "Faza", requirements: "Zahtjevi", description: "Opis", totalItems: "Ukupno predmeta" },
  };

  const texts = pageTexts[lang];
  const projectName = typeof project.name === "object" ? project.name[lang] || project.name.en : project.name;
  const projectDescription = typeof project.description === "object" ? project.description[lang] || project.description.en : project.description;

  const getItemDetails = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return { name: itemId, image: null };

    const name = typeof item.name === "object" ? item.name[lang] || item.name.en : item.name;
    const image = item.imageFilename ? `/data/images/items/${item.imageFilename}` : null;

    return { name, image };
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <BackButton lang={lang} />

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00ffff] mb-4">{projectName}</h1>
          {projectDescription && <p className="text-gray-300 text-lg max-w-3xl mx-auto">{projectDescription}</p>}
        </div>

        {project.phases && project.phases.length > 0 && (
          <div className="space-y-6">
            {project.phases.map((phase) => {
              const phaseName = typeof phase.name === "object" ? phase.name[lang] || phase.name.en : phase.name;
              const phaseDescription = phase.description && typeof phase.description === "object" ? phase.description[lang] || phase.description.en : phase.description;

              return (
                <div key={phase.phase} className="bg-[#0d111d]/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-[#00ffff] transition-all duration-300">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-[#00ffff] mb-2">
                      {texts.phase} {phase.phase}: {phaseName}
                    </h2>
                    {phaseDescription && <p className="text-gray-400">{phaseDescription}</p>}
                  </div>

                  {phase.requirementItemIds && phase.requirementItemIds.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-3">{texts.requirements}:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {phase.requirementItemIds.map((req) => {
                          const { name, image } = getItemDetails(req.itemId);
                          return (
                            <div key={req.itemId} className="bg-gray-900/50 border border-gray-700 rounded p-3 flex items-center gap-3">
                              {image && <img src={image} alt={name} className="w-12 h-12 object-contain" />}
                              <div className="flex-1">
                                <p className="text-gray-300 text-sm">{name}</p>
                                <p className="text-[#00ffff] font-semibold">x{req.quantity}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
