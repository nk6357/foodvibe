import type {
  FeaturesConfig,
  FlatMenuItem,
  MenuCategory,
  RestaurantInfo,
  ThemeConfig,
} from "@/schema/menuTypes";
import { MenuCard } from "./MenuCard";
import styles from "./MenuGrid.module.css";

interface MenuGridProps {
  categories: MenuCategory[];
  restaurant: RestaurantInfo;
  features: FeaturesConfig;
  theme: ThemeConfig;
  onOpenItem?: (item: FlatMenuItem) => void;
}

export function MenuGrid({
  categories,
  restaurant,
  features,
  theme,
  onOpenItem,
}: MenuGridProps) {
  const densityClass =
    theme.density === "compact"
      ? styles.densityCompact
      : theme.density === "spacious"
        ? styles.densitySpacious
        : "";

  if (categories.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Ничего не найдено</p>
      </div>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <section
          key={category.id}
          id={`category-${category.id}`}
          className={styles.section}
          aria-labelledby={`category-title-${category.id}`}
        >
          <div className={styles.header}>
            <h2 id={`category-title-${category.id}`} className={styles.categoryTitle}>
              {category.name}
            </h2>
            {category.description ? (
              <p className={styles.categoryDescription}>{category.description}</p>
            ) : null}
          </div>
          <div className={`${styles.grid} ${densityClass}`}>
            {category.items.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                restaurant={restaurant}
                features={features}
                theme={theme}
                onOpen={
                  onOpenItem
                    ? () =>
                        onOpenItem({
                          ...item,
                          categoryId: category.id,
                          categoryName: category.name,
                        })
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
