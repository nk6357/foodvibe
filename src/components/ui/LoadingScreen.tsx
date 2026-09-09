import styles from "./LoadingScreen.module.css";

export function LoadingScreen() {
  return (
    <div className={styles.screen} role="status" aria-live="polite">
      <div className={styles.content}>
        <div className={styles.spinner} aria-hidden="true" />
        <p>Загрузка меню…</p>
      </div>
    </div>
  );
}
