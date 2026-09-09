import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const assetsDir = path.join(root, "public/restaurant/assets");
const dishesDir = path.join(assetsDir, "dishes");
const documentsDir = path.join(assetsDir, "documents");

const dishColors = {
  1001: "#d4a574",
  1002: "#8fbc8f",
  1003: "#6f4e37",
  1005: "#e07a5f",
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function createWebp(filePath, color, label) {
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="${color}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="42" fill="#ffffff">${label}</text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(filePath);
}

async function createPdfPlaceholder(filePath, title) {
  const content = `%PDF-1.4
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj
4 0 obj<< /Length 44 >>stream
BT /F1 18 Tf 40 80 Td (${title}) Tj ET
endstream endobj
5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000274 00000 n 
0000000371 00000 n 
trailer<< /Size 6 /Root 1 0 R >>
startxref
449
%%EOF`;

  await fs.writeFile(filePath, content, "utf8");
}

async function main() {
  await ensureDir(dishesDir);
  await ensureDir(documentsDir);

  await createWebp(path.join(assetsDir, "cover.webp"), "#2c6e59", "Cover");
  await createWebp(path.join(assetsDir, "placeholder.webp"), "#d8d6d0", "No photo");

  for (const [id, color] of Object.entries(dishColors)) {
    await createWebp(path.join(dishesDir, `${id}.webp`), color, id);
  }

  await createPdfPlaceholder(path.join(documentsDir, "menu.pdf"), "Menu");
  await createPdfPlaceholder(path.join(documentsDir, "offer.pdf"), "Offer");
  await createPdfPlaceholder(path.join(documentsDir, "privacy.pdf"), "Privacy");

  console.log("Demo assets created.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
