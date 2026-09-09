import { useMemo, useState } from "react";
import type { FlatMenuItem } from "@/schema/menuTypes";
import { searchMenuItems } from "@/services/menuService";

export function useSearch(items: FlatMenuItem[]) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => searchMenuItems(items, query),
    [items, query],
  );

  const isSearching = query.trim().length > 0;

  return {
    query,
    setQuery,
    results,
    isSearching,
  };
}
