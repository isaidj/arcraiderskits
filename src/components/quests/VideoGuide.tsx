"use client";

import { useState, useEffect } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface VideoGuideProps {
  videoUrl?: string;
  searchQuery: string;
}

export default function VideoGuide({ videoUrl, searchQuery }: VideoGuideProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Llamar a nuestra API route
      const encodedQuery = encodeURIComponent(searchQuery);
      const response = await fetch(`/api/youtube-search?q=${encodedQuery}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to search videos");
      }

      const data = await response.json();

      if (data.videoId) {
        setVideoId(data.videoId);
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

  return (
    <div className="bg-[#0d111d]/50 backdrop-blur-sm   rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#00ffff] flex items-center gap-2">🎥 Video Guide</h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffff]"></div>
          <p className="text-gray-400 text-sm">Searching for video guide...</p>
          <p className="text-xs text-gray-500">Query: {searchQuery}</p>
        </div>
      ) : videoId ? (
        <div className="space-y-4">
          <div className="relative card-chrome-border w-full rounded-lg overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
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
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm mb-2">{error}</p>
            <p className="text-xs text-gray-400">Searched for: {searchQuery}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={searchYouTubeVideo}
              className="flex-1 px-4 py-3 bg-[#00ffff]/20 border border-[#00ffff]/50 text-[#00ffff] rounded-lg hover:bg-[#00ffff]/30 transition-colors font-semibold"
            >
              🔄 Try Again
            </button>

            <a
              href={manualSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-semibold text-center"
            >
              📺 Search on YouTube
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
