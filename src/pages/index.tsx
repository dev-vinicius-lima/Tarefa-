import Image from "next/image";
import styles from "../styles/Page.module.css";
import heroImg from "../../public/assets/hero.png";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.logoContent}>
        <Image
          className={styles.hero}
          alt="logo tarefas+"
          src={heroImg}
          priority
        />
      </div>
      <h1 className={styles.title}>
        Sistema feito para você organizar <br />
        seus estudos e tarefas
      </h1>
      <div className={styles.infoContent}>
        <section className={styles.box}>
          <span>+12 posts</span>
        </section>
        <section className={styles.box}>
          <span>+90 Comentarios</span>
        </section>
      </div>
    </div>
  );
}
