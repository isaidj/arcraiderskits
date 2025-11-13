/**
 * 🚀 Script de Importación de Datos a Supabase
 *
 * Este script lee los archivos JSON del repositorio Arc Raiders
 * y los importa a las tablas de Supabase de forma normalizada
 *
 * Uso: node scripts/import-to-supabase.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config({ path: ".env.local" });

// Configuración
const TEMP_DIR = path.join(__dirname, "..", ".tmp-arcraiders-data");
const REPO_URL = "https://github.com/RaidTheory/arcraiders-data.git";

// Cliente de Supabase (requiere service_role key para bypass RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  console.error("   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("🚀 Arc Raiders Data Import to Supabase\n");

/**
 * Actualiza/clona el repositorio de datos
 */
async function updateRepository() {
  console.log("📥 Updating Arc Raiders data repository...");

  if (!fs.existsSync(TEMP_DIR)) {
    execSync(`git clone --depth 1 ${REPO_URL} "${TEMP_DIR}"`, { stdio: "inherit" });
  } else {
    execSync("git pull origin main", { cwd: TEMP_DIR, stdio: "inherit" });
  }

  console.log("✅ Repository updated\n");
}

/**
 * Importa items a Supabase
 */
async function importItems() {
  console.log("📦 Importing items...");

  const itemsDir = path.join(TEMP_DIR, "items");
  const files = fs.readdirSync(itemsDir).filter((f) => f.endsWith(".json"));

  let imported = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const itemData = JSON.parse(fs.readFileSync(path.join(itemsDir, file), "utf8"));

      // 1. Insertar/actualizar item principal
      const { error: itemError } = await supabase.from("items").upsert(
        {
          id: itemData.id,
          type: itemData.type,
          value: itemData.value || null,
          rarity: itemData.rarity || null,
          weight_kg: itemData.weightKg || null,
          stack_size: itemData.stackSize || null,
          image_filename: itemData.imageFilename || null,
          craft_bench: itemData.craftBench || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (itemError) throw itemError;

      // 2. Insertar traducciones
      if (itemData.name) {
        const translations = Object.entries(itemData.name).map(([lang, name]) => ({
          item_id: itemData.id,
          lang,
          name,
          description: itemData.description?.[lang] || null,
        }));

        // Eliminar traducciones anteriores
        await supabase.from("item_translations").delete().eq("item_id", itemData.id);

        const { error: transError } = await supabase.from("item_translations").insert(translations);

        if (transError) throw transError;
      }

      // 3. Insertar receta de crafteo
      if (itemData.recipe) {
        await supabase.from("item_recipes").delete().eq("item_id", itemData.id);

        const recipes = Object.entries(itemData.recipe).map(([ingredientId, quantity]) => ({
          item_id: itemData.id,
          ingredient_id: ingredientId,
          quantity,
        }));

        if (recipes.length > 0) {
          const { error: recipeError } = await supabase.from("item_recipes").insert(recipes);

          if (recipeError) throw recipeError;
        }
      }

      // 4. Insertar items de reciclaje
      if (itemData.recyclesInto) {
        await supabase.from("item_recycles").delete().eq("item_id", itemData.id);

        const recycles = Object.entries(itemData.recyclesInto).map(([recycleItemId, quantity]) => ({
          item_id: itemData.id,
          recycle_item_id: recycleItemId,
          quantity,
        }));

        if (recycles.length > 0) {
          const { error: recycleError } = await supabase.from("item_recycles").insert(recycles);

          if (recycleError) throw recycleError;
        }
      }

      // 5. Insertar efectos
      if (itemData.effects) {
        await supabase.from("item_effects").delete().eq("item_id", itemData.id);

        const effects = [];
        Object.entries(itemData.effects).forEach(([effectKey, effectData]) => {
          Object.entries(effectData).forEach(([lang, value]) => {
            if (lang !== "value") {
              effects.push({
                item_id: itemData.id,
                effect_key: effectKey,
                effect_value: effectData.value || "",
                lang,
                effect_name: value,
              });
            }
          });
        });

        if (effects.length > 0) {
          const { error: effectError } = await supabase.from("item_effects").insert(effects);

          if (effectError) throw effectError;
        }
      }

      imported++;
      if (imported % 50 === 0) {
        console.log(`   Imported ${imported}/${files.length} items...`);
      }
    } catch (error) {
      console.error(`   ❌ Error importing ${file}:`, error.message);
      errors++;
    }
  }

  console.log(`✅ Imported ${imported} items (${errors} errors)\n`);
}

/**
 * Importa quests a Supabase
 */
async function importQuests() {
  console.log("📋 Importing quests...");

  const questsDir = path.join(TEMP_DIR, "quests");
  const files = fs.readdirSync(questsDir).filter((f) => f.endsWith(".json"));

  let imported = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const questData = JSON.parse(fs.readFileSync(path.join(questsDir, file), "utf8"));

      // 1. Insertar/actualizar quest principal
      const { error: questError } = await supabase.from("quests").upsert(
        {
          id: questData.id,
          trader: questData.trader,
          xp: questData.xp || 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (questError) throw questError;

      // 2. Insertar traducciones
      if (questData.name) {
        await supabase.from("quest_translations").delete().eq("quest_id", questData.id);

        const translations = Object.entries(questData.name).map(([lang, name]) => ({
          quest_id: questData.id,
          lang,
          name,
        }));

        const { error: transError } = await supabase.from("quest_translations").insert(translations);

        if (transError) throw transError;
      }

      // 3. Insertar objetivos
      if (questData.objectives && Array.isArray(questData.objectives)) {
        await supabase.from("quest_objectives").delete().eq("quest_id", questData.id);

        const objectives = [];
        questData.objectives.forEach((obj, index) => {
          if (typeof obj === "object") {
            Object.entries(obj).forEach(([lang, text]) => {
              objectives.push({
                quest_id: questData.id,
                objective_order: index + 1,
                lang,
                objective_text: text,
              });
            });
          }
        });

        if (objectives.length > 0) {
          const { error: objError } = await supabase.from("quest_objectives").insert(objectives);

          if (objError) throw objError;
        }
      }

      // 4. Insertar recompensas
      if (questData.rewardItemIds && Array.isArray(questData.rewardItemIds)) {
        await supabase.from("quest_rewards").delete().eq("quest_id", questData.id);

        const rewards = questData.rewardItemIds.map((reward) => ({
          quest_id: questData.id,
          item_id: reward.itemId,
          quantity: reward.quantity,
        }));

        if (rewards.length > 0) {
          const { error: rewardError } = await supabase.from("quest_rewards").insert(rewards);

          if (rewardError) throw rewardError;
        }
      }

      // 5. Insertar dependencias (previous/next)
      await supabase.from("quest_dependencies").delete().eq("quest_id", questData.id);

      const dependencies = [];

      if (questData.previousQuestIds && Array.isArray(questData.previousQuestIds)) {
        questData.previousQuestIds.forEach((prevId) => {
          dependencies.push({
            quest_id: questData.id,
            dependency_type: "previous",
            related_quest_id: prevId,
          });
        });
      }

      if (questData.nextQuestIds && Array.isArray(questData.nextQuestIds)) {
        questData.nextQuestIds.forEach((nextId) => {
          dependencies.push({
            quest_id: questData.id,
            dependency_type: "next",
            related_quest_id: nextId,
          });
        });
      }

      if (dependencies.length > 0) {
        const { error: depError } = await supabase.from("quest_dependencies").insert(dependencies);

        if (depError) throw depError;
      }

      imported++;
      if (imported % 10 === 0) {
        console.log(`   Imported ${imported}/${files.length} quests...`);
      }
    } catch (error) {
      console.error(`   ❌ Error importing ${file}:`, error.message);
      errors++;
    }
  }

  console.log(`✅ Imported ${imported} quests (${errors} errors)\n`);
}

/**
 * Importa módulos del hideout a Supabase
 */
async function importHideoutModules() {
  console.log("🏠 Importing hideout modules...");

  const hideoutDir = path.join(TEMP_DIR, "hideout");
  const files = fs.readdirSync(hideoutDir).filter((f) => f.endsWith(".json"));

  let imported = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const moduleData = JSON.parse(fs.readFileSync(path.join(hideoutDir, file), "utf8"));

      // 1. Insertar/actualizar módulo principal
      const { error: moduleError } = await supabase.from("hideout_modules").upsert(
        {
          id: moduleData.id,
          max_level: moduleData.maxLevel,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (moduleError) throw moduleError;

      // 2. Insertar traducciones
      if (moduleData.name) {
        await supabase.from("hideout_module_translations").delete().eq("module_id", moduleData.id);

        const translations = Object.entries(moduleData.name).map(([lang, name]) => ({
          module_id: moduleData.id,
          lang,
          name,
        }));

        const { error: transError } = await supabase.from("hideout_module_translations").insert(translations);

        if (transError) throw transError;
      }

      // 3. Insertar niveles y sus requisitos
      if (moduleData.levels && Array.isArray(moduleData.levels)) {
        // Eliminar niveles anteriores
        const { data: oldLevels } = await supabase.from("hideout_module_levels").select("id").eq("module_id", moduleData.id);

        if (oldLevels && oldLevels.length > 0) {
          const levelIds = oldLevels.map((l) => l.id);
          await supabase.from("hideout_level_requirements").delete().in("module_level_id", levelIds);
          await supabase.from("hideout_module_levels").delete().eq("module_id", moduleData.id);
        }

        for (const levelData of moduleData.levels) {
          // Insertar nivel
          const { data: levelRow, error: levelError } = await supabase
            .from("hideout_module_levels")
            .insert({
              module_id: moduleData.id,
              level: levelData.level,
            })
            .select()
            .single();

          if (levelError) throw levelError;

          // Insertar requisitos del nivel
          if (levelData.requirementItemIds && Array.isArray(levelData.requirementItemIds)) {
            const requirements = levelData.requirementItemIds.map((req) => ({
              module_level_id: levelRow.id,
              item_id: req.itemId,
              quantity: req.quantity,
            }));

            if (requirements.length > 0) {
              const { error: reqError } = await supabase.from("hideout_level_requirements").insert(requirements);

              if (reqError) throw reqError;
            }
          }
        }
      }

      imported++;
    } catch (error) {
      console.error(`   ❌ Error importing ${file}:`, error.message);
      errors++;
    }
  }

  console.log(`✅ Imported ${imported} hideout modules (${errors} errors)\n`);
}

/**
 * Importa skill nodes (como JSONB por su complejidad)
 */
async function importSkillNodes() {
  console.log("🎓 Importing skill nodes...");

  const skillNodesFile = path.join(TEMP_DIR, "skillNodes.json");

  if (!fs.existsSync(skillNodesFile)) {
    console.log("⚠️  skillNodes.json not found, skipping\n");
    return;
  }

  try {
    const skillNodesData = JSON.parse(fs.readFileSync(skillNodesFile, "utf8"));

    if (Array.isArray(skillNodesData)) {
      await supabase.from("skill_nodes").delete().neq("id", "");

      for (const node of skillNodesData) {
        const { error } = await supabase.from("skill_nodes").insert({
          id: node.id || `skill_${Date.now()}_${Math.random()}`,
          data: node,
        });

        if (error) throw error;
      }

      console.log(`✅ Imported ${skillNodesData.length} skill nodes\n`);
    }
  } catch (error) {
    console.error("❌ Error importing skill nodes:", error.message);
  }
}

/**
 * Importa projects (como JSONB por su complejidad)
 */
async function importProjects() {
  console.log("🗂️  Importing projects...");

  const projectsFile = path.join(TEMP_DIR, "projects.json");

  if (!fs.existsSync(projectsFile)) {
    console.log("⚠️  projects.json not found, skipping\n");
    return;
  }

  try {
    const projectsData = JSON.parse(fs.readFileSync(projectsFile, "utf8"));

    if (Array.isArray(projectsData)) {
      await supabase.from("projects").delete().neq("id", "");

      for (const project of projectsData) {
        const { error } = await supabase.from("projects").insert({
          id: project.id || `project_${Date.now()}_${Math.random()}`,
          data: project,
        });

        if (error) throw error;
      }

      console.log(`✅ Imported ${projectsData.length} projects\n`);
    }
  } catch (error) {
    console.error("❌ Error importing projects:", error.message);
  }
}

/**
 * Importa bots a Supabase
 */
async function importBots() {
  console.log("🤖 Importing bots...");

  const botsFile = path.join(TEMP_DIR, "bots.json");

  if (!fs.existsSync(botsFile)) {
    console.log("⚠️  bots.json not found, skipping\n");
    return;
  }

  try {
    const botsData = JSON.parse(fs.readFileSync(botsFile, "utf8"));

    if (Array.isArray(botsData)) {
      let imported = 0;
      let errors = 0;

      for (const bot of botsData) {
        try {
          // 1. Insertar/actualizar bot principal
          const { error: botError } = await supabase.from("bots").upsert(
            {
              id: bot.id,
              name: bot.name,
              image: bot.image || null,
              type: bot.type,
              threat: bot.threat,
              description: bot.description || null,
              destroy_xp: bot.destroyXp || 0,
              loot_xp: bot.lootXp || 0,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

          if (botError) throw botError;

          // 2. Insertar drops
          if (bot.drops && Array.isArray(bot.drops)) {
            await supabase.from("bot_drops").delete().eq("bot_id", bot.id);

            const drops = bot.drops.map((itemId, index) => ({
              bot_id: bot.id,
              item_id: itemId,
              drop_order: index + 1,
            }));

            if (drops.length > 0) {
              const { error: dropsError } = await supabase.from("bot_drops").insert(drops);

              if (dropsError) throw dropsError;
            }
          }

          imported++;
        } catch (error) {
          console.error(`   ❌ Error importing bot ${bot.id}:`, error.message);
          errors++;
        }
      }

      console.log(`✅ Imported ${imported} bots (${errors} errors)\n`);
    }
  } catch (error) {
    console.error("❌ Error importing bots:", error.message);
  }
}

/**
 * Importa trades a Supabase
 */
async function importTrades() {
  console.log("💰 Importing trades...");

  const tradesFile = path.join(TEMP_DIR, "trades.json");

  if (!fs.existsSync(tradesFile)) {
    console.log("⚠️  trades.json not found, skipping\n");
    return;
  }

  try {
    const tradesData = JSON.parse(fs.readFileSync(tradesFile, "utf8"));

    if (Array.isArray(tradesData)) {
      // Eliminar todos los trades anteriores
      await supabase.from("trades").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const trades = tradesData.map((trade) => ({
        trader: trade.trader,
        item_id: trade.itemId,
        quantity: trade.quantity,
        cost_item_id: trade.cost.itemId,
        cost_quantity: trade.cost.quantity,
        daily_limit: trade.dailyLimit || null,
      }));

      // Insertar en lotes de 100
      const batchSize = 100;
      let imported = 0;

      for (let i = 0; i < trades.length; i += batchSize) {
        const batch = trades.slice(i, i + batchSize);
        const { error } = await supabase.from("trades").insert(batch);

        if (error) {
          console.error(`   ❌ Error importing trades batch ${i / batchSize + 1}:`, error.message);
        } else {
          imported += batch.length;
          if (imported % 100 === 0) {
            console.log(`   Imported ${imported}/${trades.length} trades...`);
          }
        }
      }

      console.log(`✅ Imported ${imported} trades\n`);
    }
  } catch (error) {
    console.error("❌ Error importing trades:", error.message);
  }
}

/**
 * Guarda metadata de sincronización
 */
async function saveSyncMetadata() {
  console.log("💾 Saving sync metadata...");

  try {
    // Obtener información del último commit
    const commitHash = execSync("git rev-parse HEAD", {
      cwd: TEMP_DIR,
      encoding: "utf8",
    }).trim();

    const commitDate = execSync("git log -1 --format=%cd --date=iso", {
      cwd: TEMP_DIR,
      encoding: "utf8",
    }).trim();

    const commitMessage = execSync("git log -1 --format=%s", {
      cwd: TEMP_DIR,
      encoding: "utf8",
    }).trim();

    const { error } = await supabase.from("sync_metadata").upsert(
      {
        id: "arc_raiders_data",
        last_commit_hash: commitHash,
        last_commit_date: new Date(commitDate).toISOString(),
        last_commit_message: commitMessage,
        last_sync_date: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.warn("⚠️  Could not save sync metadata:", error.message);
    } else {
      console.log(`✅ Sync metadata saved (commit: ${commitHash.substring(0, 7)})\n`);
    }
  } catch (error) {
    console.warn("⚠️  Could not save sync metadata:", error.message);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await updateRepository();
    await importItems();
    await importQuests();
    await importHideoutModules();
    await importBots();
    await importTrades();
    await importSkillNodes();
    await importProjects();
    await saveSyncMetadata();

    console.log("🎉 Import completed successfully!");
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

main();
