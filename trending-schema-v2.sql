-- Actualización del esquema de trending con indicadores de cambio
-- Arc Raiders Kits - Sistema de Trending con Rank Changes
-- Ejecutar DESPUÉS de trending-schema.sql

-- ==================================================
-- VISTAS MATERIALIZADAS CON RANKING
-- ==================================================

-- Vista con ranking para items 24h (período actual)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_items_24h_ranked AS
SELECT 
  item_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as current_rank
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '24 hours'
GROUP BY item_id
ORDER BY view_count DESC
LIMIT 50;

-- Vista con ranking para items del período anterior (24h-48h)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_items_previous_24h_ranked AS
SELECT 
  item_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as previous_rank
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '48 hours'
  AND viewed_at <= NOW() - INTERVAL '24 hours'
GROUP BY item_id
ORDER BY view_count DESC
LIMIT 50;

-- Vista con ranking para items 7d (período actual)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_items_7d_ranked AS
SELECT 
  item_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as current_rank
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY item_id
ORDER BY view_count DESC
LIMIT 50;

-- Vista con ranking para items del período anterior (7d-14d)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_items_previous_7d_ranked AS
SELECT 
  item_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as previous_rank
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '14 days'
  AND viewed_at <= NOW() - INTERVAL '7 days'
GROUP BY item_id
ORDER BY view_count DESC
LIMIT 50;

-- Vista con ranking para quests 24h (período actual)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_quests_24h_ranked AS
SELECT 
  quest_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as current_rank
FROM quest_views
WHERE viewed_at > NOW() - INTERVAL '24 hours'
GROUP BY quest_id
ORDER BY view_count DESC
LIMIT 50;

-- Vista con ranking para quests del período anterior (24h-48h)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_quests_previous_24h_ranked AS
SELECT 
  quest_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as previous_rank
FROM quest_views
WHERE viewed_at > NOW() - INTERVAL '48 hours'
  AND viewed_at <= NOW() - INTERVAL '24 hours'
GROUP BY quest_id
ORDER BY view_count DESC
LIMIT 50;

-- Vista con ranking para quests 7d (período actual)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_quests_7d_ranked AS
SELECT 
  quest_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as current_rank
FROM quest_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY quest_id
ORDER BY view_count DESC
LIMIT 50;

-- Vista con ranking para quests del período anterior (7d-14d)
CREATE MATERIALIZED VIEW IF NOT EXISTS trending_quests_previous_7d_ranked AS
SELECT 
  quest_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as previous_rank
FROM quest_views
WHERE viewed_at > NOW() - INTERVAL '14 days'
  AND viewed_at <= NOW() - INTERVAL '7 days'
GROUP BY quest_id
ORDER BY view_count DESC
LIMIT 50;

-- ==================================================
-- ÍNDICES PARA LAS NUEVAS VISTAS
-- ==================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_items_24h_ranked_item_id 
  ON trending_items_24h_ranked(item_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_items_previous_24h_ranked_item_id 
  ON trending_items_previous_24h_ranked(item_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_items_7d_ranked_item_id 
  ON trending_items_7d_ranked(item_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_items_previous_7d_ranked_item_id 
  ON trending_items_previous_7d_ranked(item_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_quests_24h_ranked_item_id 
  ON trending_quests_24h_ranked(quest_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_quests_previous_24h_ranked_item_id 
  ON trending_quests_previous_24h_ranked(quest_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_quests_7d_ranked_item_id 
  ON trending_quests_7d_ranked(quest_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_quests_previous_7d_ranked_item_id 
  ON trending_quests_previous_7d_ranked(quest_id);

-- ==================================================
-- FUNCIÓN ACTUALIZADA PARA REFRESCAR TODAS LAS VISTAS
-- ==================================================

CREATE OR REPLACE FUNCTION refresh_trending_views_v2()
RETURNS void AS $$
BEGIN
  -- Refrescar vistas originales (para compatibilidad)
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_items_24h;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_items_7d;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_quests_24h;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_quests_7d;
  
  -- Refrescar nuevas vistas con ranking
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_items_24h_ranked;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_items_previous_24h_ranked;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_items_7d_ranked;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_items_previous_7d_ranked;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_quests_24h_ranked;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_quests_previous_24h_ranked;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_quests_7d_ranked;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trending_quests_previous_7d_ranked;
END;
$$ LANGUAGE plpgsql;

-- ==================================================
-- QUERIES DE EJEMPLO PARA OBTENER TRENDING CON CAMBIOS
-- ==================================================

-- Ejemplo: Top items con cambio de ranking (24h)
-- SELECT 
--   c.item_id,
--   c.view_count,
--   c.current_rank,
--   COALESCE(p.previous_rank, 999) as previous_rank,
--   CASE 
--     WHEN p.previous_rank IS NULL THEN 'new'
--     WHEN c.current_rank < p.previous_rank THEN 'up'
--     WHEN c.current_rank > p.previous_rank THEN 'down'
--     ELSE 'same'
--   END as trend_direction,
--   COALESCE(p.previous_rank - c.current_rank, 0) as rank_change
-- FROM trending_items_24h_ranked c
-- LEFT JOIN trending_items_previous_24h_ranked p ON c.item_id = p.item_id
-- ORDER BY c.current_rank
-- LIMIT 10;

-- ==================================================
-- COMENTARIOS
-- ==================================================

COMMENT ON MATERIALIZED VIEW trending_items_24h_ranked IS 
  'Items trending en las últimas 24h con ranking para comparación';
COMMENT ON MATERIALIZED VIEW trending_items_previous_24h_ranked IS 
  'Items trending del período anterior (24h-48h) para comparar cambios';
COMMENT ON MATERIALIZED VIEW trending_items_7d_ranked IS 
  'Items trending en los últimos 7 días con ranking para comparación';
COMMENT ON MATERIALIZED VIEW trending_items_previous_7d_ranked IS 
  'Items trending del período anterior (7d-14d) para comparar cambios';

COMMENT ON FUNCTION refresh_trending_views_v2() IS 
  'Refresca todas las vistas materializadas de trending incluyendo las nuevas vistas con ranking';
