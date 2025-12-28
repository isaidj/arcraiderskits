// Script para verificar las vistas de trending en Supabase
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Leer .env manualmente
const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join("=").trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log("🔍 Checking Supabase database...\n");
  console.log("URL:", supabaseUrl);
  console.log("");

  // Verificar vistas disponibles
  const views = [
    "trending_items_24h",
    "trending_items_24h_ranked",
    "trending_items_previous_24h_ranked",
    "trending_quests_24h",
    "trending_quests_24h_ranked",
    "trending_quests_previous_24h_ranked",
    "item_views",
    "quest_views",
  ];

  for (const view of views) {
    try {
      const { data, error, count } = await supabase.from(view).select("*", { count: "exact", head: false }).limit(3);

      if (error) {
        console.log(`❌ ${view}: ERROR - ${error.message}`);
      } else {
        console.log(`✅ ${view}: ${data?.length || 0} rows (sample), showing first 3:`);
        if (data && data.length > 0) {
          data.forEach((row, i) => {
            const keys = Object.keys(row).slice(0, 5);
            const preview = keys.map((k) => `${k}: ${row[k]}`).join(", ");
            console.log(`   ${i + 1}. ${preview}...`);
          });
        }
      }
    } catch (e) {
      console.log(`❌ ${view}: EXCEPTION - ${e.message}`);
    }
    console.log("");
  }
}

checkDatabase();
