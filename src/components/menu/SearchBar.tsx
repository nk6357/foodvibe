import styles from "./SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Поиск по меню…",
}: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="menu-search" className="srOnly">
        Поиск по меню
      </label>
      <input
        id="menu-search"
        type="search"
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
      />
      {value ? (
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => onChange("")}
          aria-label="Очистить поиск"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
