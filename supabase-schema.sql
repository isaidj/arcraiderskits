-- 📦 Schema para YouTube Cache en Supabase
-- Este script crea la tabla necesaria para almacenar resultados de búsqueda de YouTube

-- Crear tabla youtube_cache
CREATE TABLE IF NOT EXISTS youtube_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  channel_title TEXT,
  description TEXT,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas por query
CREATE INDEX IF NOT EXISTS idx_youtube_cache_query ON youtube_cache(query);

-- Índice para limpiar registros viejos
CREATE INDEX IF NOT EXISTS idx_youtube_cache_updated_at ON youtube_cache(updated_at);

-- Constraint: una búsqueda solo puede tener un resultado activo
CREATE UNIQUE INDEX IF NOT EXISTS idx_youtube_cache_unique_query ON youtube_cache(LOWER(query));

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en cada UPDATE
DROP TRIGGER IF EXISTS update_youtube_cache_updated_at ON youtube_cache;
CREATE TRIGGER update_youtube_cache_updated_at
  BEFORE UPDATE ON youtube_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE youtube_cache ENABLE ROW LEVEL SECURITY;

-- Política: Permitir SELECT a usuarios anónimos (lectura pública)
CREATE POLICY "Allow public read access" ON youtube_cache
  FOR SELECT
  USING (true);

-- Política: Permitir INSERT/UPDATE/DELETE solo desde el servidor (usando service_role key)
-- Esta política se aplica solo si usas anon key para SELECT y service_role para escritura
CREATE POLICY "Allow server write access" ON youtube_cache
  FOR ALL
  USING (auth.role() = 'service_role');

-- 🗑️ Función opcional para limpiar registros antiguos (ejecutar manualmente o con cron)
-- Borra registros con más de 7 días
CREATE OR REPLACE FUNCTION cleanup_old_youtube_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM youtube_cache
  WHERE updated_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Comentarios para documentación
COMMENT ON TABLE youtube_cache IS 'Cache de resultados de búsqueda de YouTube para reducir consumo de API quota';
COMMENT ON COLUMN youtube_cache.query IS 'Texto de búsqueda original (normalizado a lowercase en índice)';
COMMENT ON COLUMN youtube_cache.video_id IS 'ID del video de YouTube';
COMMENT ON COLUMN youtube_cache.updated_at IS 'Última actualización del registro (para validar expiración)';
