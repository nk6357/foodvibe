import { useState } from "react";
import type { LegalConfig } from "@/schema/menuTypes";
import { assetPath } from "@/utils/assetPath";
import styles from "./CookieNotice.module.css";

interface CookieNoticeProps {
  legal: LegalConfig;
}

export function CookieNotice({ legal }: CookieNoticeProps) {
  const notice = legal.cookieNotice;
  const storageKey = `foodvibe-cookie-notice:${legal.version ?? "1"}`;
  const [isVisible, setIsVisible] = useState(() => {
    if (!notice?.enabled) {
      return false;
    }

    try {
      return window.localStorage.getItem(storageKey) !== "acknowledged";
    } catch {
      return true;
    }
  });

  if (!notice?.enabled || !isVisible) {
    return null;
  }

  const acknowledge = () => {
    try {
      window.localStorage.setItem(storageKey, "acknowledged");
    } catch {
      // The notice can still be dismissed for the current page view.
    }
    setIsVisible(false);
  };

  return (
    <aside className={styles.notice} aria-label="Уведомление о файлах cookie">
      <p className={styles.text}>
        {notice.text}{" "}
        {legal.privacyDocument && notice.privacyLinkLabel ? (
          <a
            className={styles.link}
            href={assetPath(legal.privacyDocument)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {notice.privacyLinkLabel}
          </a>
        ) : null}
      </p>
      <button type="button" className={styles.button} onClick={acknowledge}>
        {notice.buttonLabel}
      </button>
    </aside>
  );
}
