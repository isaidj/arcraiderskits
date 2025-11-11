import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    if (!apiKey || apiKey === "YOUR_YOUTUBE_API_KEY_HERE") {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 });
    }

    // Usar YouTube Data API v3
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&type=video&maxResults=1&key=${apiKey}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("YouTube API Error:", errorData);
      throw new Error("Failed to search YouTube");
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return NextResponse.json({ videoId: data.items[0].id.videoId, source: "youtube" });
    }

    return NextResponse.json({ error: "No videos found" }, { status: 404 });
  } catch (error) {
    console.error("Error searching for video:", error);
    return NextResponse.json({ error: "Failed to search for videos" }, { status: 500 });
  }
}
