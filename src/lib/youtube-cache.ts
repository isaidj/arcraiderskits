/**
 * 🔁 YouTube Cache Management
 *
 * Sistema de caché para reducir el consumo de cuota de YouTube API
 *
 * Flujo:
 * 1. Verificar si existe caché válido en Supabase
 * 2. Si es válido (< 7 días), devolver desde caché
 * 3. Si no existe o expiró, buscar en YouTube API
 * 4. Guardar nuevo resultado en caché
 */

import { supabase, supabaseAdmin, type YouTubeCacheRow, type YouTubeCacheInsert } from "./supabase";

// ⏱️ Tiempo de expiración del caché (en días)
const CACHE_EXPIRATION_DAYS = 7;

/**
 * Normaliza el query de búsqueda para consistencia
 * - Convierte a lowercase
 * - Elimina espacios extras
 */
function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Verifica si un registro de caché sigue siendo válido
 */
function isCacheValid(updatedAt: string): boolean {
  const cacheDate = new Date(updatedAt);
  const now = new Date();
  const diffInDays = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24);

  return diffInDays < CACHE_EXPIRATION_DAYS;
}

/**
 * 🔍 Obtiene un resultado de caché si existe y es válido
 *
 * @param query - Texto de búsqueda
 * @returns Resultado de caché o null si no existe/expiró
 */
export async function getCachedVideo(query: string): Promise<YouTubeCacheRow | null> {
  try {
    const normalizedQuery = normalizeQuery(query);

    const { data, error } = await supabase.from("youtube_cache").select("*").ilike("query", normalizedQuery).single();

    if (error) {
      // No encontrado o error
      console.log(`📭 Cache miss for: "${query}"`);
      return null;
    }

    // Verificar si el caché sigue siendo válido
    if (!isCacheValid(data.updated_at)) {
      console.log(`⏰ Cache expired for: "${query}" (updated: ${data.updated_at})`);
      // Opcionalmente, borrar el registro expirado
      await supabase.from("youtube_cache").delete().eq("id", data.id);

      return null;
    }

    console.log(`✅ Cache hit for: "${query}" (age: ${Math.floor((Date.now() - new Date(data.updated_at).getTime()) / (1000 * 60 * 60 * 24))} days)`);
    return data;
  } catch (error) {
    console.error("❌ Error getting cached video:", error);
    return null;
  }
}

/**
 * 💾 Guarda o actualiza un resultado en caché
 *
 * @param query - Texto de búsqueda original
 * @param videoData - Datos del video de YouTube
 */
export async function saveCachedVideo(
  query: string,
  videoData: {
    videoId: string;
    title: string;
    thumbnailUrl?: string;
    channelTitle?: string;
    description?: string;
    publishedAt?: string;
  }
): Promise<void> {
  try {
    const normalizedQuery = normalizeQuery(query);

    // Primero intentar buscar si existe un registro con este query (usando cliente normal)
    const { data: existing } = await supabase.from("youtube_cache").select("id").ilike("query", normalizedQuery).single();

    const cacheData = {
      query: normalizedQuery,
      video_id: videoData.videoId,
      title: videoData.title,
      thumbnail_url: videoData.thumbnailUrl || null,
      channel_title: videoData.channelTitle || null,
      description: videoData.description || null,
      published_at: videoData.publishedAt || null,
    };

    if (existing) {
      // Actualizar registro existente (usando cliente admin)
      const { error } = await supabaseAdmin
        .from("youtube_cache")
        .update({ ...cacheData, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      if (error) {
        console.error("❌ Error updating cache:", error);
        throw error;
      }
      console.log(`🔄 Updated cache for: "${query}" (videoId: ${videoData.videoId})`);
    } else {
      // Insertar nuevo registro (usando cliente admin)
      const { error } = await supabaseAdmin.from("youtube_cache").insert(cacheData);

      if (error) {
        console.error("❌ Error inserting to cache:", error);
        throw error;
      }
      console.log(`💾 Cached video for: "${query}" (videoId: ${videoData.videoId})`);
    }
  } catch (error) {
    console.error("❌ Error in saveCachedVideo:", error);
    // No lanzar error para que la aplicación continúe aunque falle el caché
  }
}

/**
 * 🗑️ Limpia registros de caché expirados
 * (Útil para ejecutar manualmente o en cron job)
 */
export async function cleanupExpiredCache(): Promise<number> {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - CACHE_EXPIRATION_DAYS);

    // Usar cliente admin para operaciones de escritura
    const { data, error } = await supabaseAdmin.from("youtube_cache").delete().lt("updated_at", expirationDate.toISOString()).select("id");

    if (error) {
      console.error("❌ Error cleaning up cache:", error);
      return 0;
    }

    const deletedCount = data?.length || 0;
    console.log(`🗑️ Cleaned up ${deletedCount} expired cache entries`);
    return deletedCount;
  } catch (error) {
    console.error("❌ Error in cleanupExpiredCache:", error);
    return 0;
  }
}

/**
 * 📊 Obtiene estadísticas del caché
 */
export async function getCacheStats(): Promise<{
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
}> {
  try {
    const { data, error } = await supabase.from("youtube_cache").select("updated_at");

    if (error || !data) {
      return { totalEntries: 0, validEntries: 0, expiredEntries: 0 };
    }

    const totalEntries = data.length;
    const validEntries = data.filter((entry) => isCacheValid(entry.updated_at)).length;
    const expiredEntries = totalEntries - validEntries;

    return { totalEntries, validEntries, expiredEntries };
  } catch (error) {
    console.error("❌ Error getting cache stats:", error);
    return { totalEntries: 0, validEntries: 0, expiredEntries: 0 };
  }
}
