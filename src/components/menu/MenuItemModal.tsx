import { useState } from "react";
import type {
  FeaturesConfig,
  MenuItem,
  RestaurantInfo,
  ThemeConfig,
} from "@/schema/menuTypes";
import { Modal } from "@/components/ui/Modal";
import { dishImagePath, placeholderImagePath } from "@/utils/assetPath";
import { formatPrice } from "@/utils/formatters";
import { SpiceIndicator } from "./SpiceIndicator";
import styles from "./MenuItemModal.module.css";

interface MenuItemModalProps {
  item: MenuItem | null;
  restaurant: RestaurantInfo;
  features: FeaturesConfig;
  theme: ThemeConfig;
  onClose: () => void;
}

export function MenuItemModal({
  item,
  restaurant,
  features,
  theme,
  onClose,
}: MenuItemModalProps) {
  const [imageError, setImageError] = useState(false);

  if (!item) {
    return null;
  }

  const imageSrc =
    item.hasImage && !imageError ? dishImagePath(item.id) : placeholderImagePath();

  return (
    <Modal isOpen={Boolean(item)} onClose={onClose} ariaLabel={item.name}>
      <div className={styles.imageSection}>
        <img
          src={imageSrc}
          alt={item.name}
          className={`${styles.image} ${theme.imageStyle === "contain" ? styles.imageContain : ""}`}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{item.name}</h2>
        <div className={styles.priceRow}>
          <span className={styles.price}>
            {formatPrice(item.price, restaurant.currency, restaurant.locale)}
          </span>
          {item.oldPrice ? (
            <span className={styles.oldPrice}>
              {formatPrice(item.oldPrice, restaurant.currency, restaurant.locale)}
            </span>
          ) : null}
        </div>
        {!item.available ? (
          <p className={styles.unavailable}>Сейчас недоступно</p>
        ) : null}
        {features.showDescriptions && item.description ? (
          <p className={styles.description}>{item.description}</p>
        ) : null}
        {features.showWeights && item.weight ? (
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Порция</span>
            <span>{item.weight}</span>
          </div>
        ) : null}
        {features.showSpiceLevel && item.spiceLevel > 0 ? (
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Острота</span>
            <SpiceIndicator level={item.spiceLevel} showLabel />
          </div>
        ) : null}
        {features.showLabels && item.labels.length > 0 ? (
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Отметки</span>
            <div className={styles.tags}>
              {item.labels.map((label) => (
                <span key={label} className={`${styles.tag} ${styles.label}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {features.showAllergens && item.allergens.length > 0 ? (
          <div className={styles.section}>
            <span className={styles.sectionTitle}>Аллергены</span>
            <div className={styles.tags}>
              {item.allergens.map((allergen) => (
                <span key={allergen} className={styles.tag}>
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
