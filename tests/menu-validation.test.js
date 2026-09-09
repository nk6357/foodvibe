import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const menuPath = path.join(root, "public/restaurant/menu.json");

const rgbColorSchema = z.tuple([
  z.number().int().min(0).max(255),
  z.number().int().min(0).max(255),
  z.number().int().min(0).max(255),
]);

const menuSchema = z.object({
  schemaVersion: z.number().int().positive(),
  restaurant: z.object({
    name: z.string().min(1),
    timeZone: z.string().min(1),
  }),
  theme: z.object({
    accent: rgbColorSchema,
    background: rgbColorSchema,
  }),
  categories: z
    .array(
      z.object({
        id: z.string(),
        items: z.array(
          z.object({
            id: z.number().int().positive(),
            price: z.number().min(0),
            oldPrice: z.number().nullable(),
            spiceLevel: z.number().int().min(0).max(3),
          }),
        ),
      }),
    )
    .min(1),
});

describe("menu.json", () => {
  it("exists and parses", () => {
    expect(fs.existsSync(menuPath)).toBe(true);
    const menu = JSON.parse(fs.readFileSync(menuPath, "utf8"));
    expect(() => menuSchema.parse(menu)).not.toThrow();
  });

  it("has unique dish ids", () => {
    const menu = JSON.parse(fs.readFileSync(menuPath, "utf8"));
    const ids = menu.categories.flatMap((category) =>
      category.items.map((item) => item.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has valid oldPrice values", () => {
    const menu = JSON.parse(fs.readFileSync(menuPath, "utf8"));
    for (const category of menu.categories) {
      for (const item of category.items) {
        if (item.oldPrice !== null) {
          expect(item.oldPrice).toBeGreaterThan(item.price);
        }
      }
    }
  });

  it("has required demo dish images when hasImage is true", () => {
    const menu = JSON.parse(fs.readFileSync(menuPath, "utf8"));
    for (const category of menu.categories) {
      for (const item of category.items) {
        if (!item.hasImage) {
          continue;
        }
        const imagePath = path.join(
          root,
          "public/restaurant/assets/dishes",
          `${item.id}.webp`,
        );
        expect(fs.existsSync(imagePath)).toBe(true);
      }
    }
  });
});
