# Cómo usar el Sistema de Trending

## Inicio Rápido

### 1. Configurar Supabase

Ejecuta el archivo `trending-schema.sql` en tu proyecto de Supabase:

```bash
# Opción 1: Desde la consola web de Supabase
# Ve a SQL Editor y pega el contenido de trending-schema.sql

# Opción 2: Usando Supabase CLI
supabase db push
```

### 2. Variables de entorno

Asegúrate de tener en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Para el script de refresh
```

### 3. Refrescar vistas materializadas

Las vistas materializadas necesitan refrescarse para mostrar datos actualizados.

#### Opción A: Manualmente desde SQL
```sql
SELECT refresh_trending_views();
```

#### Opción B: Usando el script Node.js
```bash
node scripts/refresh-trending.js
```

#### Opción C: Programar con cron (Linux/Mac)
```bash
# Editar crontab
crontab -e

# Agregar línea para refrescar cada hora
0 * * * * cd /ruta/a/tu/proyecto && node scripts/refresh-trending.js >> /tmp/trending-refresh.log 2>&1
```

#### Opción D: Programar con Task Scheduler (Windows)
1. Abre Task Scheduler
2. Crear tarea básica
3. Trigger: Diariamente o cada hora
4. Acción: Iniciar programa
5. Programa: `node`
6. Argumentos: `C:\ruta\a\tu\proyecto\scripts\refresh-trending.js`

### 4. Verificar que funciona

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Visitar algunas páginas de items/quests
# http://localhost:3000/en/items/...
# http://localhost:3000/en/quests/...

# Refrescar las vistas
node scripts/refresh-trending.js

# Ver el trending en la página principal
# http://localhost:3000/en
```

## Componentes del Sistema

### APIs Disponibles

1. **Track Item View**
   ```typescript
   POST /api/track-item
   Body: { itemId: "string" }
   ```

2. **Track Quest View**
   ```typescript
   POST /api/track-quest
   Body: { questId: "string" }
   ```

3. **Get Trending Data**
   ```typescript
   GET /api/trending?period=24h&limit=10
   // period: "24h" | "7d"
   // limit: número de resultados
   ```

4. **Refresh Views**
   ```typescript
   POST /api/trending
   // Refresca las vistas materializadas
   ```

### Componentes React

#### TrendingSection (Principal)
```tsx
import TrendingSection from "@/components/TrendingSection";

<TrendingSection lang={lang} />
```

#### TrendingStats (Widget)
```tsx
import TrendingStats from "@/components/TrendingStats";

// En el footer o sidebar
<TrendingStats />
```

#### TrackItemView / TrackQuestView (Tracking automático)
```tsx
// Ya integrado en las páginas de detalle
// No necesitas hacer nada, funciona automáticamente
```

## Queries SQL Útiles

### Ver datos en las tablas
```sql
-- Total de vistas
SELECT COUNT(*) FROM item_views;
SELECT COUNT(*) FROM quest_views;

-- Vistas de hoy
SELECT COUNT(*) FROM item_views WHERE viewed_at > CURRENT_DATE;

-- Top 5 items
SELECT * FROM trending_items_24h LIMIT 5;
```

### Mantenimiento

```sql
-- Limpiar datos antiguos (opcional)
DELETE FROM item_views WHERE viewed_at < NOW() - INTERVAL '90 days';
DELETE FROM quest_views WHERE viewed_at < NOW() - INTERVAL '90 days';

-- Optimizar tablas
VACUUM ANALYZE item_views;
VACUUM ANALYZE quest_views;
```

## Troubleshooting

### No aparecen datos en trending

1. **Verificar que hay vistas registradas:**
   ```sql
   SELECT COUNT(*) FROM item_views;
   SELECT COUNT(*) FROM quest_views;
   ```

2. **Refrescar las vistas materializadas:**
   ```sql
   SELECT refresh_trending_views();
   ```

3. **Verificar las vistas materializadas:**
   ```sql
   SELECT * FROM trending_items_24h;
   SELECT * FROM trending_quests_24h;
   ```

### Error de permisos

Asegúrate de que las políticas RLS están habilitadas:
```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename IN ('item_views', 'quest_views');

-- Si no existen, ejecuta trending-schema.sql de nuevo
```

### Performance lento

1. **Verificar índices:**
   ```sql
   SELECT * FROM pg_indexes 
   WHERE tablename IN ('item_views', 'quest_views');
   ```

2. **Actualizar estadísticas:**
   ```sql
   ANALYZE item_views;
   ANALYZE quest_views;
   ```

## Analytics Avanzado

Para análisis más profundos, usa `trending-analytics.sql`:

```sql
-- Top items por día de la semana
-- Patrones de navegación
-- Correlación entre items y quests
-- Detección de bots
-- Y mucho más...
```

Consulta el archivo `trending-analytics.sql` para ver todas las queries disponibles.

## Próximos Pasos

- [ ] Configurar pg_cron en producción
- [ ] Implementar dashboard de analytics
- [ ] Agregar más períodos (mensual, anual)
- [ ] Exportar datos a CSV/JSON
- [ ] Integrar con Google Analytics

## Soporte

- **Documentación completa:** `TRENDING_SYSTEM.md`
- **Analytics SQL:** `trending-analytics.sql`
- **Schema SQL:** `trending-schema.sql`
