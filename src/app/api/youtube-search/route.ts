/**
 * 🎥 YouTube Search API Route
 *
 * Sistema de búsqueda con caché en Supabase para reducir consumo de cuota de YouTube API
 *
 * Flujo:
 * 1️⃣ Verificar si existe resultado válido en caché (< 7 días)
 * 2️⃣ Si existe, devolver desde caché (ahorra cuota de API)
 * 3️⃣ Si no existe o expiró, consultar YouTube API
 * 4️⃣ Guardar nuevo resultado en caché para futuras búsquedas
 */

import { NextRequest, NextResponse } from "next/server";
import { getCachedVideo, saveCachedVideo } from "@/lib/youtube-cache";

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

    // 2️⃣ Cache miss: consultar YouTube API
    console.log(`🔍 Cache miss, searching YouTube API for: "${query}"`);

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey || apiKey === "YOUR_YOUTUBE_API_KEY_HERE") {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 });
    }

    // Llamar a YouTube Data API v3
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&type=video&maxResults=1&key=${apiKey}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ YouTube API Error:", errorData);

      // Manejo específico de error de cuota
      if (errorData.error?.code === 403 && errorData.error?.message?.includes("quota")) {
        return NextResponse.json(
          {
            error: "YouTube API quota exceeded. Please try again tomorrow.",
            quotaExceeded: true,
          },
          { status: 429 }
        );
      }

      throw new Error("Failed to search YouTube");
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      const videoId = item.id.videoId;
      const snippet = item.snippet;

      // 3️⃣ Guardar resultado en caché para futuras búsquedas
      await saveCachedVideo(query, {
        videoId,
        title: snippet.title,
        thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
        channelTitle: snippet.channelTitle,
        description: snippet.description,
        publishedAt: snippet.publishedAt,
      });

      console.log(`💾 Saved to cache and serving: "${query}"`);

      return NextResponse.json({
        videoId,
        title: snippet.title,
        thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
        channelTitle: snippet.channelTitle,
        source: "youtube",
        cached: false,
      });
    }

    return NextResponse.json({ error: "No videos found" }, { status: 404 });
  } catch (error) {
    console.error("❌ Error in youtube-search route:", error);
    return NextResponse.json({ error: "Failed to search for videos" }, { status: 500 });
  }
}
