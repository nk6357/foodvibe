import { useEffect, useState } from "react";
import type { MenuData } from "@/schema/menuTypes";
import { loadMenu } from "@/services/menuService";

interface UseMenuResult {
  menu: MenuData | null;
  error: string | null;
  loading: boolean;
}

export function useMenu(): UseMenuResult {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadMenu()
      .then((data) => {
        if (!cancelled) {
          setMenu(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setError(message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { menu, error, loading };
}
