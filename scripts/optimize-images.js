import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assetsDir = path.join(root, "public/restaurant/assets");

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (/\.(webp|jpg|jpeg|png)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function optimize(filePath) {
  const image = sharp(filePath, { failOn: "none" });
  const metadata = await image.metadata();
  const maxWidth = 1600;

  let pipeline = image;
  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  if (filePath.endsWith(".webp")) {
    await pipeline.webp({ quality: 82 }).toFile(`${filePath}.tmp`);
  } else {
    await pipeline
      .webp({ quality: 82 })
      .toFile(`${filePath.replace(/\.(jpg|jpeg|png)$/i, ".webp")}.tmp`);
  }

  await fs.rename(`${filePath}.tmp`, filePath);
  console.log(`Optimized ${path.relative(root, filePath)}`);
}

async function main() {
  const files = await walk(assetsDir);
  for (const file of files) {
    await optimize(file);
  }
  console.log("Image optimization complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
