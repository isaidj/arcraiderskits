# Sistema de Indicadores de Tendencia - Arc Raiders Kits

## Descripción

Sistema de **indicadores de tendencia** (trend indicators) que muestra si un item o quest está subiendo ↗️, bajando ↘️, manteniéndose igual → o es nuevo ✨ en el ranking comparando el período actual con el anterior.

## Características

✅ **Indicadores visuales** - Flechas y colores que muestran cambios de posición  
✅ **Comparación de períodos** - Compara 24h vs 24h-48h o 7d vs 7d-14d  
✅ **Badges animados** - Indicadores con colores y efectos visuales  
✅ **Auto-calculado** - La API calcula automáticamente los cambios de ranking

## 🎨 Indicadores de Tendencia

| Indicador | Color | Significado | Descripción |
|-----------|-------|-------------|-------------|
| ↑ | 🟢 Verde | **Subiendo** | El item/quest ha mejorado su posición |
| ↓ | 🔴 Rojo | **Bajando** | El item/quest ha empeorado su posición |
| → | ⚪ Gris | **Igual** | Mantiene la misma posición |
| ✨ | 🟡 Amarillo | **Nuevo** | No estaba en el ranking anterior |

## 📋 Instalación

### 1. Ejecutar nuevo esquema SQL

Ejecuta el archivo `trending-schema-v2.sql` en tu proyecto de Supabase:

```sql
-- En Supabase SQL Editor
-- Copia y pega el contenido de trending-schema-v2.sql
```

Esto creará:
- 8 nuevas vistas materializadas con ranking
- Función actualizada `refresh_trending_views_v2()`
- Índices optimizados

### 2. Refrescar las vistas

```bash
# Opción 1: Manualmente en Supabase SQL Editor
SELECT refresh_trending_views_v2();

# Opción 2: Usando el endpoint API
curl -X POST https://tu-dominio.com/api/trending

# Opción 3: Usando el script actualizado
node scripts/refresh-trending.js
```

### 3. Verificar que funciona

```bash
npm run dev
```

Visita la página principal y verás los indicadores de tendencia en las cards de trending.

## 🔧 Componentes

### TrendIndicator

Componente reutilizable para mostrar indicadores de tendencia:

```tsx
import TrendIndicator from "@/components/TrendIndicator";

<TrendIndicator 
  direction="up"      // 'up' | 'down' | 'same' | 'new'
  rankChange={5}      // Número de posiciones
  size="md"           // 'sm' | 'md' | 'lg'
  showLabel={true}    // Mostrar número de cambio
/>
```

### Props actualizadas

**ItemCard** y **QuestCard** ahora aceptan:

```tsx
<ItemCard
  // ... props existentes
  trendDirection="up"
  rankChange={3}
/>

<QuestCard
  // ... props existentes  
  trendDirection="new"
  rankChange={0}
/>
```

## 📊 Cómo funciona

### 1. Vistas Materializadas

El sistema crea vistas para el período actual y el anterior:

**Items 24h:**
- `trending_items_24h_ranked` - Últimas 24 horas (actual)
- `trending_items_previous_24h_ranked` - 24h-48h (anterior)

**Items 7d:**
- `trending_items_7d_ranked` - Últimos 7 días (actual)
- `trending_items_previous_7d_ranked` - 7d-14d (anterior)

**Quests 24h:**
- `trending_quests_24h_ranked` - Últimas 24 horas (actual)
- `trending_quests_previous_24h_ranked` - 24h-48h (anterior)

**Quests 7d:**
- `trending_quests_7d_ranked` - Últimos 7 días (actual)
- `trending_quests_previous_7d_ranked` - 7d-14d (anterior)

### 2. Cálculo del Cambio

La API `/api/trending` compara automáticamente:

```typescript
// Ejemplo de cálculo
const previousRank = 10;  // Estaba en posición 10
const currentRank = 5;    // Ahora está en posición 5

const rankChange = previousRank - currentRank; // = 5 (subió 5 posiciones)
const trendDirection = rankChange > 0 ? 'up' : 
                       rankChange < 0 ? 'down' : 'same';
```

### 3. Respuesta de la API

```json
{
  "period": "24h",
  "items": [
    {
      "item_id": "oil",
      "view_count": 150,
      "current_rank": 1,
      "previous_rank": 5,
      "trend_direction": "up",
      "rank_change": 4,
      "data": { /* item completo */ }
    }
  ]
}
```

## 🎯 Ejemplos de Uso

### Mostrar top 10 con tendencias

```tsx
import TrendingSection from "@/components/TrendingSection";

// En tu página
<TrendingSection lang={lang} trendingData={trendingData} />
```

### Personalizar indicador

```tsx
<TrendIndicator 
  direction="up" 
  rankChange={10}
  size="lg"
  showLabel={true}
  className="absolute top-2 left-2"
/>
```

## 🔍 Queries SQL Útiles

### Ver items con mayor subida

```sql
SELECT 
  c.item_id,
  c.view_count,
  c.current_rank,
  p.previous_rank,
  (p.previous_rank - c.current_rank) as rank_change
FROM trending_items_24h_ranked c
LEFT JOIN trending_items_previous_24h_ranked p ON c.item_id = p.item_id
WHERE p.previous_rank IS NOT NULL
ORDER BY (p.previous_rank - c.current_rank) DESC
LIMIT 10;
```

### Ver items nuevos en trending

```sql
SELECT 
  c.item_id,
  c.view_count,
  c.current_rank
FROM trending_items_24h_ranked c
LEFT JOIN trending_items_previous_24h_ranked p ON c.item_id = p.item_id
WHERE p.previous_rank IS NULL
ORDER BY c.current_rank
LIMIT 10;
```

### Estadísticas de cambios

```sql
SELECT 
  COUNT(*) FILTER (WHERE p.previous_rank - c.current_rank > 0) as trending_up,
  COUNT(*) FILTER (WHERE p.previous_rank - c.current_rank < 0) as trending_down,
  COUNT(*) FILTER (WHERE p.previous_rank - c.current_rank = 0) as trending_same,
  COUNT(*) FILTER (WHERE p.previous_rank IS NULL) as trending_new
FROM trending_items_24h_ranked c
LEFT JOIN trending_items_previous_24h_ranked p ON c.item_id = p.item_id;
```

## ⚙️ Configuración Avanzada

### Cambiar colores de los indicadores

Edita `src/components/TrendIndicator.tsx`:

```tsx
const getIndicatorContent = () => {
  switch (direction) {
    case "up":
      return {
        color: "text-green-400",    // Cambiar color
        bgColor: "bg-green-500/10", // Cambiar fondo
        // ...
      };
  }
};
```

### Ajustar períodos de comparación

En `trending-schema-v2.sql`, modifica los intervalos:

```sql
-- Cambiar de 24h a 12h por ejemplo
WHERE viewed_at > NOW() - INTERVAL '12 hours'
```

## 🔄 Mantenimiento

### Actualizar vistas regularmente

Las vistas deben refrescarse periódicamente para reflejar cambios:

```bash
# Cada hora (recomendado)
0 * * * * cd /ruta/proyecto && node scripts/refresh-trending.js

# Cada 30 minutos (más frecuente)
*/30 * * * * cd /ruta/proyecto && node scripts/refresh-trending.js
```

### Monitorear performance

```sql
-- Tiempo de ejecución del refresh
EXPLAIN ANALYZE SELECT refresh_trending_views_v2();

-- Tamaño de las vistas
SELECT 
  schemaname || '.' || matviewname as view_name,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||matviewname)) as size
FROM pg_matviews
WHERE matviewname LIKE 'trending_%'
ORDER BY pg_total_relation_size(schemaname||'.'||matviewname) DESC;
```

## 🐛 Troubleshooting

### No aparecen indicadores

1. **Verifica que las vistas existen:**
   ```sql
   SELECT matviewname FROM pg_matviews WHERE matviewname LIKE 'trending_%ranked';
   ```

2. **Refresca las vistas:**
   ```sql
   SELECT refresh_trending_views_v2();
   ```

3. **Verifica que hay datos del período anterior:**
   ```sql
   SELECT COUNT(*) FROM trending_items_previous_24h_ranked;
   ```

### Todos aparecen como "new"

Significa que no hay datos del período anterior. Necesitas:
- Esperar que pasen 24h/7d para tener datos previos
- O insertar datos de prueba manualmente

### Error "function does not exist"

Si usas la función antigua, actualiza:

```sql
-- Ejecuta trending-schema-v2.sql para crear refresh_trending_views_v2()
```

## 📈 Mejoras Futuras

- [ ] Animaciones al cambiar de posición
- [ ] Histórico de cambios de ranking
- [ ] Gráficos de tendencia temporal
- [ ] Predicción de tendencias
- [ ] Alertas para items en alza
- [ ] Comparar con períodos personalizados

## 📚 Referencias

- **Esquema original:** `trending-schema.sql`
- **Esquema v2 (con ranking):** `trending-schema-v2.sql`
- **Sistema completo:** `TRENDING_SYSTEM.md`
- **Guía rápida:** `TRENDING_QUICKSTART.md`
