#!/usr/bin/env node

/**
 * Script para refrescar las vistas materializadas de trending
 *
 * Uso:
 *   node scripts/refresh-trending.js
 *
 * O programar con cron:
 *   0 * * * * cd /path/to/project && node scripts/refresh-trending.js
 */

require("dotenv").config({ path: ".env.local" });

async function refreshTrending() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const endpoint = `${baseUrl}/api/trending`;

  console.log("🔄 Refrescando vistas materializadas de trending...");
  console.log(`📍 Endpoint: ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Vistas refrescadas exitosamente");
    console.log("📊 Respuesta:", data);

    return data;
  } catch (error) {
    console.error("❌ Error al refrescar vistas:", error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  refreshTrending()
    .then(() => {
      console.log("🎉 Proceso completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Error fatal:", error);
      process.exit(1);
    });
}

module.exports = { refreshTrending };
