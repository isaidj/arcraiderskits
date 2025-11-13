-- Queries útiles para análisis de trending
-- Arc Raiders Kits - Analytics

-- =====================================================
-- QUERIES BÁSICAS DE TRENDING
-- =====================================================

-- Top 10 items más vistos hoy
SELECT 
  item_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '1 day'
GROUP BY item_id
ORDER BY view_count DESC
LIMIT 10;

-- Top 10 quests más vistas esta semana
SELECT 
  quest_id,
  COUNT(*) as view_count,
  MAX(viewed_at) as last_viewed
FROM quest_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY quest_id
ORDER BY view_count DESC
LIMIT 10;

-- =====================================================
-- ANÁLISIS TEMPORAL
-- =====================================================

-- Vistas por hora (últimas 24h)
SELECT 
  DATE_TRUNC('hour', viewed_at) as hour,
  COUNT(*) as total_views,
  COUNT(DISTINCT item_id) as unique_items
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;

-- Vistas por día de la semana
SELECT 
  TO_CHAR(viewed_at, 'Day') as day_of_week,
  EXTRACT(DOW FROM viewed_at) as day_num,
  COUNT(*) as view_count
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '30 days'
GROUP BY day_of_week, day_num
ORDER BY day_num;

-- Vistas por hora del día (patrón de actividad)
SELECT 
  EXTRACT(HOUR FROM viewed_at) as hour_of_day,
  COUNT(*) as view_count,
  ROUND(AVG(COUNT(*)) OVER (), 2) as avg_views
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY hour_of_day
ORDER BY hour_of_day;

-- =====================================================
-- COMPARACIONES Y TENDENCIAS
-- =====================================================

-- Comparar vistas de hoy vs ayer
WITH today AS (
  SELECT COUNT(*) as count
  FROM item_views
  WHERE viewed_at > CURRENT_DATE
),
yesterday AS (
  SELECT COUNT(*) as count
  FROM item_views
  WHERE viewed_at BETWEEN CURRENT_DATE - INTERVAL '1 day' AND CURRENT_DATE
)
SELECT 
  today.count as views_today,
  yesterday.count as views_yesterday,
  today.count - yesterday.count as difference,
  ROUND((today.count::float / NULLIF(yesterday.count, 0) - 1) * 100, 2) as percent_change
FROM today, yesterday;

-- Items que están ganando popularidad (trending up)
WITH current_period AS (
  SELECT item_id, COUNT(*) as current_views
  FROM item_views
  WHERE viewed_at > NOW() - INTERVAL '24 hours'
  GROUP BY item_id
),
previous_period AS (
  SELECT item_id, COUNT(*) as previous_views
  FROM item_views
  WHERE viewed_at BETWEEN NOW() - INTERVAL '48 hours' AND NOW() - INTERVAL '24 hours'
  GROUP BY item_id
)
SELECT 
  c.item_id,
  c.current_views,
  COALESCE(p.previous_views, 0) as previous_views,
  c.current_views - COALESCE(p.previous_views, 0) as growth,
  CASE 
    WHEN p.previous_views IS NULL OR p.previous_views = 0 THEN 100
    ELSE ROUND(((c.current_views::float / p.previous_views - 1) * 100), 2)
  END as growth_percent
FROM current_period c
LEFT JOIN previous_period p ON c.item_id = p.item_id
WHERE c.current_views > COALESCE(p.previous_views, 0)
ORDER BY growth_percent DESC
LIMIT 20;

-- =====================================================
-- ANÁLISIS DE USUARIOS
-- =====================================================

-- Vistas únicas vs totales (detectar bots/spam)
SELECT 
  DATE_TRUNC('day', viewed_at) as day,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_sessions,
  ROUND(COUNT(*)::float / COUNT(DISTINCT session_id), 2) as avg_views_per_session
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY day
ORDER BY day DESC;

-- Top IPs por número de vistas (detectar posible spam)
SELECT 
  user_ip,
  COUNT(*) as view_count,
  COUNT(DISTINCT item_id) as unique_items_viewed,
  MIN(viewed_at) as first_view,
  MAX(viewed_at) as last_view
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '24 hours'
  AND user_ip != 'unknown'
GROUP BY user_ip
HAVING COUNT(*) > 50  -- Threshold para considerar sospechoso
ORDER BY view_count DESC
LIMIT 20;

-- Distribución de user agents
SELECT 
  CASE 
    WHEN user_agent LIKE '%Mobile%' THEN 'Mobile'
    WHEN user_agent LIKE '%Tablet%' THEN 'Tablet'
    WHEN user_agent LIKE '%Bot%' OR user_agent LIKE '%bot%' THEN 'Bot'
    ELSE 'Desktop'
  END as device_type,
  COUNT(*) as view_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY device_type
ORDER BY view_count DESC;

-- =====================================================
-- ESTADÍSTICAS GENERALES
-- =====================================================

-- Resumen general del sistema
SELECT 
  'Items' as type,
  COUNT(*) as total_views,
  COUNT(DISTINCT item_id) as unique_entities,
  COUNT(DISTINCT session_id) as unique_sessions,
  MIN(viewed_at) as first_view,
  MAX(viewed_at) as last_view
FROM item_views
UNION ALL
SELECT 
  'Quests' as type,
  COUNT(*) as total_views,
  COUNT(DISTINCT quest_id) as unique_entities,
  COUNT(DISTINCT session_id) as unique_sessions,
  MIN(viewed_at) as first_view,
  MAX(viewed_at) as last_view
FROM quest_views;

-- Tamaño de las tablas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE tablename IN ('item_views', 'quest_views')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =====================================================
-- MANTENIMIENTO
-- =====================================================

-- Limpiar vistas antiguas (>30 días)
-- PRECAUCIÓN: Esto eliminará datos permanentemente
-- DELETE FROM item_views WHERE viewed_at < NOW() - INTERVAL '30 days';
-- DELETE FROM quest_views WHERE viewed_at < NOW() - INTERVAL '30 days';

-- Vacuum para recuperar espacio
-- VACUUM ANALYZE item_views;
-- VACUUM ANALYZE quest_views;

-- Reindexar para optimizar
-- REINDEX TABLE item_views;
-- REINDEX TABLE quest_views;

-- Verificar fragmentación de índices
SELECT 
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND (tablename = 'item_views' OR tablename = 'quest_views')
ORDER BY pg_relation_size(indexrelid) DESC;

-- =====================================================
-- EXPORTAR DATOS
-- =====================================================

-- Exportar top trending a CSV (ejecutar en cliente que soporte COPY)
-- COPY (
--   SELECT 
--     item_id,
--     COUNT(*) as view_count,
--     MAX(viewed_at) as last_viewed
--   FROM item_views
--   WHERE viewed_at > NOW() - INTERVAL '7 days'
--   GROUP BY item_id
--   ORDER BY view_count DESC
--   LIMIT 100
-- ) TO '/tmp/trending_items.csv' WITH CSV HEADER;

-- =====================================================
-- QUERIES AVANZADAS
-- =====================================================

-- Correlación entre items y quests (usuarios que ven ambos)
SELECT 
  i.item_id,
  q.quest_id,
  COUNT(DISTINCT i.session_id) as shared_sessions
FROM item_views i
JOIN quest_views q ON i.session_id = q.session_id
WHERE i.viewed_at > NOW() - INTERVAL '7 days'
  AND q.viewed_at > NOW() - INTERVAL '7 days'
  AND ABS(EXTRACT(EPOCH FROM (i.viewed_at - q.viewed_at))) < 3600  -- Vistas en la misma hora
GROUP BY i.item_id, q.quest_id
HAVING COUNT(DISTINCT i.session_id) > 5
ORDER BY shared_sessions DESC
LIMIT 50;

-- Patrones de navegación (secuencia de items vistos)
WITH ranked_views AS (
  SELECT 
    session_id,
    item_id,
    viewed_at,
    LAG(item_id) OVER (PARTITION BY session_id ORDER BY viewed_at) as previous_item,
    ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY viewed_at) as view_sequence
  FROM item_views
  WHERE viewed_at > NOW() - INTERVAL '24 hours'
)
SELECT 
  previous_item,
  item_id as current_item,
  COUNT(*) as transition_count
FROM ranked_views
WHERE previous_item IS NOT NULL
GROUP BY previous_item, item_id
ORDER BY transition_count DESC
LIMIT 30;

-- Tiempo promedio entre vistas por sesión
SELECT 
  session_id,
  COUNT(*) as total_views,
  MAX(viewed_at) - MIN(viewed_at) as session_duration,
  EXTRACT(EPOCH FROM (MAX(viewed_at) - MIN(viewed_at))) / NULLIF(COUNT(*) - 1, 0) as avg_seconds_between_views
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY session_id
HAVING COUNT(*) > 1
ORDER BY total_views DESC
LIMIT 100;
