const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "public", "data");
const REPO_URL = "https://github.com/RaidTheory/arcraiders-data.git";
const TEMP_DIR = path.join(__dirname, "..", ".tmp-arcraiders-data");

console.log("🔄 Updating Arc Raiders data...");

/**
 * Combina todos los archivos JSON de una carpeta en un solo array
 */
function combineJsonFiles(folderPath, outputFileName) {
  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️  Folder ${path.basename(folderPath)} not found in repository`);
    return;
  }

  const files = fs.readdirSync(folderPath).filter((file) => file.endsWith(".json"));
  const combinedData = [];

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(content);
      combinedData.push(data);
    } catch (error) {
      console.error(`❌ Error reading ${file}:`, error.message);
    }
  });

  const outputPath = path.join(DATA_DIR, outputFileName);
  fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2), "utf8");
  console.log(`✅ Combined ${files.length} files into ${outputFileName}`);
}

/**
 * Combina todos los archivos JSON de hideout en un solo objeto con categorías
 */
function combineHideoutFiles(folderPath, outputFileName) {
  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️  Folder hideout not found in repository`);
    return;
  }

  const files = fs.readdirSync(folderPath).filter((file) => file.endsWith(".json"));
  const combinedData = {};

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const moduleName = path.basename(file, ".json");
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(content);
      combinedData[moduleName] = data;
    } catch (error) {
      console.error(`❌ Error reading ${file}:`, error.message);
    }
  });

  const outputPath = path.join(DATA_DIR, outputFileName);
  fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2), "utf8");
  console.log(`✅ Combined ${files.length} hideout modules into ${outputFileName}`);
}

try {
  // Crear directorio de datos si no existe
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log("✅ Created data directory");
  }

  // Clonar o actualizar el repositorio en un directorio temporal
  if (!fs.existsSync(TEMP_DIR)) {
    console.log("📥 Cloning Arc Raiders data repository...");
    execSync(`git clone --depth 1 ${REPO_URL} "${TEMP_DIR}"`, { stdio: "inherit" });
  } else {
    console.log("📥 Updating Arc Raiders data repository...");
    execSync("git pull origin main", { cwd: TEMP_DIR, stdio: "inherit" });
  }

  // Combinar archivos de carpetas en JSON únicos
  combineJsonFiles(path.join(TEMP_DIR, "items"), "items.json");
  combineJsonFiles(path.join(TEMP_DIR, "quests"), "quests.json");
  combineHideoutFiles(path.join(TEMP_DIR, "hideout"), "hideoutModules.json");

  // Copiar archivos JSON directos que aún existen en la raíz
  const directFiles = ["projects.json", "skillNodes.json", "bots.json", "trades.json"];

  directFiles.forEach((file) => {
    const source = path.join(TEMP_DIR, file);
    const dest = path.join(DATA_DIR, file);

    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
      console.log(`✅ Copied ${file}`);
    } else {
      console.warn(`⚠️  ${file} not found in repository`);
    }
  });

  // Copiar también la carpeta de imágenes si existe
  const imagesSource = path.join(TEMP_DIR, "images");
  const imagesDest = path.join(DATA_DIR, "images");

  if (fs.existsSync(imagesSource)) {
    if (!fs.existsSync(imagesDest)) {
      fs.mkdirSync(imagesDest, { recursive: true });
    }

    // Copiar recursivamente la carpeta de imágenes
    const copyDir = (src, dest) => {
      fs.mkdirSync(dest, { recursive: true });
      const entries = fs.readdirSync(src, { withFileTypes: true });

      entries.forEach((entry) => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    };

    copyDir(imagesSource, imagesDest);
    console.log("✅ Copied images directory");
  }

  console.log("✅ Arc Raiders data updated successfully!");
} catch (error) {
  console.error("❌ Error updating data:", error.message);
  process.exit(1);
}
