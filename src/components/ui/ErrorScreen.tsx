import styles from "./ErrorScreen.module.css";

interface ErrorScreenProps {
  title?: string;
  message: string;
}

export function ErrorScreen({
  title = "Не удалось загрузить меню",
  message,
}: ErrorScreenProps) {
  return (
    <div className={styles.screen} role="alert">
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
