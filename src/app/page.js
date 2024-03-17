import FirebaseCrud from "./components/FirebaseCrud/FirebaseCrud";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <FirebaseCrud />
    </main>
  );
}
