# 🗄️ Configuración de Supabase para YouTube Cache

Esta guía te ayudará a configurar Supabase para el sistema de caché que reduce el consumo de cuota de YouTube API.

---

## 📋 Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Click en **"New Project"**
4. Llena los datos:
   - **Name**: `arcraiderskits` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: Selecciona la más cercana a tu audiencia
   - **Pricing Plan**: Free tier es suficiente para empezar
5. Click en **"Create new project"**
6. Espera 2-3 minutos mientras se crea la base de datos

---

## 🔑 Paso 2: Obtener Credenciales

1. En tu proyecto, ve a **Settings** (⚙️) > **API**
2. Copia las siguientes credenciales:

   ```bash
   # URL del proyecto
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   
   # Anon/Public Key (clave pública, segura para el cliente)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Pega estas variables en tu archivo `.env.local`:

   ```bash
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

---

## 🏗️ Paso 3: Crear la Tabla `youtube_cache`

### Opción A: SQL Editor (Recomendado)

1. En Supabase, ve a **SQL Editor** (icono de base de datos)
2. Click en **"New query"**
3. Copia y pega el contenido completo de `supabase-schema.sql`
4. Click en **"Run"** (▶️)
5. Verifica que aparezca: **"Success. No rows returned"**

### Opción B: Table Editor (Manual)

1. Ve a **Table Editor**
2. Click en **"Create a new table"**
3. Configura:
   - **Name**: `youtube_cache`
   - **Enable Row Level Security**: ✅ (activado)

4. Agrega las siguientes columnas:

   | Nombre | Tipo | Default | Opciones |
   |--------|------|---------|----------|
   | `id` | uuid | gen_random_uuid() | Primary Key |
   | `query` | text | - | Not null, Unique |
   | `video_id` | text | - | Not null |
   | `title` | text | - | Not null |
   | `thumbnail_url` | text | - | Nullable |
   | `channel_title` | text | - | Nullable |
   | `description` | text | - | Nullable |
   | `published_at` | timestamptz | - | Nullable |
   | `updated_at` | timestamptz | now() | Not null |
   | `created_at` | timestamptz | now() | Not null |

---

## 🔐 Paso 4: Configurar Row Level Security (RLS)

Las políticas de seguridad ya están incluidas en `supabase-schema.sql`. Si las creaste manualmente:

1. Ve a **Authentication** > **Policies**
2. Selecciona la tabla `youtube_cache`
3. Agrega dos políticas:

   **Política 1: Lectura Pública**
   ```sql
   CREATE POLICY "Allow public read access"
   ON youtube_cache
   FOR SELECT
   USING (true);
   ```

   **Política 2: Escritura del Servidor**
   ```sql
   CREATE POLICY "Allow server write access"
   ON youtube_cache
   FOR ALL
   USING (auth.role() = 'service_role');
   ```

---

## ✅ Paso 5: Verificar Instalación

### Verificar Variables de Entorno

```bash
# En la raíz del proyecto
cat .env.local
```

Debe contener:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
YOUTUBE_API_KEY=AIzaSy...
```

### Probar la Conexión

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre el navegador en cualquier quest o item con guía de YouTube
3. Abre la consola del navegador (F12)
4. Busca logs como:
   ```
   📭 Cache miss for: "Battle at the Dam"
   🔍 Cache miss, searching YouTube API for: "Battle at the Dam"
   💾 Cached video for: "Battle at the Dam" (videoId: abc123)
   ```

5. Recarga la página:
   ```
   ✅ Cache hit for: "Battle at the Dam" (age: 0 days)
   🎯 Serving from cache: "Battle at the Dam"
   ```

---

## 📊 Monitorear el Caché

### Ver Datos en Supabase

1. Ve a **Table Editor** > `youtube_cache`
2. Verás todas las búsquedas almacenadas con:
   - Query original
   - Video ID
   - Fecha de última actualización

### Estadísticas del Caché

Puedes crear un endpoint para ver estadísticas:

```typescript
// src/app/api/cache-stats/route.ts
import { getCacheStats } from '@/lib/youtube-cache';
import { NextResponse } from 'next/server';

export async function GET() {
  const stats = await getCacheStats();
  return NextResponse.json(stats);
}
```

Accede a: `http://localhost:3000/api/cache-stats`

---

## 🗑️ Mantenimiento del Caché

### Limpiar Registros Viejos (Opcional)

Puedes ejecutar manualmente desde SQL Editor:

```sql
-- Borrar registros con más de 7 días
DELETE FROM youtube_cache
WHERE updated_at < NOW() - INTERVAL '7 days';
```

O crear un Cron Job en Supabase:

1. Ve a **Database** > **Extensions**
2. Activa **pg_cron**
3. Crea un job:

```sql
-- Ejecutar limpieza todos los días a las 3 AM
SELECT cron.schedule(
  'cleanup-youtube-cache',
  '0 3 * * *',
  $$
  DELETE FROM youtube_cache
  WHERE updated_at < NOW() - INTERVAL '7 days';
  $$
);
```

---

## 🎯 Beneficios del Sistema de Caché

### Sin Caché (antes)
- **Cuota diaria**: 10,000 unidades
- **Costo por búsqueda**: 100 unidades
- **Búsquedas posibles**: 100 búsquedas/día
- **Problema**: Si 1000 usuarios buscan "Battle at the Dam", consumes 1000 × 100 = 100,000 unidades ❌

### Con Caché (ahora)
- **Primera búsqueda**: 100 unidades (se guarda en caché)
- **Búsquedas siguientes**: 0 unidades (se sirve desde caché) ✅
- **Duración**: 7 días
- **Resultado**: Si 1000 usuarios buscan lo mismo, solo consumes 100 unidades 🎉

### Reducción de Cuota

Para 10 misiones populares buscadas 100 veces cada una:

| Métrica | Sin Caché | Con Caché | Ahorro |
|---------|-----------|-----------|--------|
| Búsquedas | 1,000 | 1,000 | - |
| Unidades consumidas | 100,000 | 1,000 | **99%** |
| Días hasta límite | 0.1 días | 10 días | **100x más duración** |

---

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"
- Verifica que `.env.local` existe y tiene las variables correctas
- Reinicia el servidor: `npm run dev`

### Error: "relation 'youtube_cache' does not exist"
- Ejecuta el script SQL completo desde `supabase-schema.sql`
- Verifica en Table Editor que la tabla existe

### Error: "new row violates row-level security policy"
- Verifica que las políticas RLS están creadas
- La política de escritura debe permitir `service_role`

### Los videos no se guardan en caché
- Revisa los logs del servidor para ver errores
- Verifica las credenciales en `.env.local`
- Comprueba que la tabla tiene la estructura correcta

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [YouTube API Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)

---

## ✨ Próximos Pasos

1. ✅ Configura Supabase
2. ✅ Agrega variables de entorno
3. ✅ Ejecuta el schema SQL
4. 🚀 Despliega a producción en Vercel
5. 📊 Monitorea el uso de cuota en [Google Cloud Console](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)

---

**¡Listo!** Tu aplicación ahora consume hasta **99% menos cuota** de YouTube API gracias al sistema de caché con Supabase 🎉
