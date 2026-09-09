import { useEffect, useMemo, useState } from "react";
import type { FlatMenuItem, MenuCategory, MenuItem } from "@/schema/menuTypes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { CategoryNavigation } from "@/components/menu/CategoryNavigation";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { MenuItemModal } from "@/components/menu/MenuItemModal";
import { SearchBar } from "@/components/menu/SearchBar";
import { Contacts } from "@/components/restaurant/Contacts";
import { MenuDownloads } from "@/components/restaurant/MenuDownloads";
import { RestaurantHero } from "@/components/restaurant/RestaurantHero";
import { ErrorScreen } from "@/components/ui/ErrorScreen";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useActiveCategory } from "@/hooks/useActiveCategory";
import { useMenu } from "@/hooks/useMenu";
import { useSearch } from "@/hooks/useSearch";
import {
  filterCategoriesWithItems,
  flattenMenu,
  groupSearchResultsByCategory,
} from "@/services/menuService";
import { applyThemeVariables } from "@/utils/color";

export default function App() {
  const { menu, error, loading } = useMenu();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (!menu) {
      return;
    }

    applyThemeVariables(menu.theme.accent, menu.theme.background, menu.theme.cardStyle);

    const seoTitle = menu.seo.title ?? menu.restaurant.name;
    const seoDescription =
      menu.seo.description ??
      menu.restaurant.shortDescription ??
      menu.restaurant.description ??
      "QR menu";

    document.title = seoTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", seoDescription);

    if (!menu.seo.index) {
      let robots = document.querySelector('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex, nofollow");
    }
  }, [menu]);

  const visibleCategories = useMemo(() => {
    if (!menu) {
      return [];
    }
    return filterCategoriesWithItems(
      menu.categories,
      menu.features.showUnavailableItems,
    );
  }, [menu]);

  const flatItems = useMemo(() => flattenMenu(visibleCategories), [visibleCategories]);

  const { query, setQuery, results, isSearching } = useSearch(flatItems);

  const displayedCategories = useMemo(() => {
    if (!menu || !isSearching) {
      return visibleCategories;
    }

    const grouped = groupSearchResultsByCategory(results);
    const ordered: MenuCategory[] = [];

    for (const category of visibleCategories) {
      const group = grouped.get(category.id);
      if (group && group.items.length > 0) {
        ordered.push({
          id: category.id,
          name: category.name,
          description: category.description,
          items: group.items,
        });
      }
    }

    return ordered;
  }, [menu, isSearching, results, visibleCategories]);

  const categoryIds = visibleCategories.map((category) => category.id);
  const { activeCategoryId, scrollToCategory } = useActiveCategory({
    categoryIds,
    enabled: Boolean(menu?.features.categoryNavigation) && !isSearching,
  });

  const handleOpenItem = (item: FlatMenuItem) => {
    if (!menu?.features.dishModal) {
      return;
    }
    setSelectedItem(item);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !menu) {
    return <ErrorScreen message={error ?? "Menu data is unavailable"} />;
  }

  return (
    <>
      <Header restaurant={menu.restaurant} />
      <main>
        <RestaurantHero restaurant={menu.restaurant} />
        {menu.features.downloadableMenu ? (
          <MenuDownloads downloads={menu.downloads} />
        ) : null}
        <section id="menu-section" className="section" aria-label="Меню">
          <div className="container">
            {menu.features.search ? (
              <div style={{ marginBottom: "1rem" }}>
                <SearchBar value={query} onChange={setQuery} />
              </div>
            ) : null}
          </div>
          {menu.features.categoryNavigation && !isSearching ? (
            <CategoryNavigation
              categories={visibleCategories}
              activeCategoryId={activeCategoryId}
              onSelect={scrollToCategory}
            />
          ) : null}
          <div className="container">
            <MenuGrid
              categories={displayedCategories}
              restaurant={menu.restaurant}
              features={menu.features}
              theme={menu.theme}
              onOpenItem={menu.features.dishModal ? handleOpenItem : undefined}
            />
          </div>
        </section>
        {menu.features.contacts ? <Contacts restaurant={menu.restaurant} /> : null}
      </main>
      <Footer restaurant={menu.restaurant} legal={menu.legal} />
      <MobileActionBar showContacts={menu.features.contacts} />
      {menu.features.dishModal ? (
        <MenuItemModal
          item={selectedItem}
          restaurant={menu.restaurant}
          features={menu.features}
          theme={menu.theme}
          onClose={() => setSelectedItem(null)}
        />
      ) : null}
    </>
  );
}
