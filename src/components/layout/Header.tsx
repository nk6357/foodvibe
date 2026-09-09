import type { RestaurantInfo } from "@/schema/menuTypes";
import { assetPath } from "@/utils/assetPath";
import styles from "./Header.module.css";

interface HeaderProps {
  restaurant: RestaurantInfo;
}

export function Header({ restaurant }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <img
          src={assetPath("restaurant/assets/logo.svg")}
          alt=""
          className={styles.logo}
          width={40}
          height={40}
        />
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{restaurant.name}</h1>
          {restaurant.shortDescription ? (
            <p className={styles.subtitle}>{restaurant.shortDescription}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
