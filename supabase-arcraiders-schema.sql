-- 🎮 Arc Raiders Data Schema for Supabase
-- Este esquema almacena todos los datos del juego Arc Raiders
-- Estructura normalizada con soporte multiidioma

-- ========================================
-- 📦 TABLA: items
-- ========================================
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  value INTEGER,
  rarity TEXT,
  weight_kg DECIMAL(10, 2),
  stack_size INTEGER,
  image_filename TEXT,
  craft_bench TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 🌍 TABLA: item_translations
-- ========================================
CREATE TABLE IF NOT EXISTS item_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  lang TEXT NOT NULL, -- 'en', 'es', 'de', 'fr', etc.
  name TEXT NOT NULL,
  description TEXT,
  UNIQUE(item_id, lang)
);

-- ========================================
-- 🔧 TABLA: item_recipes
-- ========================================
CREATE TABLE IF NOT EXISTS item_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  ingredient_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  UNIQUE(item_id, ingredient_id)
);

-- ========================================
-- ♻️ TABLA: item_recycles
-- ========================================
CREATE TABLE IF NOT EXISTS item_recycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  recycle_item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  UNIQUE(item_id, recycle_item_id)
);

-- ========================================
-- ⚡ TABLA: item_effects
-- ========================================
CREATE TABLE IF NOT EXISTS item_effects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  effect_key TEXT NOT NULL, -- 'Stamina Regeneration', 'Duration', etc.
  effect_value TEXT NOT NULL, -- '5/s', '10s', etc.
  lang TEXT NOT NULL,
  effect_name TEXT NOT NULL,
  UNIQUE(item_id, effect_key, lang)
);

-- ========================================
-- 📋 TABLA: quests
-- ========================================
CREATE TABLE IF NOT EXISTS quests (
  id TEXT PRIMARY KEY,
  trader TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 🌍 TABLA: quest_translations
-- ========================================
CREATE TABLE IF NOT EXISTS quest_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id TEXT NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  name TEXT NOT NULL,
  UNIQUE(quest_id, lang)
);

-- ========================================
-- 🎯 TABLA: quest_objectives
-- ========================================
CREATE TABLE IF NOT EXISTS quest_objectives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id TEXT NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  objective_order INTEGER NOT NULL,
  lang TEXT NOT NULL,
  objective_text TEXT NOT NULL,
  UNIQUE(quest_id, objective_order, lang)
);

-- ========================================
-- 🎁 TABLA: quest_rewards
-- ========================================
CREATE TABLE IF NOT EXISTS quest_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id TEXT NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  UNIQUE(quest_id, item_id)
);

-- ========================================
-- 🔗 TABLA: quest_dependencies
-- ========================================
CREATE TABLE IF NOT EXISTS quest_dependencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id TEXT NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  dependency_type TEXT NOT NULL, -- 'previous' o 'next'
  related_quest_id TEXT NOT NULL,
  UNIQUE(quest_id, dependency_type, related_quest_id)
);

-- ========================================
-- 🏠 TABLA: hideout_modules
-- ========================================
CREATE TABLE IF NOT EXISTS hideout_modules (
  id TEXT PRIMARY KEY,
  max_level INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 🌍 TABLA: hideout_module_translations
-- ========================================
CREATE TABLE IF NOT EXISTS hideout_module_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES hideout_modules(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,
  name TEXT NOT NULL,
  UNIQUE(module_id, lang)
);

-- ========================================
-- 📈 TABLA: hideout_module_levels
-- ========================================
CREATE TABLE IF NOT EXISTS hideout_module_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES hideout_modules(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  UNIQUE(module_id, level)
);

-- ========================================
-- 🔧 TABLA: hideout_level_requirements
-- ========================================
CREATE TABLE IF NOT EXISTS hideout_level_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_level_id UUID NOT NULL REFERENCES hideout_module_levels(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  UNIQUE(module_level_id, item_id)
);

-- ========================================
-- 🤖 TABLA: bots
-- ========================================
CREATE TABLE IF NOT EXISTS bots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  type TEXT NOT NULL,
  threat TEXT NOT NULL,
  description TEXT,
  destroy_xp INTEGER DEFAULT 0,
  loot_xp INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 💎 TABLA: bot_drops
-- ========================================
CREATE TABLE IF NOT EXISTS bot_drops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id TEXT NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  drop_order INTEGER, -- Para mantener el orden de los drops
  UNIQUE(bot_id, item_id)
);

-- ========================================
-- 💰 TABLA: trades
-- ========================================
CREATE TABLE IF NOT EXISTS trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trader TEXT NOT NULL,
  item_id TEXT NOT NULL, -- Item que se recibe
  quantity INTEGER NOT NULL, -- Cantidad que se recibe
  cost_item_id TEXT NOT NULL, -- Item que se necesita pagar
  cost_quantity INTEGER NOT NULL, -- Cantidad que se necesita pagar
  daily_limit INTEGER, -- NULL = sin límite
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 🎓 TABLA: skill_nodes
-- ========================================
CREATE TABLE IF NOT EXISTS skill_nodes (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL, -- Almacenar toda la estructura como JSONB (es muy complejo para normalizar)
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- 🗂️ TABLA: projects
-- ========================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL, -- Almacenar toda la estructura como JSONB (es muy complejo para normalizar)
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- � TABLA: sync_metadata
-- ========================================
CREATE TABLE IF NOT EXISTS sync_metadata (
  id TEXT PRIMARY KEY,
  last_commit_hash TEXT NOT NULL,
  last_commit_date TIMESTAMPTZ NOT NULL,
  last_commit_message TEXT,
  last_sync_date TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- �📊 ÍNDICES para optimización
-- ========================================

-- Items
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_rarity ON items(rarity);
CREATE INDEX IF NOT EXISTS idx_items_craft_bench ON items(craft_bench);
CREATE INDEX IF NOT EXISTS idx_item_translations_lang ON item_translations(lang);
CREATE INDEX IF NOT EXISTS idx_item_translations_item_id ON item_translations(item_id);

-- Quests
CREATE INDEX IF NOT EXISTS idx_quests_trader ON quests(trader);
CREATE INDEX IF NOT EXISTS idx_quest_translations_lang ON quest_translations(lang);
CREATE INDEX IF NOT EXISTS idx_quest_translations_quest_id ON quest_translations(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_objectives_quest_id ON quest_objectives(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_rewards_quest_id ON quest_rewards(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_dependencies_quest_id ON quest_dependencies(quest_id);

-- Hideout
CREATE INDEX IF NOT EXISTS idx_hideout_module_translations_lang ON hideout_module_translations(lang);
CREATE INDEX IF NOT EXISTS idx_hideout_module_levels_module_id ON hideout_module_levels(module_id);

-- Bots
CREATE INDEX IF NOT EXISTS idx_bots_type ON bots(type);
CREATE INDEX IF NOT EXISTS idx_bots_threat ON bots(threat);
CREATE INDEX IF NOT EXISTS idx_bot_drops_bot_id ON bot_drops(bot_id);

-- Trades
CREATE INDEX IF NOT EXISTS idx_trades_trader ON trades(trader);
CREATE INDEX IF NOT EXISTS idx_trades_item_id ON trades(item_id);
CREATE INDEX IF NOT EXISTS idx_trades_cost_item_id ON trades(cost_item_id);

-- ========================================
-- 🔒 Row Level Security (RLS)
-- ========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_recycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE hideout_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE hideout_module_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hideout_module_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE hideout_level_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_metadata ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Allow public read on items" ON items FOR SELECT USING (true);
CREATE POLICY "Allow public read on item_translations" ON item_translations FOR SELECT USING (true);
CREATE POLICY "Allow public read on item_recipes" ON item_recipes FOR SELECT USING (true);
CREATE POLICY "Allow public read on item_recycles" ON item_recycles FOR SELECT USING (true);
CREATE POLICY "Allow public read on item_effects" ON item_effects FOR SELECT USING (true);
CREATE POLICY "Allow public read on quests" ON quests FOR SELECT USING (true);
CREATE POLICY "Allow public read on quest_translations" ON quest_translations FOR SELECT USING (true);
CREATE POLICY "Allow public read on quest_objectives" ON quest_objectives FOR SELECT USING (true);
CREATE POLICY "Allow public read on quest_rewards" ON quest_rewards FOR SELECT USING (true);
CREATE POLICY "Allow public read on quest_dependencies" ON quest_dependencies FOR SELECT USING (true);
CREATE POLICY "Allow public read on hideout_modules" ON hideout_modules FOR SELECT USING (true);
CREATE POLICY "Allow public read on hideout_module_translations" ON hideout_module_translations FOR SELECT USING (true);
CREATE POLICY "Allow public read on hideout_module_levels" ON hideout_module_levels FOR SELECT USING (true);
CREATE POLICY "Allow public read on hideout_level_requirements" ON hideout_level_requirements FOR SELECT USING (true);
CREATE POLICY "Allow public read on skill_nodes" ON skill_nodes FOR SELECT USING (true);
CREATE POLICY "Allow public read on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on bots" ON bots FOR SELECT USING (true);
CREATE POLICY "Allow public read on bot_drops" ON bot_drops FOR SELECT USING (true);
CREATE POLICY "Allow public read on trades" ON trades FOR SELECT USING (true);
CREATE POLICY "Allow public read on sync_metadata" ON sync_metadata FOR SELECT USING (true);

-- ========================================
-- 🔄 Función para actualizar updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON quests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hideout_modules_updated_at BEFORE UPDATE ON hideout_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_nodes_updated_at BEFORE UPDATE ON skill_nodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bots_updated_at BEFORE UPDATE ON bots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON trades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sync_metadata_updated_at BEFORE UPDATE ON sync_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 📝 COMENTARIOS
-- ========================================
COMMENT ON TABLE items IS 'Tabla principal de items del juego Arc Raiders';
COMMENT ON TABLE item_translations IS 'Traducciones de nombres y descripciones de items';
COMMENT ON TABLE item_recipes IS 'Recetas de crafteo de items';
COMMENT ON TABLE item_recycles IS 'Items obtenidos al reciclar';
COMMENT ON TABLE item_effects IS 'Efectos de los items (con traducciones)';
COMMENT ON TABLE quests IS 'Misiones del juego';
COMMENT ON TABLE quest_translations IS 'Traducciones de nombres de misiones';
COMMENT ON TABLE quest_objectives IS 'Objetivos de las misiones (con traducciones)';
COMMENT ON TABLE quest_rewards IS 'Recompensas de las misiones';
COMMENT ON TABLE quest_dependencies IS 'Dependencias entre misiones (previous/next)';
COMMENT ON TABLE hideout_modules IS 'Módulos del hideout';
COMMENT ON TABLE hideout_module_translations IS 'Traducciones de nombres de módulos';
COMMENT ON TABLE hideout_module_levels IS 'Niveles de cada módulo del hideout';
COMMENT ON TABLE hideout_level_requirements IS 'Requisitos de items para cada nivel de módulo';
COMMENT ON TABLE bots IS 'Bots/enemigos del juego Arc Raiders';
COMMENT ON TABLE bot_drops IS 'Items que dropean los bots al ser derrotados';
COMMENT ON TABLE trades IS 'Intercambios disponibles con los traders';
COMMENT ON TABLE skill_nodes IS 'Nodos del árbol de habilidades (estructura compleja en JSONB)';
COMMENT ON TABLE projects IS 'Proyectos del juego (estructura compleja en JSONB)';
COMMENT ON TABLE sync_metadata IS 'Metadata de sincronización con el repositorio de Arc Raiders';
