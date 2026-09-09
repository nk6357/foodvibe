import { describe, expect, it } from "vitest";
import type { FlatMenuItem } from "@/schema/menuTypes";
import { searchMenuItems } from "@/services/menuService";

const items: FlatMenuItem[] = [
  {
    id: 1001,
    name: "Сырники",
    description: "Сметана и ягоды",
    price: 390,
    oldPrice: null,
    weight: "220 г",
    labels: ["Хит"],
    allergens: ["Молоко"],
    spiceLevel: 0,
    available: true,
    hasImage: true,
    categoryId: "breakfasts",
    categoryName: "Завтраки",
  },
  {
    id: 1005,
    name: "Поке с лососем",
    description: "Рис и соус",
    price: 690,
    oldPrice: null,
    weight: "320 г",
    labels: ["Острое"],
    allergens: ["Рыба"],
    spiceLevel: 2,
    available: true,
    hasImage: true,
    categoryId: "bowls",
    categoryName: "Боулы",
  },
];

describe("searchMenuItems", () => {
  it("finds items by cyrillic name case-insensitively", () => {
    expect(searchMenuItems(items, "сырники")).toHaveLength(1);
    expect(searchMenuItems(items, "СЫР")).toHaveLength(1);
  });

  it("searches in labels and allergens", () => {
    expect(searchMenuItems(items, "молоко")).toHaveLength(1);
    expect(searchMenuItems(items, "острое")).toHaveLength(1);
  });

  it("returns all items for empty query", () => {
    expect(searchMenuItems(items, "")).toHaveLength(2);
    expect(searchMenuItems(items, "   ")).toHaveLength(2);
  });

  it("returns empty array when nothing matches", () => {
    expect(searchMenuItems(items, "пицца")).toHaveLength(0);
  });
});
