const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const YEAR = process.argv[2];

if (!YEAR) {
    console.log("Usage: node src/images/script.js 2023");
    process.exit(1);
}

const IMAGE_DIR = path.join(__dirname, YEAR);

(async () => {

    if (!fs.existsSync(IMAGE_DIR)) {
        console.log("Папка не найдена:", IMAGE_DIR);
        return;
    }

    const files = fs.readdirSync(IMAGE_DIR);

    for (const file of files) {

        if (!file.toLowerCase().endsWith(".png")) continue;

        const inputPath = path.join(IMAGE_DIR, file);
        const outputPath = path.join(
            IMAGE_DIR,
            file.replace(/\.png$/i, ".webp")
        );

        if (fs.existsSync(outputPath)) continue;

        try {
            await sharp(inputPath)
                .resize(400)
                .webp({ quality: 80 })
                .toFile(outputPath);

            console.log(`✔ ${file} → ${path.basename(outputPath)}`);


            fs.unlinkSync(inputPath);

        } catch (err) {
            console.warn(`Ошибка: ${file}`, err.message);
        }
    }

})();