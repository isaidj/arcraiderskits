import Image from "next/image";
import Link from "next/link";
import { Bot, ThreatColors } from "./types";
import { getText, generateSlug, getBotImage } from "./utils";
import { Locale } from "@/config/i18n";
import BotPopover from "./BotPopover";

interface BotCardProps {
  bot: Bot;
  lang?: Locale;
  threatColors: ThreatColors;
}

export default function BotCard({ bot, lang, threatColors }: BotCardProps) {
  const botName = getText(bot.name, lang);
  const slug = generateSlug(bot.name, bot.id);
  const botUrl = lang ? `/${lang}/arc/${slug}` : `/arc/${slug}`;

  return (
    <BotPopover bot={bot} lang={lang}>
      <div className="w-full aspect-square">
        <Link href={botUrl} className="h-full w-full group relative flex flex-col cursor-pointer">
          <div
            className={`card-chrome-border h-full w-full relative flex flex-col bg-[#0d111d]/50 backdrop-blur-xs will-change-[backdrop-filter] transform-gpu ${threatColors.gradient} border-2 ${threatColors.border} rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 ${threatColors.shadow}`}
          >
            {/* Marca decorativa curva en esquina inferior izquierda */}
            <div className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none rounded-bl-sm overflow-hidden z-10">
              <svg viewBox="0 0 100 100" className="w-full h-full group-hover:opacity-100 opacity-70 transition-opacity">
                <path d="M 0 100 L 0 0 Q 0 100 100 100 Z" fill={threatColors.color} />
              </svg>
            </div>

            {/* Imagen del bot - ocupa toda la card */}
            {bot.image && (
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <Image
                  src={getBotImage(bot)}
                  alt={botName || "Bot"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />

                {/* Overlay gradient para mejorar legibilidad del texto */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
              </div>
            )}

            {/* Información del bot en la parte inferior */}
            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1 z-10">
              <h3 className="text-base font-bold text-gray-100 truncate drop-shadow-lg">{botName || "Unknown Bot"}</h3>

              <div className="flex items-center justify-between text-xs">
                {bot.type && <span className="text-gray-300 truncate flex-1 mr-2 drop-shadow-md">{bot.type}</span>}
                {bot.threat && <span className={`px-2 py-0.5 rounded text-xs font-bold ${threatColors.bg} text-white shadow-lg`}>{bot.threat}</span>}
              </div>
            </div>

            {/* Badge de tipo de amenaza en esquina superior derecha */}
            {/* <div className="absolute top-2 right-2 z-10">
              <div className={`px-2 py-1 rounded-md ${threatColors.bg} border ${threatColors.border} backdrop-blur-sm`}>
                <span className="text-white text-xs font-bold">{bot.threat.charAt(0)}</span>
              </div>
            </div> */}
          </div>
        </Link>
      </div>
    </BotPopover>
  );
}
