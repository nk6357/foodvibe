import { useState } from "react";
import type { RestaurantInfo } from "@/schema/menuTypes";
import { Button } from "@/components/ui/Button";
import { formatPhoneDisplay, phoneHref } from "@/utils/formatters";
import styles from "./Contacts.module.css";

interface ContactsProps {
  restaurant: RestaurantInfo;
}

export function Contacts({ restaurant }: ContactsProps) {
  const [mapEnabled, setMapEnabled] = useState(false);
  const hasMap = Boolean(restaurant.mapUrl);

  return (
    <section
      id="contacts-section"
      className={styles.section}
      aria-labelledby="contacts-title"
    >
      <div className="container">
        <h2 id="contacts-title" className="sectionTitle">
          Контакты
        </h2>
        <div className={styles.grid}>
          {restaurant.address ? (
            <div className={styles.card}>
              <div className={styles.label}>Адрес</div>
              <p className={styles.value}>{restaurant.address}</p>
            </div>
          ) : null}
          {restaurant.workingHours ? (
            <div className={styles.card}>
              <div className={styles.label}>Часы работы</div>
              <p className={styles.value}>{restaurant.workingHours}</p>
            </div>
          ) : null}
          {restaurant.phone ? (
            <div className={styles.card}>
              <div className={styles.label}>Телефон</div>
              <a
                className={`${styles.value} ${styles.link}`}
                href={phoneHref(restaurant.phone)}
              >
                {formatPhoneDisplay(restaurant.phone)}
              </a>
            </div>
          ) : null}
          {restaurant.email ? (
            <div className={styles.card}>
              <div className={styles.label}>Email</div>
              <a
                className={`${styles.value} ${styles.link}`}
                href={`mailto:${restaurant.email}`}
              >
                {restaurant.email}
              </a>
            </div>
          ) : null}
          {restaurant.socialLinks.length > 0 ? (
            <div className={styles.card}>
              <div className={styles.label}>Соцсети</div>
              <div className={styles.socials}>
                {restaurant.socialLinks.map((link) => (
                  <a
                    key={`${link.type}-${link.url}`}
                    className={styles.socialLink}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          {hasMap ? (
            <div className={`${styles.card} ${styles.mapConsent}`}>
              <div className={styles.label}>Карта</div>
              {mapEnabled ? (
                <iframe
                  title="Карта ресторана"
                  className={styles.mapFrame}
                  src={restaurant.mapUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <>
                  <p className="muted">
                    Карта загружается только после вашего согласия и может использовать
                    сторонний сервис.
                  </p>
                  <Button variant="secondary" onClick={() => setMapEnabled(true)}>
                    Показать карту
                  </Button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
