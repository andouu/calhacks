import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <span className={styles.big}>Talking has never been so fun.</span>
        <span className={styles.small}>
          Play vocal games that effectively teach you new languages, without
          being
          <br />
          boring, boring, boring.
        </span>
        <Link href="/play">
          <button className={`${styles.action} outlined`}>Play Now!</button>
        </Link>
      </div>
      <div className={styles.ball}>
        <img className={styles.face} src="/face.svg" />
      </div>
    </div>
  );
}
