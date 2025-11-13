# 🗄️ Migración de Datos a Supabase

Este documento explica cómo migrar los datos de Arc Raiders desde archivos JSON locales a Supabase.

## 📋 Estructura de Base de Datos

La base de datos está organizada de forma **normalizada** con las siguientes tablas:

### 📦 Items
- **items**: Tabla principal con información básica de items
- **item_translations**: Traducciones de nombres y descripciones (multiidioma)
- **item_recipes**: Recetas de crafteo
- **item_recycles**: Items obtenidos al reciclar
- **item_effects**: Efectos de items con traducciones

### 📋 Quests (Misiones)
- **quests**: Tabla principal de misiones
- **quest_translations**: Traducciones de nombres de misiones
- **quest_objectives**: Objetivos de misiones con traducciones
- **quest_rewards**: Recompensas de misiones
- **quest_dependencies**: Relaciones entre misiones (previous/next)

### 🏠 Hideout (Refugio)
- **hideout_modules**: Módulos del hideout
- **hideout_module_translations**: Traducciones de nombres de módulos
- **hideout_module_levels**: Niveles de cada módulo
- **hideout_level_requirements**: Requisitos de items para cada nivel

### 🤖 Bots
- **bots**: Información de enemigos/bots
- **bot_drops**: Items que dropean los bots

### 💰 Trades (Comercio)
- **trades**: Intercambios disponibles con traders

### 🎓 Skill Nodes & Projects
- **skill_nodes**: Nodos del árbol de habilidades (JSONB)
- **projects**: Proyectos del juego (JSONB)

### 🎥 YouTube Cache
- **youtube_cache**: Cache de búsquedas de videos de YouTube

## 🚀 Instrucciones de Migración

### 1. Crear las Tablas en Supabase

1. Ve a tu proyecto de Supabase
2. Abre el SQL Editor
3. Ejecuta el contenido completo de `supabase-arcraiders-schema.sql`

Esto creará:
- ✅ Todas las tablas necesarias
- ✅ Índices para optimización
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de lectura pública
- ✅ Triggers para actualizar `updated_at`

### 2. Configurar Variables de Entorno

Asegúrate de tener en tu `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key  # ⚠️ Solo para servidor
```

### 3. Actualizar el Repositorio de Datos

```bash
npm run update-data
```

Esto clona/actualiza el repositorio de Arc Raiders data en `.tmp-arcraiders-data/`

### 4. Importar Datos a Supabase

```bash
npm run import-data
```

Esto ejecuta el script que:
1. ✅ Importa **items** (~400 items con traducciones)
2. ✅ Importa **quests** con objetivos y recompensas
3. ✅ Importa **hideout modules** con niveles y requisitos
4. ✅ Importa **bots** con sus drops
5. ✅ Importa **trades** (~900 intercambios)
6. ✅ Importa **skill nodes** como JSONB
7. ✅ Importa **projects** como JSONB

### 5. Sincronizar Todo (Opcional)

Para actualizar y importar en un solo comando:

```bash
npm run sync-data
```

## 📊 Ventajas de Usar Supabase

### 🚀 Rendimiento
- **Consultas optimizadas** con índices en columnas clave
- **Filtrado del lado del servidor** (no cargar todo en cliente)
- **Cache automático** con Supabase Realtime

### 🌍 Multiidioma
- Estructura normalizada para traducciones
- Fácil agregar nuevos idiomas
- Consultas eficientes por idioma

### 🔍 Búsquedas Avanzadas
```sql
-- Buscar items por tipo y rareza
SELECT * FROM items WHERE type = 'Weapon' AND rarity = 'Legendary';

-- Buscar items con sus traducciones en español
SELECT i.*, it.name, it.description 
FROM items i
JOIN item_translations it ON i.id = it.item_id
WHERE it.lang = 'es';

-- Encontrar todas las quests de un trader
SELECT q.*, qt.name 
FROM quests q
JOIN quest_translations qt ON q.id = qt.quest_id
WHERE q.trader = 'Celeste' AND qt.lang = 'en';
```

### 🔄 Actualización Fácil
- Script automatizado para sincronizar datos
- No necesitas regenerar build de Next.js
- Datos actualizados en tiempo real

### 💾 Sin Límites de Tamaño
- No hay límite de 50MB del bundle de Next.js
- Archivos JSON ya no aumentan el tamaño del build
- Mejor tiempo de carga inicial

## 🛠️ Mantenimiento

### Actualizar Datos Semanalmente

Puedes automatizar la actualización con un cron job o GitHub Actions:

```yaml
# .github/workflows/update-data.yml
name: Update Supabase Data
on:
  schedule:
    - cron: '0 0 * * 0'  # Cada domingo a medianoche
  workflow_dispatch:  # Manual

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run sync-data
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

### Limpiar Cache de YouTube

El cache de YouTube se limpia automáticamente después de 7 días. Puedes ejecutar manualmente:

```javascript
import { cleanupExpiredCache } from '@/lib/youtube-cache';
await cleanupExpiredCache();
```

## 🔧 Troubleshooting

### Error: "Missing Supabase credentials"
- Verifica que `.env.local` tenga las variables correctas
- Asegúrate de usar `SUPABASE_SERVICE_ROLE_KEY` (no anon key) para importación

### Error: "Unique constraint violation"
- Los datos ya existen en Supabase
- El script hace `upsert` automáticamente, debería funcionar
- Si falla, elimina manualmente las filas conflictivas

### Importación Lenta
- Es normal para la primera importación (~5-10 minutos)
- Los items son ~400 con múltiples traducciones
- Las siguientes importaciones son más rápidas (solo actualiza cambios)

## 📈 Próximos Pasos

1. **Migrar componentes** para usar Supabase en lugar de JSON local
2. **Implementar búsqueda en tiempo real** con Supabase
3. **Agregar filtros avanzados** usando la base de datos
4. **Implementar paginación** para listas grandes
5. **Agregar análisis** de datos más populares

## 🔐 Seguridad

- ✅ **RLS habilitado** en todas las tablas
- ✅ **Lectura pública** permitida (datos públicos del juego)
- ✅ **Escritura solo desde servidor** (service_role key)
- ✅ **No exponer service_role key** al cliente

## 📚 Recursos

- [Supabase Documentation](https://supabase.com/docs)
- [Arc Raiders Data Repository](https://github.com/RaidTheory/arcraiders-data)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
