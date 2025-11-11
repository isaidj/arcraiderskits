import { NextRequest, NextResponse } from "next/server";

// Cache simple en memoria (se pierde al reiniciar el servidor)
const videoCache = new Map<string, { videoId: string; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  // Verificar cache
  const cached = videoCache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Returning cached video for:", query);
    return NextResponse.json({ videoId: cached.videoId, source: "youtube", cached: true });
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey || apiKey === "YOUR_YOUTUBE_API_KEY_HERE") {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 });
    }

    // Usar YouTube Data API v3
    const encodedQuery = encodeURIComponent(query);

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&type=video&maxResults=1&key=${apiKey}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("YouTube API Error:", errorData);

      // Si es error de cuota, devolver un mensaje más específico
      if (errorData.error?.code === 403 && errorData.error?.message?.includes("quota")) {
        return NextResponse.json(
          {
            error: "YouTube API quota exceeded. Please try again tomorrow or contact support.",
          },
          { status: 429 }
        );
      }

      throw new Error("Failed to search YouTube");
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;

      // Guardar en cache
      videoCache.set(query, { videoId, timestamp: Date.now() });

      return NextResponse.json({ videoId, source: "youtube" });
    }

    return NextResponse.json({ error: "No videos found" }, { status: 404 });
  } catch (error) {
    console.error("Error searching for video:", error);
    return NextResponse.json({ error: "Failed to search for videos" }, { status: 500 });
  }
}
