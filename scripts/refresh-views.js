// Script para refrescar las vistas materializadas de trending
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, ...valueParts] = line.split("=");
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join("=").trim();
  }
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function refresh() {
  console.log("Refrescando vistas materializadas...\n");

  // Intentar con v2 primero
  let { data, error } = await supabase.rpc("refresh_trending_views_v2");

  if (error && error.message.includes("does not exist")) {
    console.log("refresh_trending_views_v2 no existe, intentando refresh_trending_views...");
    const result = await supabase.rpc("refresh_trending_views");
    data = result.data;
    error = result.error;
  }

  if (error) {
    console.log("ERROR:", error.message);
  } else {
    console.log("SUCCESS - Vistas refrescadas!");
  }

  // Verificar de nuevo
  const { data: prev } = await supabase.from("trending_items_previous_24h_ranked").select("*").limit(3);
  console.log("\nDatos en previous después del refresh:", prev?.length || 0, "rows");
  if (prev && prev.length > 0) {
    prev.forEach((p) => console.log(`  - ${p.item_id}: previous_rank ${p.previous_rank}`));
  }
}

refresh();
