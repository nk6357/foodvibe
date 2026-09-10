import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assetsDir = path.join(root, "public/restaurant/assets");
const MAX_IMAGE_EDGE = 2000;
const WEBP_QUALITY = 90;

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

export async function optimizeImage(filePath, displayRoot = root) {
  const parsedPath = path.parse(filePath);
  const isWebp = parsedPath.ext.toLowerCase() === ".webp";
  const targetPath = isWebp
    ? filePath
    : path.join(parsedPath.dir, `${parsedPath.name}.webp`);
  const temporaryPath = `${targetPath}.tmp-${process.pid}`;

  if (!isWebp) {
    try {
      await fs.access(targetPath);
      console.warn(
        `Skipped ${path.relative(displayRoot, filePath)}: ${path.relative(displayRoot, targetPath)} already exists.`,
      );
      return;
    } catch {
      // The WebP target does not exist yet, so conversion is safe.
    }
  }

  if (isWebp) {
    const metadata = await sharp(filePath, { failOn: "none" }).metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    if (width <= MAX_IMAGE_EDGE && height <= MAX_IMAGE_EDGE) {
      console.log(
        `Preserved ${path.relative(displayRoot, filePath)} (${width}x${height}): existing WebP was not recompressed.`,
      );
      return;
    }
  }

  try {
    await sharp(filePath, { failOn: "none" })
      .rotate()
      .resize({
        width: MAX_IMAGE_EDGE,
        height: MAX_IMAGE_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, smartSubsample: true })
      .toFile(temporaryPath);

    await fs.rename(temporaryPath, targetPath);
    console.log(
      `${isWebp ? "Optimized" : "Converted"} ${path.relative(displayRoot, targetPath)}`,
    );
  } catch (error) {
    await fs.rm(temporaryPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function main() {
  const files = await walk(assetsDir);
  for (const file of files) {
    await optimizeImage(file);
  }
  console.log("Image optimization complete.");
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
