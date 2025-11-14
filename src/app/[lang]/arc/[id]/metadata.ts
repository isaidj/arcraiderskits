import type { Metadata } from "next";
import { Bot } from "@/components/arc/types";
import { Locale, locales } from "@/config/i18n";
import { getText } from "@/components/arc/utils";

export function generateBotMetadata(bot: Bot | undefined, lang: Locale, slug: string): Metadata {
  if (!bot) {
    return {
      title: "Bot Not Found - Arc Raiders Kits",
      description: "The requested ARC bot could not be found.",
    };
  }

  const botName = getText(bot.name, lang);
  const botDescription = getText(bot.description, lang);

  const titleTemplates: Record<Locale, string> = {
    en: `${botName} - ARC Enemy - Arc Raiders Kits`,
    es: `${botName} - Enemigo ARC - Arc Raiders Kits`,
    de: `${botName} - ARC-Feind - Arc Raiders Kits`,
    fr: `${botName} - Ennemi ARC - Arc Raiders Kits`,
    pt: `${botName} - Inimigo ARC - Arc Raiders Kits`,
    pl: `${botName} - Wróg ARC - Arc Raiders Kits`,
    no: `${botName} - ARC-fiende - Arc Raiders Kits`,
    da: `${botName} - ARC-fjende - Arc Raiders Kits`,
    it: `${botName} - Nemico ARC - Arc Raiders Kits`,
    uk: `${botName} - Ворог ARC - Arc Raiders Kits`,
    kr: `${botName} - ARC 적 - Arc Raiders Kits`,
    ru: `${botName} - Враг ARC - Arc Raiders Kits`,
    "zh-CN": `${botName} - ARC敌人 - Arc Raiders Kits`,
    ja: `${botName} - ARC敵 - Arc Raiders Kits`,
    tr: `${botName} - ARC Düşmanı - Arc Raiders Kits`,
    "zh-TW": `${botName} - ARC敵人 - Arc Raiders Kits`,
    sr: `${botName} - ARC Непријатељ - Arc Raiders Kits`,
    hr: `${botName} - ARC Neprijatelj - Arc Raiders Kits`,
  };

  const descriptionTemplates: Record<Locale, (bot: Bot) => string> = {
    en: (b) => `${botDescription} Threat Level: ${b.threat}. Type: ${b.type}. Destroy XP: ${b.destroyXp}, Loot XP: ${b.lootXp}.`,
    es: (b) => `${botDescription} Nivel de Amenaza: ${b.threat}. Tipo: ${b.type}. XP por Destruir: ${b.destroyXp}, XP por Saqueo: ${b.lootXp}.`,
    de: (b) => `${botDescription} Bedrohungsstufe: ${b.threat}. Typ: ${b.type}. XP für Zerstörung: ${b.destroyXp}, XP für Beute: ${b.lootXp}.`,
    fr: (b) => `${botDescription} Niveau de menace: ${b.threat}. Type: ${b.type}. XP de destruction: ${b.destroyXp}, XP de butin: ${b.lootXp}.`,
    pt: (b) => `${botDescription} Nível de Ameaça: ${b.threat}. Tipo: ${b.type}. XP de Destruição: ${b.destroyXp}, XP de Saque: ${b.lootXp}.`,
    pl: (b) => `${botDescription} Poziom zagrożenia: ${b.threat}. Typ: ${b.type}. XP za zniszczenie: ${b.destroyXp}, XP za łup: ${b.lootXp}.`,
    no: (b) => `${botDescription} Trusselsnivå: ${b.threat}. Type: ${b.type}. XP for ødeleggelse: ${b.destroyXp}, XP for bytte: ${b.lootXp}.`,
    da: (b) => `${botDescription} Trusselsniveau: ${b.threat}. Type: ${b.type}. XP for ødelæggelse: ${b.destroyXp}, XP for bytte: ${b.lootXp}.`,
    it: (b) => `${botDescription} Livello di minaccia: ${b.threat}. Tipo: ${b.type}. XP distruzione: ${b.destroyXp}, XP bottino: ${b.lootXp}.`,
    uk: (b) => `${botDescription} Рівень загрози: ${b.threat}. Тип: ${b.type}. XP за знищення: ${b.destroyXp}, XP за здобич: ${b.lootXp}.`,
    kr: (b) => `${botDescription} 위협 수준: ${b.threat}. 유형: ${b.type}. 파괴 XP: ${b.destroyXp}, 전리품 XP: ${b.lootXp}.`,
    ru: (b) => `${botDescription} Уровень угрозы: ${b.threat}. Тип: ${b.type}. XP за уничтожение: ${b.destroyXp}, XP за добычу: ${b.lootXp}.`,
    "zh-CN": (b) => `${botDescription} 威胁等级：${b.threat}。类型：${b.type}。摧毁XP：${b.destroyXp}，掠夺XP：${b.lootXp}。`,
    ja: (b) => `${botDescription} 脅威レベル：${b.threat}。タイプ：${b.type}。破壊XP：${b.destroyXp}、戦利品XP：${b.lootXp}。`,
    tr: (b) => `${botDescription} Tehdit Seviyesi: ${b.threat}. Tür: ${b.type}. Yok Etme XP: ${b.destroyXp}, Ganimet XP: ${b.lootXp}.`,
    "zh-TW": (b) => `${botDescription} 威脅等級：${b.threat}。類型：${b.type}。摧毀XP：${b.destroyXp}，掠奪XP：${b.lootXp}。`,
    sr: (b) => `${botDescription} Ниво претње: ${b.threat}. Тип: ${b.type}. XP за уништавање: ${b.destroyXp}, XP за плен: ${b.lootXp}.`,
    hr: (b) => `${botDescription} Razina prijetnje: ${b.threat}. Vrsta: ${b.type}. XP za uništenje: ${b.destroyXp}, XP za plijen: ${b.lootXp}.`,
  };

  const title = titleTemplates[lang];
  const description = descriptionTemplates[lang](bot);

  // Crear alternates para todos los idiomas
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `/${locale}/arc/${slug}`;
  });

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/arc/${slug}`,
      languages,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: lang,
      images: bot.image ? [{ url: bot.image, alt: botName }] : undefined,
    },
  };
}
