// Script simplificado para verificar vistas de previous ranking
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

async function check() {
  // Verificar vista previous
  const { data: prev, error: prevErr } = await supabase.from("trending_items_previous_24h_ranked").select("*").limit(5);

  console.log("=== PREVIOUS ITEMS RANKED ===");
  if (prevErr) {
    console.log("ERROR:", prevErr.message);
  } else if (!prev || prev.length === 0) {
    console.log("EMPTY - No hay datos de ranking anterior");
  } else {
    console.log("ROWS:", prev.length);
    prev.forEach((item, i) => {
      console.log(`  ${i + 1}. item_id: ${item.item_id}, previous_rank: ${item.previous_rank}, view_count: ${item.view_count}`);
    });
  }

  // Verificar current ranked
  const { data: current, error: currErr } = await supabase.from("trending_items_24h_ranked").select("*").limit(5);

  console.log("\n=== CURRENT ITEMS RANKED ===");
  if (currErr) {
    console.log("ERROR:", currErr.message);
  } else if (!current || current.length === 0) {
    console.log("EMPTY - No hay datos de ranking actual");
  } else {
    console.log("ROWS:", current.length);
    current.forEach((item, i) => {
      console.log(`  ${i + 1}. item_id: ${item.item_id}, current_rank: ${item.current_rank}, view_count: ${item.view_count}`);
    });
  }
}

check();
