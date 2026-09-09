import styles from "./SpiceIndicator.module.css";

interface SpiceIndicatorProps {
  level: number;
  showLabel?: boolean;
}

export function SpiceIndicator({ level, showLabel = false }: SpiceIndicatorProps) {
  if (level <= 0) {
    return null;
  }

  return (
    <span className={styles.indicator} aria-label={`Острота ${level} из 3`}>
      {Array.from({ length: 3 }, (_, index) => (
        <span
          key={index}
          className={`${styles.pepper} ${index < level ? styles.pepperActive : ""}`}
          aria-hidden="true"
        />
      ))}
      {showLabel ? <span className={styles.label}>Остро</span> : null}
    </span>
  );
}
