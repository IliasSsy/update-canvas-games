const fs = require("fs");
const path = require("path");

const YEAR = process.argv[2];

if (!YEAR) {
    console.log("Usage: node script.js 2023");
    process.exit(1);
}

const SEASON_DIR = path.join("games", `season-${YEAR}`);
const JSON_PATH = path.join("data", "GamesData", `games-${YEAR}.json`);
const IMAGE_OUTPUT_DIR = path.join("src", "images", YEAR);

fs.mkdirSync(IMAGE_OUTPUT_DIR, { recursive: true });

let existingGames = [];

if (fs.existsSync(JSON_PATH)) {
    try {
        const data = fs.readFileSync(JSON_PATH, "utf8");
        existingGames = JSON.parse(data);
    } catch {
        console.log("Ошибка чтения JSON, создаём новый");
    }
}

const existingLinks = new Set(existingGames.map(g => g.link));

const folders = fs.readdirSync(SEASON_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

const newGames = [];

folders.forEach(folder => {

    const gameFolder = path.join(SEASON_DIR, folder);
    const indexPath = path.join(gameFolder, "index.html");

    if (!fs.existsSync(indexPath)) return;

    const link = `../../games/season-${YEAR}/${folder}/index.html`;

    if (existingLinks.has(link)) return;

    const files = fs.readdirSync(gameFolder);

    const previewFile = files.find(f =>
        f.toLowerCase().startsWith("preview.")
    );

    if (!previewFile) return;

    const previewPath = path.join(gameFolder, previewFile);

    const ext = path.extname(previewFile);
    const imageName = `${folder}${ext}`;
    const targetImagePath = path.join(IMAGE_OUTPUT_DIR, imageName);

    if (!fs.existsSync(targetImagePath)) {
        fs.renameSync(previewPath, targetImagePath);
    }

    let gameName = "Unknown Game";

    try {
        const html = fs.readFileSync(indexPath, "utf8");
        const match = html.match(/<title>(.*?)<\/title>/i);
        if (match && match[1]) {
            gameName = match[1].trim();
        }
    } catch {}

    const author = folder.replace(/_/g, " ");
    const altText = imageName.replace(/\.[^/.]+$/, "");

    newGames.push({
        author,
        gameName,
        imageSrc: `../../src/images/${YEAR}/${imageName}`,
        altText,
        link
    });

});

const allGames = [...existingGames, ...newGames];

allGames.sort((a, b) => a.gameName.localeCompare(b.gameName));

fs.writeFileSync(JSON_PATH, JSON.stringify(allGames, null, 2));

console.log(`✔ Added ${newGames.length} new games`);