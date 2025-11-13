-- Esquema de base de datos para sistema de trending/más buscados
-- Arc Raiders Kits - Tracking de items y quests

-- Tabla para trackear vistas de items
CREATE TABLE IF NOT EXISTS item_views (
  id BIGSERIAL PRIMARY KEY,
  item_id TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_ip TEXT,
  user_agent TEXT,
  session_id TEXT
);

-- Tabla para trackear vistas de quests
CREATE TABLE IF NOT EXISTS quest_views (
  id BIGSERIAL PRIMARY KEY,
  quest_id TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_ip TEXT,
  user_agent TEXT,
  session_id TEXT
);

-- Índices para mejorar el rendimiento de queries
CREATE INDEX IF NOT EXISTS idx_item_views_item_id ON item_views(item_id);
CREATE INDEX IF NOT EXISTS idx_item_views_viewed_at ON item_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_quest_views_quest_id ON quest_views(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_views_viewed_at ON quest_views(viewed_at);

-- Vista materializada para trending items (últimas 24 horas)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_items_24h AS
SELECT 
  item_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '24 hours'
GROUP BY item_id
ORDER BY view_count DESC
LIMIT 50;

-- Vista materializada para trending items (últimos 7 días)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_items_7d AS
SELECT 
  item_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY item_id
ORDER BY view_count DESC
LIMIT 50;

-- Vista materializada para trending quests (últimas 24 horas)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_quests_24h AS
SELECT 
  quest_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed
FROM quest_views
WHERE viewed_at > NOW() - INTERVAL '24 hours'
GROUP BY quest_id
ORDER BY view_count DESC
LIMIT 50;

-- Vista materializada para trending quests (últimos 7 días)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_quests_7d AS
SELECT 
  quest_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed
FROM quest_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY quest_id
ORDER BY view_count DESC
LIMIT 50;

-- Crear índices únicos para las vistas materializadas
CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_items_24h_item_id ON trending_items_24h(item_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_items_7d_item_id ON trending_items_7d(item_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_quests_24h_quest_id ON trending_quests_24h(quest_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_quests_7d_quest_id ON trending_quests_7d(quest_id);

-- Función para refrescar automáticamente las vistas materializadas
CREATE OR REPLACE FUNCTION refresh_trending_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_items_24h;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_items_7d;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_quests_24h;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_quests_7d;
END;
$$ LANGUAGE plpgsql;

-- Crear extensión pg_cron si no existe (para refrescar automáticamente)
-- Nota: Esto requiere permisos de superusuario, puede necesitar ejecutarse manualmente en Supabase
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar el refresco automático cada hora (ejecutar manualmente en Supabase SQL Editor)
-- SELECT cron.schedule('refresh-trending-views', '0 * * * *', 'SELECT refresh_trending_views();');

-- Habilitar Row Level Security (RLS)
ALTER TABLE item_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_views ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública para las tablas de vistas
CREATE POLICY "Allow public read access" ON item_views
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON quest_views
  FOR SELECT USING (true);

-- Política de inserción pública para registrar vistas
CREATE POLICY "Allow public insert" ON item_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert" ON quest_views
  FOR INSERT WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE item_views IS 'Registra cada vista/acceso a la página de detalle de un item';
COMMENT ON TABLE quest_views IS 'Registra cada vista/acceso a la página de detalle de una quest';
COMMENT ON MATERIALIZED VIEW trending_items_24h IS 'Items más vistos en las últimas 24 horas';
COMMENT ON MATERIALIZED VIEW trending_items_7d IS 'Items más vistos en los últimos 7 días';
COMMENT ON MATERIALIZED VIEW trending_quests_24h IS 'Quests más vistas en las últimas 24 horas';
COMMENT ON MATERIALIZED VIEW trending_quests_7d IS 'Quests más vistas en los últimos 7 días';
