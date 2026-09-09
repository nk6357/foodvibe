import type { RestaurantInfo } from "@/schema/menuTypes";
import { assetPath } from "@/utils/assetPath";
import styles from "./RestaurantHero.module.css";

interface RestaurantHeroProps {
  restaurant: RestaurantInfo;
}

export function RestaurantHero({ restaurant }: RestaurantHeroProps) {
  return (
    <section className={styles.hero} aria-label="О ресторане">
      <div className="container">
        <div className={styles.coverWrap}>
          <img
            src={assetPath("restaurant/assets/cover.webp")}
            alt=""
            className={styles.cover}
            loading="eager"
            decoding="async"
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{restaurant.name}</h2>
          {restaurant.description ? (
            <p className={styles.description}>{restaurant.description}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
