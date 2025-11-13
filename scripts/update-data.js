/**
 * 🔄 Update Arc Raiders Data Repository & Import to Supabase
 *
 * Este script:
 * 1. Clona/actualiza el repositorio de Arc Raiders data
 * 2. Ejecuta el script de importación a Supabase
 *
 * Uso: npm run update-data
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REPO_URL = "https://github.com/RaidTheory/arcraiders-data.git";
const TEMP_DIR = path.join(__dirname, "..", ".tmp-arcraiders-data");

console.log("🔄 Updating Arc Raiders data...\n");

try {
  // Clonar o actualizar el repositorio en un directorio temporal
  if (!fs.existsSync(TEMP_DIR)) {
    console.log("📥 Cloning Arc Raiders data repository...");
    execSync(`git clone --depth 1 ${REPO_URL} "${TEMP_DIR}"`, { stdio: "inherit" });
  } else {
    console.log("📥 Updating Arc Raiders data repository...");
    execSync("git pull origin main", { cwd: TEMP_DIR, stdio: "inherit" });
  }

  console.log("\n✅ Repository updated successfully!");
  console.log("\n💡 To import data to Supabase, run: npm run import-data\n");
} catch (error) {
  console.error("❌ Error updating data:", error.message);
  process.exit(1);
}
