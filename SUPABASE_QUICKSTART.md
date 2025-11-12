# 🚀 Guía Rápida de Configuración de Supabase

## Pasos para configurar el caché de YouTube:

### 1. Crear proyecto en Supabase
- Ve a https://supabase.com y crea una cuenta
- Crea un nuevo proyecto (tarda 2-3 minutos)

### 2. Ejecutar el schema SQL
- Abre el **SQL Editor** en tu proyecto de Supabase
- Copia todo el contenido de `supabase-schema.sql`
- Pega y ejecuta (▶️)

### 3. Obtener credenciales
- Ve a **Settings** > **API**
- Copia el **Project URL** y el **anon/public key**

### 4. Configurar variables de entorno
Crea/edita `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
YOUTUBE_API_KEY=tu-youtube-api-key
```

### 5. Reiniciar servidor
```bash
npm run dev
```

## ✅ Verificación

Busca en la consola del navegador (F12):
- Primera búsqueda: `💾 Saved to cache...`
- Segunda búsqueda: `✅ Cache hit...`
