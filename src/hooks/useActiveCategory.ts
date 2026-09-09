import { useCallback, useEffect, useRef, useState } from "react";

interface UseActiveCategoryOptions {
  categoryIds: string[];
  enabled: boolean;
  headerOffset?: number;
}

export function useActiveCategory({
  categoryIds,
  enabled,
  headerOffset = 120,
}: UseActiveCategoryOptions) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categoryIds[0] ?? "",
  );
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const scrollToCategory = useCallback(
    (categoryId: string) => {
      const element = document.getElementById(`category-${categoryId}`);
      if (!element) {
        return;
      }

      isScrollingRef.current = true;
      setActiveCategoryId(categoryId);

      const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    },
    [headerOffset],
  );

  useEffect(() => {
    if (!enabled || categoryIds.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) {
          return;
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const topEntry = visible[0];
        if (topEntry?.target.id.startsWith("category-")) {
          setActiveCategoryId(topEntry.target.id.replace("category-", ""));
        }
      },
      {
        root: null,
        rootMargin: `-${headerOffset}px 0px -55% 0px`,
        threshold: [0.1, 0.3, 0.6],
      },
    );

    for (const categoryId of categoryIds) {
      const element = document.getElementById(`category-${categoryId}`);
      if (element) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [categoryIds, enabled, headerOffset]);

  return {
    activeCategoryId,
    scrollToCategory,
  };
}
