# 🔄 Sistema de Validación y Sincronización

## 📋 Cómo Funciona

El sistema de validación compara automáticamente los datos en Supabase con el repositorio oficial de Arc Raiders para detectar actualizaciones.

### Componentes del Sistema

```
┌─────────────────────────────────────────────────────────┐
│ GitHub: RaidTheory/arcraiders-data                      │
│ (Repositorio oficial con datos del juego)              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ Script: validate-sync.js                                │
│ - Compara commits                                       │
│ - Cuenta archivos vs registros                         │
│ - Detecta diferencias                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ ¿Base de datos desactualizada?                         │
├─────────────────┬───────────────────────────────────────┤
│ SI              │ NO                                     │
│ ↓               │ ↓                                      │
│ sync-data       │ Todo OK ✅                            │
└─────────────────┴───────────────────────────────────────┘
```

## 🚀 Uso

### 1. Validación Manual

Verifica si la base de datos está sincronizada:

```bash
npm run validate-sync
```

**Salida esperada:**

```
🔍 Arc Raiders Data Sync Validation

============================================================

📌 Repository Status:
   Latest commit: a1b2c3d
   Commit date: 11/13/2025, 10:30:00 AM
   Message: "Update items data"
   ✅ Local repository is up to date

📊 Repository Files:
   Items: 400
   Quests: 120
   Hideout Modules: 9
   Bots: 20
   Trades: 900

🗄️  Supabase Records:
   Items: 400
   Quests: 120
   Hideout Modules: 9
   Bots: 20
   Trades: 900

🔄 Sync Status:
   ✅ DATABASE IS IN SYNC

⏰ Last Supabase Update: 11/13/2025, 9:00:00 AM

============================================================
```

**Si hay diferencias:**

```
🔄 Sync Status:
   ⚠️  DATABASE OUT OF SYNC

   Differences detected:
   - items: 395 in DB vs 400 in repo (+5)
   - quests: 118 in DB vs 120 in repo (+2)

   💡 Run 'npm run sync-data' to update Supabase
```

### 2. Sincronización Manual

Si detectas que está desactualizado, sincroniza:

```bash
npm run sync-data
```

Esto ejecuta:
1. `update-data` - Actualiza el repositorio local
2. `import-data` - Importa datos a Supabase
3. Guarda metadata de sincronización

### 3. Sincronización Automática (GitHub Actions)

#### Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Agrega estos secrets:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

#### Opcionales para notificaciones:

```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

El workflow se ejecuta:
- ✅ **Automáticamente** cada día a las 2 AM UTC
- ✅ **Manualmente** desde GitHub Actions tab
- ✅ (Opcional) En cada push a `main`

## 📊 Tabla de Metadata

La tabla `sync_metadata` guarda información de sincronización:

```sql
CREATE TABLE sync_metadata (
  id TEXT PRIMARY KEY,
  last_commit_hash TEXT NOT NULL,        -- Hash del último commit
  last_commit_date TIMESTAMPTZ NOT NULL, -- Fecha del commit
  last_commit_message TEXT,              -- Mensaje del commit
  last_sync_date TIMESTAMPTZ NOT NULL,   -- Cuándo se sincronizó
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Consultar Estado de Sincronización

```sql
SELECT 
  last_commit_hash,
  last_commit_date,
  last_commit_message,
  last_sync_date,
  EXTRACT(EPOCH FROM (NOW() - last_sync_date))/3600 as hours_since_sync
FROM sync_metadata
WHERE id = 'arc_raiders_data';
```

## 🎨 Componente de Estado (Frontend)

Muestra el estado de sincronización en tu UI:

```tsx
import { SyncStatus } from "@/components/SyncStatus";

export default function Footer() {
  return (
    <footer>
      <SyncStatus />
    </footer>
  );
}
```

Esto muestra:
- 🟢 Punto verde si la data es reciente (< 24h)
- 🟡 Punto amarillo si es más antigua
- Link al commit en GitHub
- Tiempo desde última actualización

## 🔔 Notificaciones

### Discord (Opcional)

El workflow de GitHub puede enviar notificaciones a Discord cuando sincroniza datos:

1. Crea un webhook en tu servidor de Discord
2. Agrega `DISCORD_WEBHOOK_URL` a los secrets de GitHub
3. El workflow enviará notificaciones automáticamente

### Otras Opciones

Puedes integrar con:
- **Slack** - Usando Slack webhooks
- **Email** - Con GitHub Actions email
- **Telegram** - Con telegram-action

## 📈 Monitoreo

### Ver Logs del Workflow

1. Ve a GitHub → Actions
2. Click en "Validate & Sync Arc Raiders Data"
3. Revisa los logs de cada ejecución

### Estadísticas de Sincronización

Puedes crear un dashboard en Supabase para monitorear:

```sql
-- Historial de sincronizaciones (si guardas histórico)
SELECT 
  DATE(last_sync_date) as sync_date,
  COUNT(*) as sync_count
FROM sync_metadata
GROUP BY DATE(last_sync_date)
ORDER BY sync_date DESC;
```

## 🛠️ Troubleshooting

### Error: "Missing Supabase credentials"

**Problema:** Las variables de entorno no están configuradas.

**Solución:**
```bash
# Verifica .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### Error: "Could not get repository info"

**Problema:** No se puede acceder al repositorio de Git.

**Solución:**
```bash
# Elimina el directorio temporal y vuelve a intentar
rm -rf .tmp-arcraiders-data
npm run update-data
```

### Diferencias Persistentes

**Problema:** Siempre muestra diferencias aunque sincronices.

**Posibles causas:**
1. El script de importación tiene errores
2. Algunos archivos no se están importando
3. Foreign keys fallando

**Solución:**
```bash
# Ejecuta con logs detallados
npm run import-data 2>&1 | tee import.log

# Revisa errores en el log
grep "Error" import.log
```

### GitHub Actions Falla

**Problema:** El workflow en GitHub Actions falla.

**Verificar:**
1. ✅ Secrets están configurados correctamente
2. ✅ La rama es `main` (no `master`)
3. ✅ El repositorio tiene permisos de Actions

**Solución:**
- Revisa los logs en GitHub Actions
- Verifica que las secrets no tengan espacios extras
- Prueba ejecución manual primero

## 📅 Frecuencia Recomendada

### Producción
- **GitHub Actions:** Diario (2 AM UTC)
- **Manual:** Solo cuando sepas que hay updates

### Desarrollo
- **Validación:** Antes de cada deploy
- **Sincronización:** Cuando notes datos desactualizados

## 🔐 Seguridad

### ⚠️ IMPORTANTE

- **NUNCA** commitees `.env.local` al repositorio
- **SOLO** usa `SUPABASE_SERVICE_ROLE_KEY` en servidor
- Los secrets de GitHub están **encriptados**
- Las GitHub Actions corren en **entorno aislado**

### Permisos Mínimos

El service role key necesita:
- ✅ SELECT en todas las tablas
- ✅ INSERT/UPDATE en tablas de datos
- ✅ DELETE para limpiar antes de importar

## 🎯 Mejores Prácticas

### 1. Validar Antes de Deploy

```json
{
  "scripts": {
    "predeploy": "npm run validate-sync",
    "deploy": "vercel --prod"
  }
}
```

### 2. Notificar al Equipo

Configura notificaciones para que el equipo sepa cuándo se actualizan datos.

### 3. Mantener Histórico

Considera guardar snapshots de datos importantes:

```sql
CREATE TABLE sync_history AS 
SELECT 
  NOW() as snapshot_date,
  (SELECT COUNT(*) FROM items) as items_count,
  (SELECT COUNT(*) FROM quests) as quests_count
  -- ... más tablas
;
```

### 4. Rollback de Emergencia

Si una importación corrompe datos:

```bash
# Restaurar desde backup de Supabase
# Dashboard → Database → Backups → Restore
```

## 📚 Referencias

- [Arc Raiders Data Repository](https://github.com/RaidTheory/arcraiders-data)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Supabase Documentation](https://supabase.com/docs)

---

**✨ Con este sistema, tu base de datos siempre estará sincronizada con los últimos datos de Arc Raiders!**
