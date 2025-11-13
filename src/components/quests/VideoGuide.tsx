"use client";

import { useState, useEffect, useRef } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface VideoGuideProps {
  videoUrl?: string;
  searchQuery: string;
  lang?: string;
}

// Traducciones para el botón "Guía"
const guideTranslations: Record<string, string> = {
  en: "Guide",
  es: "Guía",
  de: "Anleitung",
  fr: "Guide",
  pt: "Guia",
  pl: "Przewodnik",
  no: "Veiledning",
  da: "Guide",
  it: "Guida",
  uk: "Посібник",
  kr: "가이드",
  ru: "Руководство",
  "zh-CN": "指南",
  ja: "ガイド",
  tr: "Rehber",
  "zh-TW": "指南",
  sr: "Водич",
  hr: "Vodič",
};

export default function VideoGuide({ videoUrl, searchQuery, lang = "en" }: VideoGuideProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const videoGuideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoUrl) {
      // Extraer ID del video de la URL proporcionada
      const id = extractYouTubeId(videoUrl);
      if (id) {
        setVideoId(id);
      }
    } else {
      // Si no hay videoUrl, buscar automáticamente
      searchYouTubeVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl, searchQuery]);

  // Detectar scroll para mostrar/ocultar botón
  useEffect(() => {
    const handleScroll = () => {
      if (videoGuideRef.current) {
        const rect = videoGuideRef.current.getBoundingClientRect();
        // Tolerancia: el botón se oculta solo cuando el video está visible con un margen de 200px
        const tolerance = 400;
        const heightMenu = 100; // altura estimada del menú u otros elementos fijos
        const isVisible = rect.top < window.innerHeight - tolerance && rect.bottom > tolerance;
        setShowFloatingButton(!isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check inicial

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToVideoGuide = () => {
    if (videoGuideRef.current) {
      const elementPosition = videoGuideRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 140; // 140px = altura de navbar (64px) + DataMenu (aprox 60px) + margen (16px)

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    // Patrones comunes de URLs de YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // ID directo
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const searchYouTubeVideo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Llamar a nuestra API route (con fallback automático en el servidor)
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await fetch(`/api/youtube-search?q=${encodedQuery}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to search videos");
      }

      const data = await response.json();

      if (data.videoId) {
        setVideoId(data.videoId);
        // Log opcional para ver qué fuente se usó (youtube o invidious)
        if (data.source) {
          console.log(`✅ Video loaded from: ${data.source}`);
        }
      } else {
        setError("No video guides found for this quest.");
      }
    } catch (err) {
      console.error("Error searching for video:", err);
      setError("Could not load video guide automatically. Try searching manually.");
    } finally {
      setIsLoading(false);
    }
  };

  const manualSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

  const guideText = guideTranslations[lang] || guideTranslations.en;

  return (
    <>
      {/* Botón Flotante */}
      {showFloatingButton && (
        <button onClick={scrollToVideoGuide} className="fixed bottom-6 right-6 z-50 group" aria-label={`Scroll to ${guideText}`}>
          <div className="relative">
            {/* Botón principal */}
            <div className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg shadow-red-600/50 flex items-center gap-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-red-600/60">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="font-bold text-sm">{guideText}</span>
            </div>

            {/* Anillo de pulso */}
            <div className="absolute inset-0 bg-red-600/30 rounded-full animate-ping" />
          </div>
        </button>
      )}

      {/* Contenedor del Video Guide */}
      <div ref={videoGuideRef} className="bg-[#0d111d]/50 backdrop-blur-sm   rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#00ffff] flex items-center gap-2">🎥 Video Guide</h2>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {/* Skeleton del reproductor */}
            <div className="relative card-chrome-border-active w-full rounded-lg overflow-hidden bg-black animate-pulse" style={{ aspectRatio: "16/9" }}>
              {/* Fondo oscuro con patrón sutil */}
              <div className="absolute inset-0 bg-linear-to-br from-gray-950 via-black to-gray-950" />

              {/* Patrón de ruido sutil */}
              <div className="absolute inset-0 opacity-50 bg-[url('/arcraiders_616x353.jpg')] bg-cover" />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Contenido */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6">
                {/* Spinner estilo loading */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center animate-pulse">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00ffff]"></div>
                  </div>
                </div>

                {/* Texto */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-gray-400">Loading video guide...</h3>
                </div>
              </div>
            </div>

            {/* Skeleton de la descripción */}
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        ) : videoId ? (
          <div className="space-y-4">
            <div className="relative card-chrome-border-active w-full rounded-lg overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
              <LiteYouTubeEmbed id={videoId} title={`${searchQuery} - Quest Guide`} poster="hqdefault" noCookie={true} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{videoUrl ? "Official guide" : "Auto-searched community guide"}</p>
              <a href={manualSearchUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00ffff] hover:text-[#00ffff]/80 transition-colors">
                🔍 Find more guides
              </a>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            {/* Reproductor Placeholder Clickeable */}
            <a
              href={manualSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative card-chrome-border-active w-full rounded-lg overflow-hidden bg-black group cursor-pointer transition-all hover:scale-[1.02]"
              style={{ aspectRatio: "16/9" }}
            >
              {/* Fondo oscuro con patrón sutil */}
              <div className="absolute inset-0 bg-linear-to-br from-gray-950 via-black to-gray-950" />

              {/* Patrón de ruido sutil */}
              <div className="absolute inset-0 opacity-50 bg-[url('/arcraiders_616x353.jpg')] bg-cover" />
              {/* Overlay hover */}
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all" />

              {/* Contenido */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6">
                {/* Botón Play grande estilo YouTube */}
                <div className="relative">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-all group-hover:scale-110 shadow-lg shadow-red-600/50">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  {/* Anillo de pulso */}
                  <div className="absolute inset-0 w-20 h-20 bg-red-600/30 rounded-full animate-ping" />
                </div>

                {/* Texto */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#e5a10f] transition-colors"> Play Video Guide</h3>
                </div>
              </div>
            </a>
          </div>
        ) : null}
      </div>
    </>
  );
}
