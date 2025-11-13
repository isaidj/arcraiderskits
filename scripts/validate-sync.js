/**
 * 🔍 Script de Validación de Sincronización
 *
 * Este script verifica si los datos en Supabase están actualizados
 * comparando con el repositorio de Arc Raiders
 *
 * Uso: node scripts/validate-sync.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config({ path: ".env.local" });

const TEMP_DIR = path.join(__dirname, "..", ".tmp-arcraiders-data");
const REPO_URL = "https://github.com/RaidTheory/arcraiders-data.git";

// Cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Obtiene el último commit del repositorio
 */
function getLatestCommit() {
  try {
    // Actualizar el repositorio primero
    if (!fs.existsSync(TEMP_DIR)) {
      console.log("📥 Cloning repository...");
      execSync(`git clone --depth 1 ${REPO_URL} "${TEMP_DIR}"`, { stdio: "pipe" });
    } else {
      console.log("📥 Updating repository...");
      execSync("git fetch origin main", { cwd: TEMP_DIR, stdio: "pipe" });
    }

    // Obtener hash del último commit
    const localCommit = execSync("git rev-parse HEAD", {
      cwd: TEMP_DIR,
      encoding: "utf8",
    }).trim();

    const remoteCommit = execSync("git rev-parse origin/main", {
      cwd: TEMP_DIR,
      encoding: "utf8",
    }).trim();

    // Obtener fecha del último commit
    const commitDate = execSync("git log -1 --format=%cd --date=iso origin/main", {
      cwd: TEMP_DIR,
      encoding: "utf8",
    }).trim();

    // Obtener mensaje del último commit
    const commitMessage = execSync("git log -1 --format=%s origin/main", {
      cwd: TEMP_DIR,
      encoding: "utf8",
    }).trim();

    return {
      local: localCommit,
      remote: remoteCommit,
      date: new Date(commitDate),
      message: commitMessage,
      needsUpdate: localCommit !== remoteCommit,
    };
  } catch (error) {
    console.error("❌ Error getting commit info:", error.message);
    return null;
  }
}

/**
 * Cuenta archivos en el repositorio
 */
function countRepositoryFiles() {
  const counts = {
    items: 0,
    quests: 0,
    hideout: 0,
    bots: 0,
    trades: 0,
  };

  try {
    const itemsDir = path.join(TEMP_DIR, "items");
    if (fs.existsSync(itemsDir)) {
      counts.items = fs.readdirSync(itemsDir).filter((f) => f.endsWith(".json")).length;
    }

    const questsDir = path.join(TEMP_DIR, "quests");
    if (fs.existsSync(questsDir)) {
      counts.quests = fs.readdirSync(questsDir).filter((f) => f.endsWith(".json")).length;
    }

    const hideoutDir = path.join(TEMP_DIR, "hideout");
    if (fs.existsSync(hideoutDir)) {
      counts.hideout = fs.readdirSync(hideoutDir).filter((f) => f.endsWith(".json")).length;
    }

    const botsFile = path.join(TEMP_DIR, "bots.json");
    if (fs.existsSync(botsFile)) {
      const bots = JSON.parse(fs.readFileSync(botsFile, "utf8"));
      counts.bots = Array.isArray(bots) ? bots.length : 0;
    }

    const tradesFile = path.join(TEMP_DIR, "trades.json");
    if (fs.existsSync(tradesFile)) {
      const trades = JSON.parse(fs.readFileSync(tradesFile, "utf8"));
      counts.trades = Array.isArray(trades) ? trades.length : 0;
    }
  } catch (error) {
    console.error("❌ Error counting files:", error.message);
  }

  return counts;
}

/**
 * Cuenta registros en Supabase
 */
async function countSupabaseRecords() {
  const counts = {
    items: 0,
    quests: 0,
    hideout: 0,
    bots: 0,
    trades: 0,
  };

  try {
    const { count: itemsCount } = await supabase.from("items").select("*", { count: "exact", head: true });
    counts.items = itemsCount || 0;

    const { count: questsCount } = await supabase.from("quests").select("*", { count: "exact", head: true });
    counts.quests = questsCount || 0;

    const { count: hideoutCount } = await supabase.from("hideout_modules").select("*", { count: "exact", head: true });
    counts.hideout = hideoutCount || 0;

    const { count: botsCount } = await supabase.from("bots").select("*", { count: "exact", head: true });
    counts.bots = botsCount || 0;

    const { count: tradesCount } = await supabase.from("trades").select("*", { count: "exact", head: true });
    counts.trades = tradesCount || 0;
  } catch (error) {
    console.error("❌ Error counting Supabase records:", error.message);
  }

  return counts;
}

/**
 * Obtiene la última actualización en Supabase
 */
async function getLastSupabaseUpdate() {
  try {
    // Buscar el registro más reciente actualizado
    const { data } = await supabase.from("items").select("updated_at").order("updated_at", { ascending: false }).limit(1).single();

    return data ? new Date(data.updated_at) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Crear o actualizar tabla de sincronización
 */
async function updateSyncMetadata(commitInfo) {
  try {
    // Primero, crear la tabla si no existe (ejecutar solo una vez)
    const { error: createError } = await supabase.rpc("create_sync_metadata_table", {});

    // Insertar o actualizar metadata
    const { error } = await supabase.from("sync_metadata").upsert(
      {
        id: "arc_raiders_data",
        last_commit_hash: commitInfo.remote,
        last_commit_date: commitInfo.date.toISOString(),
        last_commit_message: commitInfo.message,
        last_sync_date: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error && error.code !== "42P01") {
      // Ignorar error de tabla no existe
      throw error;
    }
  } catch (error) {
    console.warn("⚠️ Could not update sync metadata (table might not exist yet)");
  }
}

/**
 * Validación principal
 */
async function validate() {
  console.log("🔍 Arc Raiders Data Sync Validation\n");
  console.log("=".repeat(60));

  // 1. Verificar commit del repositorio
  console.log("\n📌 Repository Status:");
  const commitInfo = getLatestCommit();

  if (!commitInfo) {
    console.error("❌ Could not get repository info");
    process.exit(1);
  }

  console.log(`   Latest commit: ${commitInfo.remote.substring(0, 7)}`);
  console.log(`   Commit date: ${commitInfo.date.toLocaleString()}`);
  console.log(`   Message: "${commitInfo.message}"`);

  if (commitInfo.needsUpdate) {
    console.log(`   ⚠️  Local repository is behind (needs pull)`);
  } else {
    console.log(`   ✅ Local repository is up to date`);
  }

  // 2. Contar archivos en repositorio
  console.log("\n📊 Repository Files:");
  const repoCounts = countRepositoryFiles();
  console.log(`   Items: ${repoCounts.items}`);
  console.log(`   Quests: ${repoCounts.quests}`);
  console.log(`   Hideout Modules: ${repoCounts.hideout}`);
  console.log(`   Bots: ${repoCounts.bots}`);
  console.log(`   Trades: ${repoCounts.trades}`);

  // 3. Contar registros en Supabase
  console.log("\n🗄️  Supabase Records:");
  const dbCounts = await countSupabaseRecords();
  console.log(`   Items: ${dbCounts.items}`);
  console.log(`   Quests: ${dbCounts.quests}`);
  console.log(`   Hideout Modules: ${dbCounts.hideout}`);
  console.log(`   Bots: ${dbCounts.bots}`);
  console.log(`   Trades: ${dbCounts.trades}`);

  // 4. Comparar y detectar diferencias
  console.log("\n🔄 Sync Status:");
  const differences = {
    items: repoCounts.items !== dbCounts.items,
    quests: repoCounts.quests !== dbCounts.quests,
    hideout: repoCounts.hideout !== dbCounts.hideout,
    bots: repoCounts.bots !== dbCounts.bots,
    trades: repoCounts.trades !== dbCounts.trades,
  };

  const needsSync = Object.values(differences).some((d) => d);

  if (needsSync) {
    console.log("   ⚠️  DATABASE OUT OF SYNC");
    console.log("\n   Differences detected:");

    Object.entries(differences).forEach(([key, isDifferent]) => {
      if (isDifferent) {
        const diff = repoCounts[key] - dbCounts[key];
        const sign = diff > 0 ? "+" : "";
        console.log(`   - ${key}: ${dbCounts[key]} in DB vs ${repoCounts[key]} in repo (${sign}${diff})`);
      }
    });

    console.log("\n   💡 Run 'npm run sync-data' to update Supabase");
  } else {
    console.log("   ✅ DATABASE IS IN SYNC");
  }

  // 5. Verificar última actualización
  const lastUpdate = await getLastSupabaseUpdate();
  if (lastUpdate) {
    console.log(`\n⏰ Last Supabase Update: ${lastUpdate.toLocaleString()}`);

    const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);
    if (hoursSinceUpdate > 168) {
      // 7 días
      console.log(`   ⚠️  Data is ${Math.floor(hoursSinceUpdate / 24)} days old`);
    }
  }

  // 6. Actualizar metadata de sincronización
  if (!needsSync) {
    await updateSyncMetadata(commitInfo);
  }

  console.log("\n" + "=".repeat(60));

  // Return exit code
  process.exit(needsSync ? 1 : 0);
}

validate();
