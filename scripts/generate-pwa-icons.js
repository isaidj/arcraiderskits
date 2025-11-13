const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputFile = path.join(__dirname, '../public/logo.png');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  try {
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      console.error('❌ Logo file not found:', inputFile);
      process.exit(1);
    }

    console.log('📱 Generating PWA icons from logo.png...');

    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputFile);
      
      console.log(`✅ Generated: icon-${size}x${size}.png`);
    }

    console.log('✨ PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
