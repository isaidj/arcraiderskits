import { Suspense } from "react";
import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import { Quest } from "@/components/quests/types";
import QuestsFilter from "@/components/quests/QuestsFilter";
import { Locale, locales } from "@/config/i18n";

async function getQuests(): Promise<Quest[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "quests.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading quests:", error);
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
    en: "Quests & Missions - Arc Raiders Kits",
    es: "Misiones y Tareas - Arc Raiders Kits",
    de: "Quests & Missionen - Arc Raiders Kits",
    fr: "Quêtes & Missions - Arc Raiders Kits",
    pt: "Missões e Tarefas - Arc Raiders Kits",
    pl: "Zadania i Misje - Arc Raiders Kits",
    no: "Oppdrag & Misjoner - Arc Raiders Kits",
    da: "Quest & Missioner - Arc Raiders Kits",
    it: "Missioni e Quest - Arc Raiders Kits",
    uk: "Квести та Місії - Arc Raiders Kits",
    kr: "퀘스트 및 임무 - Arc Raiders Kits",
    ru: "Квесты и Миссии - Arc Raiders Kits",
    "zh-CN": "任务和使命 - Arc Raiders Kits",
    ja: "クエストとミッション - Arc Raiders Kits",
    tr: "Görevler ve Misyonlar - Arc Raiders Kits",
    "zh-TW": "任務和使命 - Arc Raiders Kits",
    sr: "Задаци и Мисије - Arc Raiders Kits",
    hr: "Zadaci i Misije - Arc Raiders Kits",
  };

  const descriptions: Record<Locale, string> = {
    en: "Browse all Arc Raiders quests and missions. Complete objectives, earn rewards, and progress through quest chains.",
    es: "Explora todas las misiones de Arc Raiders. Completa objetivos, gana recompensas y progresa en cadenas de misiones.",
    de: "Durchsuchen Sie alle Arc Raiders Quests und Missionen. Erfüllen Sie Ziele, verdienen Sie Belohnungen und schreiten Sie durch Questketten voran.",
    fr: "Parcourez toutes les quêtes et missions d'Arc Raiders. Accomplissez des objectifs, gagnez des récompenses et progressez dans les chaînes de quêtes.",
    pt: "Navegue por todas as missões do Arc Raiders. Complete objetivos, ganhe recompensas e progrida através de cadeias de missões.",
    pl: "Przeglądaj wszystkie zadania i misje Arc Raiders. Wykonuj cele, zdobywaj nagrody i rozwijaj się przez łańcuchy zadań.",
    no: "Bla gjennom alle Arc Raiders oppdrag og misjoner. Fullfør mål, tjen belønninger og gå videre gjennom oppdragskjeder.",
    da: "Gennemse alle Arc Raiders quest og missioner. Fuldfør mål, optjen belønninger og avancer gennem questkæder.",
    it: "Sfoglia tutte le missioni e quest di Arc Raiders. Completa obiettivi, guadagna ricompense e progredisci attraverso catene di quest.",
    uk: "Переглядайте всі квести та місії Arc Raiders. Виконуйте завдання, отримуйте винагороди та просувайтесь ланцюгами квестів.",
    kr: "모든 Arc Raiders 퀘스트와 임무를 찾아보세요. 목표를 완료하고 보상을 받으며 퀘스트 체인을 진행하세요.",
    ru: "Просматривайте все квесты и миссии Arc Raiders. Выполняйте задачи, зарабатывайте награды и продвигайтесь по цепочкам квестов.",
    "zh-CN": "浏览所有Arc Raiders任务和使命。完成目标，获得奖励，并在任务链中进步。",
    ja: "Arc Raidersのすべてのクエストとミッションを閲覧できます。目標を達成し、報酬を獲得し、クエストチェーンを進めます。",
    tr: "Tüm Arc Raiders görevlerini ve misyonlarını göz atın. Hedefleri tamamlayın, ödüller kazanın ve görev zincirlerinde ilerleyin.",
    "zh-TW": "瀏覽所有Arc Raiders任務和使命。完成目標，獲得獎勵，並在任務鏈中進步。",
    sr: "Прегледајте све Arc Raiders задатке и мисије. Испуните циљеве, зарадите награде и напредујте кроз ланце задатака.",
    hr: "Pregledajte sve Arc Raiders zadatke i misije. Ispunite ciljeve, zaradite nagrade i napredujte kroz lance zadataka.",
  };

  // Crear alternates para todos los idiomas
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/quests`;
  });

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `/${lang}/quests`,
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

export default async function QuestsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const quests = await getQuests();

  const pageTexts: Record<Locale, { title: string; subtitle: string; loading: string }> = {
    en: { title: "📜 Quests & Missions", subtitle: "Complete quests and earn rewards from traders", loading: "Loading quests..." },
    es: { title: "📜 Misiones y Tareas", subtitle: "Completa misiones y gana recompensas de los comerciantes", loading: "Cargando misiones..." },
    de: { title: "📜 Quests & Missionen", subtitle: "Erfüllen Sie Quests und verdienen Sie Belohnungen von Händlern", loading: "Quests werden geladen..." },
    fr: { title: "📜 Quêtes & Missions", subtitle: "Accomplissez des quêtes et gagnez des récompenses des commerçants", loading: "Chargement des quêtes..." },
    pt: { title: "📜 Missões e Tarefas", subtitle: "Complete missões e ganhe recompensas dos comerciantes", loading: "Carregando missões..." },
    pl: { title: "📜 Zadania i Misje", subtitle: "Wykonuj zadania i zdobywaj nagrody od handlarzy", loading: "Ładowanie zadań..." },
    no: { title: "📜 Oppdrag & Misjoner", subtitle: "Fullfør oppdrag og tjen belønninger fra handelsmenn", loading: "Laster oppdrag..." },
    da: { title: "📜 Quest & Missioner", subtitle: "Fuldfør quest og optjen belønninger fra handelsmænd", loading: "Indlæser quest..." },
    it: { title: "📜 Missioni e Quest", subtitle: "Completa le missioni e guadagna ricompense dai mercanti", loading: "Caricamento missioni..." },
    uk: { title: "📜 Квести та Місії", subtitle: "Виконуйте квести та отримуйте винагороди від торговців", loading: "Завантаження квестів..." },
    kr: { title: "📜 퀘스트 및 임무", subtitle: "퀘스트를 완료하고 상인으로부터 보상을 받으세요", loading: "퀘스트 로딩 중..." },
    ru: { title: "📜 Квесты и Миссии", subtitle: "Выполняйте квесты и получайте награды от торговцев", loading: "Загрузка квестов..." },
    "zh-CN": { title: "📜 任务和使命", subtitle: "完成任务并从商人那里获得奖励", loading: "加载任务中..." },
    ja: { title: "📜 クエストとミッション", subtitle: "クエストを完了してトレーダーから報酬を獲得", loading: "クエスト読み込み中..." },
    tr: { title: "📜 Görevler ve Misyonlar", subtitle: "Görevleri tamamlayın ve tüccarlardan ödüller kazanın", loading: "Görevler yükleniyor..." },
    "zh-TW": { title: "📜 任務和使命", subtitle: "完成任務並從商人那裡獲得獎勵", loading: "載入任務中..." },
    sr: { title: "📜 Задаци и Мисије", subtitle: "Испуните задатке и зарадите награде од трговаца", loading: "Учитавање задатака..." },
    hr: { title: "📜 Zadaci i Misije", subtitle: "Ispunite zadatke i zaradite nagrade od trgovaca", loading: "Učitavanje zadataka..." },
  };

  const texts = pageTexts[lang];

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00ffff] mb-4">{texts.title}</h1>
          <p className="text-gray-400 text-lg">{texts.subtitle}</p>
        </div>

        {/* Filter and Grid */}
        <Suspense
          fallback={
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffff]"></div>
              <p className="text-gray-400 mt-4">{texts.loading}</p>
            </div>
          }
        >
          <QuestsFilter quests={quests} lang={lang} />
        </Suspense>
      </div>
    </main>
  );
}
