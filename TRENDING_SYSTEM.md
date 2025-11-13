# Sistema de Trending - Arc Raiders Kits

## Descripción

Sistema completo de tracking y trending para mostrar los items y quests más buscados por la comunidad en Arc Raiders Kits. El sistema registra automáticamente cada vista de item/quest y muestra estadísticas en tiempo real.

## Características

✅ **Tracking automático** - Registra cada vista de items y quests  
✅ **Múltiples períodos** - Estadísticas de 24 horas y 7 días  
✅ **Vistas materializadas** - Rendimiento optimizado con caché en base de datos  
✅ **Componente interactivo** - UI moderna con tabs y filtros de período  
✅ **Multiidioma** - Soporte completo para todos los idiomas  
✅ **Privacy-friendly** - No usa cookies invasivas, solo session tracking básico

## Configuración de Supabase

### 1. Ejecutar el esquema SQL

1. Ve a tu proyecto de Supabase en [console.supabase.com](https://console.supabase.com)
2. Navega a **SQL Editor** en el panel lateral
3. Crea una nueva query y copia el contenido del archivo `trending-schema.sql`
4. Ejecuta el script completo

Esto creará:
- Tablas `item_views` y `quest_views`
- Vistas materializadas para trending (24h y 7d)
- Índices para optimización
- Políticas de Row Level Security (RLS)
- Función para refrescar vistas

### 2. Configurar variables de entorno

Asegúrate de tener estas variables en tu archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Refrescar vistas materializadas

Las vistas materializadas necesitan refrescarse periódicamente. Tienes dos opciones:

#### Opción A: Manualmente (desarrollo)
Ejecuta en SQL Editor:
```sql
SELECT refresh_trending_views();
```

#### Opción B: Automáticamente con pg_cron (producción)

1. Habilita la extensión pg_cron (requiere permisos de superusuario):
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

2. Programa el refresco cada hora:
```sql
SELECT cron.schedule(
  'refresh-trending-views',
  '0 * * * *',
  'SELECT refresh_trending_views();'
);
```

3. Verifica los jobs programados:
```sql
SELECT * FROM cron.job;
```

**Nota:** pg_cron puede requerir configuración adicional en Supabase. Si no está disponible, considera usar un cron job externo o refrescar manualmente.

#### Opción C: Endpoint API
Puedes refrescar las vistas manualmente llamando al endpoint:
```bash
curl -X POST https://tu-dominio.com/api/trending
```

## Estructura del Sistema

### API Routes

- **`/api/track-item`** (POST) - Registra una vista de item
  ```json
  { "itemId": "item_123" }
  ```

- **`/api/track-quest`** (POST) - Registra una vista de quest
  ```json
  { "questId": "quest_456" }
  ```

- **`/api/trending`** (GET) - Obtiene datos de trending
  ```
  ?period=24h|7d&limit=10
  ```

- **`/api/trending`** (POST) - Refresca vistas materializadas manualmente

### Componentes

- **`TrendingSection`** - Componente principal con tabs y filtros
- **`TrackItemView`** - Client component para tracking de items
- **`TrackQuestView`** - Client component para tracking de quests

### Base de Datos

**Tablas:**
- `item_views` - Registro de vistas de items
- `quest_views` - Registro de vistas de quests

**Vistas Materializadas:**
- `trending_items_24h` - Top 50 items en 24h
- `trending_items_7d` - Top 50 items en 7 días
- `trending_quests_24h` - Top 50 quests en 24h
- `trending_quests_7d` - Top 50 quests en 7 días

## Uso

### Visualizar Trending
El componente `TrendingSection` se muestra automáticamente en la página principal (`/[lang]`).

### Tracking Automático
El tracking ocurre automáticamente cuando un usuario visita:
- `/[lang]/items/[slug]` - Se registra vista del item
- `/[lang]/quests/[slug]` - Se registra vista de la quest

### Consultas Personalizadas

Puedes hacer consultas directas a las tablas si necesitas estadísticas más detalladas:

```sql
-- Top items de hoy
SELECT item_id, COUNT(*) as views
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '1 day'
GROUP BY item_id
ORDER BY views DESC
LIMIT 10;

-- Vistas por hora
SELECT 
  DATE_TRUNC('hour', viewed_at) as hour,
  COUNT(*) as views
FROM item_views
WHERE viewed_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;

-- Items más populares por día de la semana
SELECT 
  EXTRACT(DOW FROM viewed_at) as day_of_week,
  item_id,
  COUNT(*) as views
FROM item_views
GROUP BY day_of_week, item_id
ORDER BY views DESC;
```

## Mantenimiento

### Limpiar datos antiguos (opcional)

Si quieres mantener solo datos recientes para ahorrar espacio:

```sql
-- Eliminar vistas de más de 30 días
DELETE FROM item_views WHERE viewed_at < NOW() - INTERVAL '30 days';
DELETE FROM quest_views WHERE viewed_at < NOW() - INTERVAL '30 days';
```

### Verificar tamaño de las tablas

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename IN ('item_views', 'quest_views')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Consideraciones de Privacidad

- El sistema registra IPs y user agents para evitar spam/bots
- No se recopilan datos personales identificables
- Las session IDs son temporales y se regeneran
- Cumple con GDPR y regulaciones de privacidad

## Troubleshooting

### Las vistas no se refrescan

1. Verifica que la función existe:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'refresh_trending_views';
```

2. Refresca manualmente:
```sql
SELECT refresh_trending_views();
```

### No aparecen datos en trending

1. Verifica que hay datos en las tablas:
```sql
SELECT COUNT(*) FROM item_views;
SELECT COUNT(*) FROM quest_views;
```

2. Verifica las vistas materializadas:
```sql
SELECT * FROM trending_items_24h LIMIT 5;
```

3. Si están vacías, refresca:
```sql
SELECT refresh_trending_views();
```

### Error de permisos

Asegúrate de que las políticas RLS están configuradas:
```sql
SELECT * FROM pg_policies WHERE tablename IN ('item_views', 'quest_views');
```

## Próximas Mejoras

- [ ] Dashboard de analytics con gráficos
- [ ] Trending por categoría/tipo
- [ ] Comparación de períodos
- [ ] Exportación de datos
- [ ] Detección de bots más sofisticada
- [ ] Cache en Redis para mejor performance

## Soporte

Si tienes problemas, verifica:
1. Variables de entorno configuradas correctamente
2. Esquema SQL ejecutado sin errores
3. Políticas RLS habilitadas
4. Vistas materializadas refrescadas

Para más información sobre Supabase, visita: [supabase.com/docs](https://supabase.com/docs)
