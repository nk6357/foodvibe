import { menuSchema } from "@/schema/menuSchema";
import type { FlatMenuItem, MenuData, MenuItem } from "@/schema/menuTypes";
import { assetPath } from "@/utils/assetPath";
import { normalizeSearchText } from "@/utils/validation";

export async function loadMenu(): Promise<MenuData> {
  const response = await fetch(assetPath("restaurant/menu.json"));

  if (!response.ok) {
    throw new Error(`Failed to load menu: ${response.status}`);
  }

  const json: unknown = await response.json();
  return menuSchema.parse(json);
}

export function flattenMenu(categories: MenuData["categories"]): FlatMenuItem[] {
  return categories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryId: category.id,
      categoryName: category.name,
    })),
  );
}

export function filterVisibleItems(
  items: MenuItem[],
  showUnavailableItems: boolean,
): MenuItem[] {
  if (showUnavailableItems) {
    return items;
  }
  return items.filter((item) => item.available);
}

export function filterCategoriesWithItems(
  categories: MenuData["categories"],
  showUnavailableItems: boolean,
): MenuData["categories"] {
  return categories
    .map((category) => ({
      ...category,
      items: filterVisibleItems(category.items, showUnavailableItems),
    }))
    .filter((category) => category.items.length > 0);
}

export function searchMenuItems(items: FlatMenuItem[], query: string): FlatMenuItem[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => {
    const haystack = [
      item.name,
      item.description ?? "",
      item.categoryName,
      ...item.labels,
      ...item.allergens,
    ]
      .map(normalizeSearchText)
      .join(" ");

    return haystack.includes(normalizedQuery);
  });
}

export function groupSearchResultsByCategory(
  items: FlatMenuItem[],
): Map<string, { name: string; items: FlatMenuItem[] }> {
  const grouped = new Map<string, { name: string; items: FlatMenuItem[] }>();

  for (const item of items) {
    const existing = grouped.get(item.categoryId);
    if (existing) {
      existing.items.push(item);
      continue;
    }
    grouped.set(item.categoryId, {
      name: item.categoryName,
      items: [item],
    });
  }

  return grouped;
}
