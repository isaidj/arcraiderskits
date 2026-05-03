/**
 * 🗄️ Supabase Client Configuration
 *
 * Cliente singleton para conexión con Supabase
 * Usa variables de entorno para configuración segura
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        db: { schema: "public" },
      })
    : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        db: { schema: "public" },
      })
    : supabase;

/**
 * Tipos TypeScript para la tabla youtube_cache
 */
export interface YouTubeCacheRow {
  id: string;
  query: string;
  video_id: string;
  title: string;
  thumbnail_url: string | null;
  channel_title: string | null;
  description: string | null;
  published_at: string | null;
  updated_at: string;
  created_at: string;
}

export type YouTubeCacheInsert = Omit<YouTubeCacheRow, "id" | "created_at" | "updated_at">;
