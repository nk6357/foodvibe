export function assetPath(relativePath: string): string {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${base}${relativePath.replace(/^\/+/, "")}`;
}

export function dishImagePath(dishId: number): string {
  return assetPath(`restaurant/assets/dishes/${dishId}.webp`);
}

export function placeholderImagePath(): string {
  return assetPath("restaurant/assets/placeholder.webp");
}
