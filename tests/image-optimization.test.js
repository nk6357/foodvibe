import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import { optimizeImage } from "../scripts/optimize-images.js";

const temporaryDirectories = [];

async function createTemporaryDirectory() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "foodvibe-images-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => fs.rm(directory, { recursive: true, force: true })),
  );
});

describe("image optimization", () => {
  it("converts a JPEG to a same-named WebP and preserves the source", async () => {
    const directory = await createTemporaryDirectory();
    const sourcePath = path.join(directory, "1001.jpg");
    const targetPath = path.join(directory, "1001.webp");

    await sharp({
      create: {
        width: 32,
        height: 24,
        channels: 3,
        background: "#7a332c",
      },
    })
      .jpeg()
      .toFile(sourcePath);

    await optimizeImage(sourcePath, directory);

    const [sourceStats, targetMetadata] = await Promise.all([
      fs.stat(sourcePath),
      sharp(targetPath).metadata(),
    ]);

    expect(sourceStats.isFile()).toBe(true);
    expect(targetMetadata.format).toBe("webp");
    expect(targetMetadata.width).toBe(32);
    expect(targetMetadata.height).toBe(24);
  });

  it("optimizes an existing WebP in place", async () => {
    const directory = await createTemporaryDirectory();
    const imagePath = path.join(directory, "cover.webp");

    await sharp({
      create: {
        width: 1800,
        height: 1200,
        channels: 3,
        background: "#2c6e59",
      },
    })
      .webp()
      .toFile(imagePath);

    await optimizeImage(imagePath, directory);

    const metadata = await sharp(imagePath).metadata();
    expect(metadata.format).toBe("webp");
    expect(metadata.width).toBe(1600);
    expect(metadata.height).toBeLessThanOrEqual(1600);
  });
});
