/**
 * 🎥 YouTube Search API Route with Invidious Fallback
 *
 * Sistema de búsqueda con caché en Supabase y fallback automático
 *
 * Flujo:
 * 1️⃣ Verificar si existe resultado válido en caché (< 7 días)
 * 2️⃣ Si existe, devolver desde caché (ahorra cuota de API)
 * 3️⃣ Si no existe o expiró, consultar YouTube API
 * 4️⃣ Si YouTube falla o alcanza cuota, usar Invidious API automáticamente
 * 5️⃣ Guardar nuevo resultado en caché para futuras búsquedas
 */

import { NextRequest, NextResponse } from "next/server";
import { getCachedVideo, saveCachedVideo } from "@/lib/youtube-cache";

// Lista de instancias de Invidious para fallback
const INVIDIOUS_INSTANCES = [
  "https://inv.nadeko.net", // 🇨🇱 Chile
  "https://yewtu.be", // 🇩🇪 Alemania
  "https://invidious.f5.si", // 🇯🇵 Japón
  "https://invidious.nerdvpn.de", // 🇺🇦 Ucrania
  "https://inv.perditum.com", // 🇦🇱 Albania
];

/**
 * Buscar en Invidious con fallback entre instancias
 */
async function searchInvidious(query: string): Promise<any> {
  const encodedQuery = encodeURIComponent(query);

  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      console.log(`🔍 Trying Invidious instance: ${instance}`);

      const response = await fetch(`${instance}/api/v1/search?q=${encodedQuery}&type=video`, {
        headers: {
          "User-Agent": "ArcRaidersKits/1.0",
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn(`⚠️ Instance ${instance} returned ${response.status}`);
        continue;
      }

      const data = await response.json();

      if (data && data.length > 0) {
        console.log(`✅ Success with Invidious instance: ${instance}`);
        return data[0];
      }
    } catch (error) {
      console.warn(`⚠️ Instance ${instance} failed:`, error instanceof Error ? error.message : "Unknown error");
      continue;
    }
  }

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
      // ✅ Cache hit: devolver sin consumir cuota de YouTube API
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

    // 2️⃣ Cache miss: consultar YouTube API primero
    console.log(`🔍 Cache miss, searching YouTube API for: "${query}"`);

    const apiKey = process.env.YOUTUBE_API_KEY;
    let videoData = null;
    let source = "youtube";

    // Intentar con YouTube API
    if (apiKey && apiKey !== "YOUR_YOUTUBE_API_KEY_HERE") {
      try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&type=video&maxResults=1&key=${apiKey}`);

        if (response.ok) {
          const data = await response.json();

          if (data.items && data.items.length > 0) {
            const item = data.items[0];
            videoData = {
              videoId: item.id.videoId,
              title: item.snippet.title,
              thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
              channelTitle: item.snippet.channelTitle,
              description: item.snippet.description,
              publishedAt: item.snippet.publishedAt,
            };
            console.log(`✅ Video found via YouTube API`);
          }
        } else {
          const errorData = await response.json();
          console.warn("⚠️ YouTube API Error:", errorData);

          // Si es error de cuota, intentar con Invidious
          if (errorData.error?.code === 403 && errorData.error?.message?.includes("quota")) {
            console.warn("⚠️ YouTube quota exceeded, falling back to Invidious...");
          }
        }
      } catch (error) {
        console.warn("⚠️ YouTube API request failed:", error);
      }
    } else {
      console.warn("⚠️ YouTube API key not configured, using Invidious...");
    }

    // 3️⃣ Si YouTube falló, usar Invidious como fallback
    if (!videoData) {
      try {
        console.log(`🔍 Falling back to Invidious API for: "${query}"`);
        const invidiousData = await searchInvidious(query);

        if (invidiousData) {
          const thumbnailUrl = invidiousData.videoThumbnails?.find((thumb: any) => thumb.quality === "high")?.url || invidiousData.videoThumbnails?.[0]?.url;

          videoData = {
            videoId: invidiousData.videoId,
            title: invidiousData.title,
            thumbnailUrl: thumbnailUrl?.startsWith("http") ? thumbnailUrl : `https://i.ytimg.com/vi/${invidiousData.videoId}/hqdefault.jpg`,
            channelTitle: invidiousData.author,
            description: invidiousData.description || "",
            publishedAt: new Date(invidiousData.published * 1000).toISOString(),
          };
          source = "invidious";
          console.log(`✅ Video found via Invidious API`);
        }
      } catch (error) {
        console.error("❌ Invidious fallback also failed:", error);
        return NextResponse.json({ error: "Failed to search for videos using both YouTube and Invidious" }, { status: 500 });
      }
    }

    // 4️⃣ Si encontramos un video (de cualquier fuente), guardarlo en caché
    if (videoData) {
      await saveCachedVideo(query, videoData);
      console.log(`💾 Saved to cache from ${source}: "${query}"`);

      return NextResponse.json({
        videoId: videoData.videoId,
        title: videoData.title,
        thumbnailUrl: videoData.thumbnailUrl,
        channelTitle: videoData.channelTitle,
        source,
        cached: false,
      });
    }

    return NextResponse.json({ error: "No videos found" }, { status: 404 });
  } catch (error) {
    console.error("❌ Error in youtube-search route:", error);
    return NextResponse.json({ error: "Failed to search for videos" }, { status: 500 });
  }
}
