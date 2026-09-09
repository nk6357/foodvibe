import type { LegalConfig, RestaurantInfo } from "@/schema/menuTypes";
import { assetPath } from "@/utils/assetPath";
import styles from "./Footer.module.css";

interface FooterProps {
  restaurant: RestaurantInfo;
  legal: LegalConfig;
}

export function Footer({ restaurant, legal }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.text}>
          © {year} {restaurant.name}
        </p>
        {legal.enabled ? (
          <div className={styles.links}>
            {legal.privacyDocument ? (
              <a
                className={styles.link}
                href={assetPath(legal.privacyDocument)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Политика конфиденциальности
              </a>
            ) : null}
            {legal.offerDocument ? (
              <a
                className={styles.link}
                href={assetPath(legal.offerDocument)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Публичная оферта
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
