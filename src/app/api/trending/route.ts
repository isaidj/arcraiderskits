import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface TrendingItem {
  item_id: string;
  view_count: number;
  last_viewed: string;
}

interface TrendingQuest {
  quest_id: string;
  view_count: number;
  last_viewed: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "24h"; // 24h o 7d
    const limit = parseInt(searchParams.get("limit") || "10");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Leer archivos de datos
    const itemsPath = path.join(process.cwd(), "public", "data", "items.json");
    const questsPath = path.join(process.cwd(), "public", "data", "quests.json");

    const [itemsContent, questsContent] = await Promise.all([fs.readFile(itemsPath, "utf8"), fs.readFile(questsPath, "utf8")]);

    const itemsData = JSON.parse(itemsContent);
    const questsData = JSON.parse(questsContent);

    // Obtener trending items
    const itemsView = period === "7d" ? "trending_items_7d" : "trending_items_24h";
    const { data: trendingItems, error: itemsError } = await supabase.from(itemsView).select("*").limit(limit);

    if (itemsError) {
      console.error("Error fetching trending items:", itemsError);
    }

    // Obtener trending quests
    const questsView = period === "7d" ? "trending_quests_7d" : "trending_quests_24h";
    const { data: trendingQuests, error: questsError } = await supabase.from(questsView).select("*").limit(limit);

    if (questsError) {
      console.error("Error fetching trending quests:", questsError);
    }

    // Enriquecer los datos con información completa de items y quests
    const enrichedItems = (trendingItems || [])
      .map((item: TrendingItem) => {
        const itemData = itemsData.find((i: any) => i.id === item.item_id);
        return {
          ...item,
          data: itemData,
        };
      })
      .filter((item) => item.data); // Filtrar items que no se encuentren en los datos

    const enrichedQuests = (trendingQuests || [])
      .map((quest: TrendingQuest) => {
        const questData = questsData.find((q: any) => q.id === quest.quest_id);
        return {
          ...quest,
          data: questData,
        };
      })
      .filter((quest) => quest.data); // Filtrar quests que no se encuentren en los datos

    return NextResponse.json({
      period,
      items: enrichedItems,
      quests: enrichedQuests,
    });
  } catch (error) {
    console.error("Error in trending route:", error);
    return NextResponse.json({ error: "Internal server error", items: [], quests: [] }, { status: 500 });
  }
}

// Endpoint para refrescar las vistas materializadas manualmente
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ejecutar la función para refrescar las vistas
    const { error } = await supabase.rpc("refresh_trending_views");

    if (error) {
      console.error("Error refreshing trending views:", error);
      return NextResponse.json({ error: "Failed to refresh views" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Trending views refreshed" });
  } catch (error) {
    console.error("Error in trending refresh:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
