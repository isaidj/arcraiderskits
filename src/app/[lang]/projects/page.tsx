import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import { Locale, locales } from "@/config/i18n";

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

// Generate static params for all languages
export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale,
  }));
}

// Dynamic metadata by language
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Locale, string> = {
    en: "Projects - Arc Raiders Kits",
    es: "Proyectos - Arc Raiders Kits",
    de: "Projekte - Arc Raiders Kits",
    fr: "Projets - Arc Raiders Kits",
    pt: "Projetos - Arc Raiders Kits",
    pl: "Projekty - Arc Raiders Kits",
    no: "Prosjekter - Arc Raiders Kits",
    da: "Projekter - Arc Raiders Kits",
    it: "Progetti - Arc Raiders Kits",
    uk: "Проекти - Arc Raiders Kits",
    kr: "프로젝트 - Arc Raiders Kits",
    ru: "Проекты - Arc Raiders Kits",
    "zh-CN": "项目 - Arc Raiders Kits",
    ja: "プロジェクト - Arc Raiders Kits",
    tr: "Projeler - Arc Raiders Kits",
    "zh-TW": "專案 - Arc Raiders Kits",
    sr: "Пројекти - Arc Raiders Kits",
    hr: "Projekti - Arc Raiders Kits",
  };

  const descriptions: Record<Locale, string> = {
    en: "Explore and build projects in Arc Raiders. Complete phases and requirements to unlock new capabilities.",
    es: "Explora y construye proyectos en Arc Raiders. Completa fases y requisitos para desbloquear nuevas capacidades.",
    de: "Erkunden und bauen Sie Projekte in Arc Raiders. Erfüllen Sie Phasen und Anforderungen, um neue Fähigkeiten freizuschalten.",
    fr: "Explorez et construisez des projets dans Arc Raiders. Terminez les phases et les exigences pour débloquer de nouvelles capacités.",
    pt: "Explore e construa projetos em Arc Raiders. Complete fases e requisitos para desbloquear novas capacidades.",
    pl: "Poznaj i buduj projekty w Arc Raiders. Ukończ fazy i wymagania, aby odblokować nowe możliwości.",
    no: "Utforsk og bygg prosjekter i Arc Raiders. Fullfør faser og krav for å låse opp nye evner.",
    da: "Udforsk og byg projekter i Arc Raiders. Fuldfør faser og krav for at låse nye evner op.",
    it: "Esplora e costruisci progetti in Arc Raiders. Completa fasi e requisiti per sbloccare nuove capacità.",
    uk: "Досліджуйте та будуйте проекти в Arc Raiders. Виконуйте фази та вимоги, щоб розблокувати нові можливості.",
    kr: "Arc Raiders의 프로젝트를 탐색하고 구축하세요. 단계와 요구 사항을 완료하여 새로운 기능을 잠금 해제하세요.",
    ru: "Исследуйте и создавайте проекты в Arc Raiders. Выполняйте этапы и требования, чтобы разблокировать новые возможности.",
    "zh-CN": "在Arc Raiders中探索和构建项目。完成阶段和要求以解锁新功能。",
    ja: "Arc Raidersでプロジェクトを探索し、構築します。フェーズと要件を完了して、新しい機能をアンロックします。",
    tr: "Arc Raiders'ta projeleri keşfedin ve oluşturun. Yeni yetenekleri açmak için aşamaları ve gereksinimleri tamamlayın.",
    "zh-TW": "在Arc Raiders中探索和建構專案。完成階段和要求以解鎖新功能。",
    sr: "Истражите и градите пројекте у Arc Raiders. Завршите фазе и захтеве да откључате нове могућности.",
    hr: "Istražite i gradite projekte u Arc Raiders. Završite faze i zahtjeve kako biste otključali nove sposobnosti.",
  };

  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/projects`;
  });

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `/${lang}/projects`,
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

export default async function ProjectsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const projects = await getProjects();

  const pageTexts: Record<Locale, { title: string; subtitle: string; viewDetails: string; phases: string; phase: string }> = {
    en: { title: "Projects", subtitle: "Build and advance your capabilities", viewDetails: "View Details", phases: "Phases", phase: "Phase" },
    es: { title: "Proyectos", subtitle: "Construye y avanza tus capacidades", viewDetails: "Ver Detalles", phases: "Fases", phase: "Fase" },
    de: { title: "Projekte", subtitle: "Bauen und erweitern Sie Ihre Fähigkeiten", viewDetails: "Details anzeigen", phases: "Phasen", phase: "Phase" },
    fr: { title: "Projets", subtitle: "Construisez et développez vos capacités", viewDetails: "Voir les détails", phases: "Phases", phase: "Phase" },
    pt: { title: "Projetos", subtitle: "Construa e avance suas capacidades", viewDetails: "Ver Detalhes", phases: "Fases", phase: "Fase" },
    pl: { title: "Projekty", subtitle: "Buduj i rozwijaj swoje możliwości", viewDetails: "Zobacz szczegóły", phases: "Fazy", phase: "Faza" },
    no: { title: "Prosjekter", subtitle: "Bygg og utvid dine evner", viewDetails: "Se detaljer", phases: "Faser", phase: "Fase" },
    da: { title: "Projekter", subtitle: "Byg og fremskridt dine evner", viewDetails: "Se detaljer", phases: "Faser", phase: "Fase" },
    it: { title: "Progetti", subtitle: "Costruisci e avanza le tue capacità", viewDetails: "Vedi dettagli", phases: "Fasi", phase: "Fase" },
    uk: { title: "Проекти", subtitle: "Будуйте та розвивайте свої можливості", viewDetails: "Переглянути деталі", phases: "Фази", phase: "Фаза" },
    kr: { title: "프로젝트", subtitle: "능력을 구축하고 발전시키세요", viewDetails: "세부 정보 보기", phases: "단계", phase: "단계" },
    ru: { title: "Проекты", subtitle: "Стройте и развивайте свои возможности", viewDetails: "Подробнее", phases: "Этапы", phase: "Этап" },
    "zh-CN": { title: "项目", subtitle: "建设并提升您的能力", viewDetails: "查看详情", phases: "阶段", phase: "阶段" },
    ja: { title: "プロジェクト", subtitle: "能力を構築し、前進させましょう", viewDetails: "詳細を見る", phases: "フェーズ", phase: "フェーズ" },
    tr: { title: "Projeler", subtitle: "Yeteneklerinizi geliştirin ve ilerletin", viewDetails: "Detayları Gör", phases: "Aşamalar", phase: "Aşama" },
    "zh-TW": { title: "專案", subtitle: "建設並提升您的能力", viewDetails: "查看詳情", phases: "階段", phase: "階段" },
    sr: { title: "Пројекти", subtitle: "Градите и развијајте своје могућности", viewDetails: "Погледај детаље", phases: "Фазе", phase: "Фаза" },
    hr: { title: "Projekti", subtitle: "Gradite i razvijajte svoje sposobnosti", viewDetails: "Vidi detalje", phases: "Faze", phase: "Faza" },
  };

  const texts = pageTexts[lang];

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00ffff] mb-4">{texts.title}</h1>
          <p className="text-gray-400 text-lg">{texts.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => {
            const name = typeof project.name === "object" ? project.name[lang] || project.name.en : project.name;
            const description = typeof project.description === "object" ? project.description[lang] || project.description.en : project.description;

            return (
              <div
                key={project.id}
                className="bg-[#0d111d]/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-[#00ffff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#00ffff] mb-2">{name}</h2>
                    {description && <p className="text-gray-300 mb-4">{description}</p>}
                  </div>
                </div>

                {project.phases && project.phases.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-[#00ffff] mb-3">
                      {texts.phases}: {project.phases.length}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {project.phases.map((phase) => {
                        const phaseName = typeof phase.name === "object" ? phase.name[lang] || phase.name.en : phase.name;
                        return (
                          <div key={phase.phase} className="bg-gray-900/50 border border-gray-700 rounded p-3">
                            <span className="text-[#00ffff] font-semibold">
                              {texts.phase} {phase.phase}:
                            </span>{" "}
                            <span className="text-gray-300">{phaseName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <Link
                    href={`/${lang}/projects/${project.id}`}
                    className="inline-block bg-[#00ffff] text-black px-6 py-2 rounded font-semibold hover:bg-[#00dddd] transition-colors"
                  >
                    {texts.viewDetails}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
