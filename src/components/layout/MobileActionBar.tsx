import styles from "./MobileActionBar.module.css";

interface MobileActionBarProps {
  showContacts: boolean;
}

export function MobileActionBar({ showContacts }: MobileActionBarProps) {
  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu-section");
    menuSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToContacts = () => {
    const contactsSection = document.getElementById("contacts-section");
    contactsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.bar}>
      <button type="button" className={styles.action} onClick={scrollToMenu}>
        Меню
      </button>
      {showContacts ? (
        <button type="button" className={styles.action} onClick={scrollToContacts}>
          Контакты
        </button>
      ) : null}
    </div>
  );
}
