/**
 *
 * NO SE USA ACTUALMENTE
 *
 * 🎥 Invidious Search API Route
 *
 * Sistema de búsqueda usando Invidious API como alternativa a YouTube API
 * Ventajas: Sin cuota, sin API key, libre y de código abierto
 *
 * Flujo:
 * 1️⃣ Verificar si existe resultado válido en caché (< 7 días)
 * 2️⃣ Si existe, devolver desde caché
 * 3️⃣ Si no existe o expiró, consultar Invidious API (con fallback entre instancias)
 * 4️⃣ Guardar nuevo resultado en caché para futuras búsquedas
 */

import { NextRequest, NextResponse } from "next/server";
import { getCachedVideo, saveCachedVideo } from "@/lib/youtube-cache";

// Lista de instancias de Invidious (con fallback)
const INVIDIOUS_INSTANCES = [
  "https://inv.nadeko.net", // 🇨🇱 Chile
  "https://yewtu.be", // 🇩🇪 Alemania
  "https://invidious.f5.si", // 🇯🇵 Japón
  "https://invidious.nerdvpn.de", // 🇺🇦 Ucrania
  "https://inv.perditum.com", // 🇦🇱 Albania
];

/**
 * Intenta buscar en Invidious con fallback entre instancias
 */
async function searchInvidious(query: string): Promise<any> {
  const encodedQuery = encodeURIComponent(query);

  // Intentar con cada instancia hasta que una funcione
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      console.log(`🔍 Trying Invidious instance: ${instance}`);

      const response = await fetch(`${instance}/api/v1/search?q=${encodedQuery}&type=video`, {
        headers: {
          "User-Agent": "ArcRaidersKits/1.0",
        },
        // Timeout de 5 segundos por instancia
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn(`⚠️ Instance ${instance} returned ${response.status}`);
        continue;
      }

      const data = await response.json();

      if (data && data.length > 0) {
        console.log(`✅ Success with instance: ${instance}`);
        return { data: data[0], instance };
      }
    } catch (error) {
      console.warn(`⚠️ Instance ${instance} failed:`, error instanceof Error ? error.message : "Unknown error");
      // Continuar con la siguiente instancia
      continue;
    }
  }

  // Si todas las instancias fallaron
  throw new Error("All Invidious instances failed");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    // 1️⃣ Intentar obtener resultado desde caché
    const cachedResult = await getCachedVideo(query);

    if (cachedResult) {
      // ✅ Cache hit: devolver sin hacer consultas externas
      console.log(`🎯 Serving from cache: "${query}"`);
      return NextResponse.json({
        videoId: cachedResult.video_id,
        title: cachedResult.title,
        thumbnailUrl: cachedResult.thumbnail_url,
        channelTitle: cachedResult.channel_title,
        source: "cache",
        cached: true,
        cacheAge: Math.floor((Date.now() - new Date(cachedResult.updated_at).getTime()) / (1000 * 60 * 60 * 24)),
      });
    }

    // 2️⃣ Cache miss: consultar Invidious API
    console.log(`🔍 Cache miss, searching Invidious for: "${query}"`);

    const result = await searchInvidious(query);
    const video = result.data;

    if (video) {
      const videoId = video.videoId;
      const title = video.title;
      const thumbnailUrl = video.videoThumbnails?.find((thumb: any) => thumb.quality === "high")?.url || video.videoThumbnails?.[0]?.url;
      const channelTitle = video.author;

      // 3️⃣ Guardar resultado en caché para futuras búsquedas
      await saveCachedVideo(query, {
        videoId,
        title,
        thumbnailUrl: thumbnailUrl?.startsWith("http") ? thumbnailUrl : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        channelTitle,
        description: video.description || "",
        publishedAt: new Date(video.published * 1000).toISOString(),
      });

      console.log(`💾 Saved to cache and serving: "${query}"`);

      return NextResponse.json({
        videoId,
        title,
        thumbnailUrl: thumbnailUrl?.startsWith("http") ? thumbnailUrl : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        channelTitle,
        source: "invidious",
        instance: result.instance,
        cached: false,
      });
    }

    return NextResponse.json({ error: "No videos found" }, { status: 404 });
  } catch (error) {
    console.error("❌ Error in invidious-search route:", error);
    return NextResponse.json(
      {
        error: "Failed to search for videos using Invidious",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
