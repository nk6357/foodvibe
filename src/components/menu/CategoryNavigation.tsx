import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    const tolerance = 2;
    setCanScrollLeft(scroller.scrollLeft > tolerance);
    setCanScrollRight(scroller.scrollLeft < maxScrollLeft - tolerance);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scroller);
    window.addEventListener("resize", updateScrollState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [categories, updateScrollState]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const activeTab = tabRefs.current.get(activeCategoryId);
    if (!scroller || !activeTab) {
      return;
    }

    const tabLeft = activeTab.offsetLeft;
    const tabRight = tabLeft + activeTab.offsetWidth;
    const visibleLeft = scroller.scrollLeft;
    const visibleRight = visibleLeft + scroller.clientWidth;

    if (tabLeft < visibleLeft || tabRight > visibleRight) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      scroller.scrollTo({
        left: tabLeft - (scroller.clientWidth - activeTab.offsetWidth) / 2,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  }, [activeCategoryId]);

  const scrollCategories = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.75,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = Math.min(index + 1, categories.length - 1);
    } else if (event.key === "ArrowLeft") {
      nextIndex = Math.max(index - 1, 0);
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = categories.length - 1;
    }

    if (nextIndex === null || nextIndex === index) {
      return;
    }

    event.preventDefault();
    const nextCategory = categories[nextIndex];
    if (nextCategory) {
      tabRefs.current.get(nextCategory.id)?.focus();
    }
  };

  return (
    <nav
      id="category-navigation"
      className={styles.nav}
      aria-label="Категории меню"
    >
      <div className="container">
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            aria-label="Прокрутить разделы влево"
            aria-controls="category-list"
            disabled={!canScrollLeft}
            onClick={() => scrollCategories(-1)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div
            id="category-list"
            ref={scrollerRef}
            className={styles.inner}
            onScroll={updateScrollState}
          >
            {categories.map((category, index) => {
              const isActive = category.id === activeCategoryId;
              return (
                <button
                  key={category.id}
                  ref={(node) => {
                    if (node) {
                      tabRefs.current.set(category.id, node);
                    } else {
                      tabRefs.current.delete(category.id);
                    }
                  }}
                  type="button"
                  className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onSelect(category.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.arrow}
            aria-label="Прокрутить разделы вправо"
            aria-controls="category-list"
            disabled={!canScrollRight}
            onClick={() => scrollCategories(1)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
