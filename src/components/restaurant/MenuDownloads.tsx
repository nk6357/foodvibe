import type { DownloadItem } from "@/schema/menuTypes";
import { assetPath } from "@/utils/assetPath";
import styles from "./MenuDownloads.module.css";

interface MenuDownloadsProps {
  downloads: DownloadItem[];
}

export function MenuDownloads({ downloads }: MenuDownloadsProps) {
  if (downloads.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="downloads-title">
      <div className="container">
        <h2 id="downloads-title" className="sectionTitle">
          Скачать меню
        </h2>
        <div className={styles.list}>
          {downloads.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.info}>
                <div className={styles.title}>{item.title}</div>
                {item.description ? (
                  <p className={styles.description}>{item.description}</p>
                ) : null}
              </div>
              <a
                className={styles.downloadLink}
                href={assetPath(item.file)}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                PDF
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
