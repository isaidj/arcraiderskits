/**
 * 🗄️ Supabase Client Configuration
 *
 * Cliente singleton para conexión con Supabase
 * Usa variables de entorno para configuración segura
 */

import { createClient } from "@supabase/supabase-js";

// Validar que existan las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("⚠️ Missing Supabase environment variables. " + "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
}

/**
 * Cliente de Supabase con autenticación anónima
 * - Permite lectura pública (SELECT)
 * - Usar solo para operaciones de lectura
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No necesitamos sesión en servidor
    autoRefreshToken: false,
  },
  db: {
    schema: "public",
  },
});

/**
 * Cliente de Supabase con service_role key (admin)
 * - Bypasea Row Level Security (RLS)
 * - Usar SOLO en servidor (API routes, server components)
 * - NUNCA exponer al cliente
 */
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: "public",
      },
    })
  : supabase; // Fallback al cliente normal si no hay service_role key

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
