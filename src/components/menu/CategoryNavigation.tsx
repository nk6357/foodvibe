import type { MenuCategory } from "@/schema/menuTypes";
import styles from "./CategoryNavigation.module.css";

interface CategoryNavigationProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryNavigation({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryNavigationProps) {
  return (
    <nav className={styles.nav} aria-label="Категории меню">
      <div className="container">
        <div className={styles.inner}>
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                type="button"
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(category.id)}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
