import { useState } from "react";
import type {
  FeaturesConfig,
  MenuItem,
  RestaurantInfo,
  ThemeConfig,
} from "@/schema/menuTypes";
import { dishImagePath, placeholderImagePath } from "@/utils/assetPath";
import { formatPrice } from "@/utils/formatters";
import { SpiceIndicator } from "./SpiceIndicator";
import styles from "./MenuCard.module.css";

interface MenuCardProps {
  item: MenuItem;
  restaurant: RestaurantInfo;
  features: FeaturesConfig;
  theme: ThemeConfig;
  onOpen?: (item: MenuItem) => void;
}

export function MenuCard({ item, restaurant, features, theme, onOpen }: MenuCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    item.hasImage && !imageError ? dishImagePath(item.id) : placeholderImagePath();

  const content = (
    <>
      <div className={styles.imageWrap}>
        <img
          src={imageSrc}
          alt={item.name}
          className={`${styles.image} ${theme.imageStyle === "contain" ? styles.imageContain : ""}`}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
        />
        {!item.available ? (
          <span className={styles.unavailableBadge}>Нет в наличии</span>
        ) : null}
      </div>
      <div className={styles.body}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{item.name}</h3>
          <div className={styles.priceBlock}>
            <span className={styles.price}>
              {formatPrice(item.price, restaurant.currency, restaurant.locale)}
            </span>
            {item.oldPrice ? (
              <span className={styles.oldPrice}>
                {formatPrice(item.oldPrice, restaurant.currency, restaurant.locale)}
              </span>
            ) : null}
          </div>
        </div>
        {features.showDescriptions && item.description ? (
          <p className={styles.description}>{item.description}</p>
        ) : null}
        <div className={styles.meta}>
          {features.showWeights && item.weight ? (
            <span className={styles.weight}>{item.weight}</span>
          ) : null}
          {features.showSpiceLevel ? <SpiceIndicator level={item.spiceLevel} /> : null}
          {features.showLabels
            ? item.labels.map((label) => (
                <span key={label} className={styles.label}>
                  {label}
                </span>
              ))
            : null}
        </div>
      </div>
    </>
  );

  if (features.dishModal && onOpen) {
    return (
      <button
        type="button"
        className={`${styles.card} ${!item.available ? styles.cardUnavailable : ""}`}
        onClick={() => onOpen(item)}
        aria-label={`Подробнее о блюде ${item.name}`}
      >
        {content}
      </button>
    );
  }

  return (
    <article
      className={`${styles.card} ${!item.available ? styles.cardUnavailable : ""}`}
    >
      {content}
    </article>
  );
}
