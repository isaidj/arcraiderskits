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
  current_rank?: number;
}

interface TrendingItemPrevious {
  item_id: string;
  view_count: number;
  last_viewed: string;
  previous_rank?: number;
}

interface TrendingQuest {
  quest_id: string;
  view_count: number;
  last_viewed: string;
  current_rank?: number;
}

interface TrendingQuestPrevious {
  quest_id: string;
  view_count: number;
  last_viewed: string;
  previous_rank?: number;
}

type TrendDirection = "up" | "down" | "same" | "new";

interface EnrichedTrendingItem {
  item_id: string;
  view_count: number;
  last_viewed: string;
  current_rank: number;
  previous_rank: number | null;
  trend_direction: TrendDirection;
  rank_change: number;
  data: any;
}

interface EnrichedTrendingQuest {
  quest_id: string;
  view_count: number;
  last_viewed: string;
  current_rank: number;
  previous_rank: number | null;
  trend_direction: TrendDirection;
  rank_change: number;
  data: any;
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

    // Obtener trending items con ranking
    const itemsView = period === "7d" ? "trending_items_7d_ranked" : "trending_items_24h_ranked";
    const itemsPreviousView = period === "7d" ? "trending_items_previous_7d_ranked" : "trending_items_previous_24h_ranked";

    const { data: trendingItems, error: itemsError } = await supabase.from(itemsView).select("*").limit(limit);

    if (itemsError) {
      console.error("Error fetching trending items:", itemsError);
    }

    // Obtener ranking del período anterior para items
    const { data: previousItems, error: prevItemsError } = await supabase.from(itemsPreviousView).select("*");

    if (prevItemsError) {
      console.error("Error fetching previous trending items:", prevItemsError);
    }

    // Obtener trending quests con ranking
    const questsView = period === "7d" ? "trending_quests_7d_ranked" : "trending_quests_24h_ranked";
    const questsPreviousView = period === "7d" ? "trending_quests_previous_7d_ranked" : "trending_quests_previous_24h_ranked";

    const { data: trendingQuests, error: questsError } = await supabase.from(questsView).select("*").limit(limit);

    if (questsError) {
      console.error("Error fetching trending quests:", questsError);
    }

    // Obtener ranking del período anterior para quests
    const { data: previousQuests, error: prevQuestsError } = await supabase.from(questsPreviousView).select("*");

    if (prevQuestsError) {
      console.error("Error fetching previous trending quests:", prevQuestsError);
    }

    // Crear mapa de rankings anteriores para items
    const previousItemsMap = new Map((previousItems || []).map((item: TrendingItemPrevious) => [item.item_id, item.previous_rank]));

    // Crear mapa de rankings anteriores para quests
    const previousQuestsMap = new Map((previousQuests || []).map((quest: TrendingQuestPrevious) => [quest.quest_id, quest.previous_rank]));

    // Enriquecer los datos con información completa de items y calcular cambios
    const enrichedItems: EnrichedTrendingItem[] = (trendingItems || [])
      .map((item: TrendingItem) => {
        const itemData = itemsData.find((i: any) => i.id === item.item_id);
        const previousRank = previousItemsMap.get(item.item_id) || null;
        const currentRank = item.current_rank || 999;

        let trendDirection: TrendDirection = "same";
        let rankChange = 0;

        if (previousRank === null) {
          trendDirection = "new";
          rankChange = 0;
        } else {
          rankChange = previousRank - currentRank;
          if (rankChange > 0) {
            trendDirection = "up";
          } else if (rankChange < 0) {
            trendDirection = "down";
          } else {
            trendDirection = "same";
          }
        }

        return {
          item_id: item.item_id,
          view_count: item.view_count,
          last_viewed: item.last_viewed,
          current_rank: currentRank,
          previous_rank: previousRank,
          trend_direction: trendDirection,
          rank_change: rankChange,
          data: itemData,
        };
      })
      .filter((item) => item.data); // Filtrar items que no se encuentren en los datos

    // Enriquecer los datos con información completa de quests y calcular cambios
    const enrichedQuests: EnrichedTrendingQuest[] = (trendingQuests || [])
      .map((quest: TrendingQuest) => {
        const questData = questsData.find((q: any) => q.id === quest.quest_id);
        const previousRank = previousQuestsMap.get(quest.quest_id) || null;
        const currentRank = quest.current_rank || 999;

        let trendDirection: TrendDirection = "same";
        let rankChange = 0;

        if (previousRank === null) {
          trendDirection = "new";
          rankChange = 0;
        } else {
          rankChange = previousRank - currentRank;
          if (rankChange > 0) {
            trendDirection = "up";
          } else if (rankChange < 0) {
            trendDirection = "down";
          } else {
            trendDirection = "same";
          }
        }

        return {
          quest_id: quest.quest_id,
          view_count: quest.view_count,
          last_viewed: quest.last_viewed,
          current_rank: currentRank,
          previous_rank: previousRank,
          trend_direction: trendDirection,
          rank_change: rankChange,
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

    // Ejecutar la función para refrescar las vistas (usar v2 si existe, sino usar la original)
    let error = null;

    // Intentar con la función v2 primero (nueva con ranking)
    const result = await supabase.rpc("refresh_trending_views_v2");
    error = result.error;

    // Si no existe la v2, usar la función original
    if (error && error.message?.includes("does not exist")) {
      const fallbackResult = await supabase.rpc("refresh_trending_views");
      error = fallbackResult.error;
    }

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
