-- Script de prueba para insertar datos del período anterior
-- Arc Raiders Kits - Trending Test Data
-- EJECUTAR DESPUÉS de trending-schema.sql y trending-schema-v2.sql

-- ==================================================
-- INSERTAR DATOS DE PRUEBA DEL PERÍODO ANTERIOR
-- ==================================================

-- Items del período anterior (24h-48h atrás)
-- Simular vistas de hace 36 horas
INSERT INTO item_views (item_id, viewed_at, user_ip, session_id)
SELECT 
    item_id,
    NOW() - INTERVAL '36 hours' - (random() * INTERVAL '10 hours'),
    '192.168.1.' || floor(random() * 255)::text,
    'test_' || md5(random()::text)
FROM (
    SELECT 'rusted_gear' as item_id, generate_series(1, 20) as n
    UNION ALL
    SELECT 'oil', generate_series(1, 15)
    UNION ALL
    SELECT 'sentinel_firing_core', generate_series(1, 10)
    UNION ALL
    SELECT 'music_box', generate_series(1, 12)
    UNION ALL
    SELECT 'steel_spring', generate_series(1, 8)
) t;

-- Quests del período anterior (24h-48h atrás)
INSERT INTO quest_views (quest_id, viewed_at, user_ip, session_id)
SELECT 
    quest_id,
    NOW() - INTERVAL '36 hours' - (random() * INTERVAL '10 hours'),
    '192.168.1.' || floor(random() * 255)::text,
    'test_' || md5(random()::text)
FROM (
    SELECT 'ss10x' as quest_id, generate_series(1, 25) as n
    UNION ALL
    SELECT 'ss10x9', generate_series(1, 20)
    UNION ALL
    SELECT 'ss10e', generate_series(1, 18)
    UNION ALL
    SELECT 'ss10b', generate_series(1, 15)
    UNION ALL
    SELECT 'ss10r', generate_series(1, 10)
) t;

-- Items del período anterior (7d-14d atrás)
-- Simular vistas de hace 10 días
INSERT INTO item_views (item_id, viewed_at, user_ip, session_id)
SELECT 
    item_id,
    NOW() - INTERVAL '10 days' - (random() * INTERVAL '3 days'),
    '192.168.1.' || floor(random() * 255)::text,
    'test_' || md5(random()::text)
FROM (
    SELECT 'rusted_gear' as item_id, generate_series(1, 50) as n
    UNION ALL
    SELECT 'oil', generate_series(1, 40)
    UNION ALL
    SELECT 'sentinel_firing_core', generate_series(1, 30)
    UNION ALL
    SELECT 'music_box', generate_series(1, 35)
    UNION ALL
    SELECT 'steel_spring', generate_series(1, 25)
) t;

-- Quests del período anterior (7d-14d atrás)
INSERT INTO quest_views (quest_id, viewed_at, user_ip, session_id)
SELECT 
    quest_id,
    NOW() - INTERVAL '10 days' - (random() * INTERVAL '3 days'),
    '192.168.1.' || floor(random() * 255)::text,
    'test_' || md5(random()::text)
FROM (
    SELECT 'ss10x' as quest_id, generate_series(1, 60) as n
    UNION ALL
    SELECT 'ss10x9', generate_series(1, 50)
    UNION ALL
    SELECT 'ss10e', generate_series(1, 45)
    UNION ALL
    SELECT 'ss10b', generate_series(1, 40)
    UNION ALL
    SELECT 'ss10r', generate_series(1, 30)
) t;

-- ==================================================
-- REFRESCAR VISTAS MATERIALIZADAS
-- ==================================================

-- Refrescar todas las vistas
SELECT refresh_trending_views_v2();

-- ==================================================
-- VERIFICAR RESULTADOS
-- ==================================================

-- Ver trending items 24h con cambios de ranking
SELECT 
    c.item_id,
    c.view_count,
    c.current_rank,
    p.previous_rank,
    CASE 
        WHEN p.previous_rank IS NULL THEN 'new'
        WHEN c.current_rank < p.previous_rank THEN 'up'
        WHEN c.current_rank > p.previous_rank THEN 'down'
        ELSE 'same'
    END as trend_direction,
    (p.previous_rank - c.current_rank) as rank_change
FROM trending_items_24h_ranked c
LEFT JOIN trending_items_previous_24h_ranked p ON c.item_id = p.item_id
ORDER BY c.current_rank
LIMIT 10;

-- Ver trending quests 24h con cambios de ranking
SELECT 
    c.quest_id,
    c.view_count,
    c.current_rank,
    p.previous_rank,
    CASE 
        WHEN p.previous_rank IS NULL THEN 'new'
        WHEN c.current_rank < p.previous_rank THEN 'up'
        WHEN c.current_rank > p.previous_rank THEN 'down'
        ELSE 'same'
    END as trend_direction,
    (p.previous_rank - c.current_rank) as rank_change
FROM trending_quests_24h_ranked c
LEFT JOIN trending_quests_previous_24h_ranked p ON c.quest_id = p.quest_id
ORDER BY c.current_rank
LIMIT 10;

-- ==================================================
-- COMENTARIOS
-- ==================================================

COMMENT ON SCRIPT IS 'Script de prueba para insertar datos históricos y ver los indicadores de tendencia funcionando';
