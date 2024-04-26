import Image from "next/image";
import styles from "../styles/Page.module.css";
import heroImg from "../../public/assets/hero.png";
import { GetStaticProps } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebaseConection';

type HomeProps = {
  posts: number;
  comments: number;
}
export default function Home({ posts, comments }: HomeProps) {
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
          <span>+{posts} posts</span>
        </section>
        <section className={styles.box}>
          <span>+{comments} Comentarios</span>
        </section>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // 
  const commentRef = collection(db, "comments")
  const postRef = collection(db, "tarefas")

  const commnetSnapshot = await getDocs(commentRef)
  const postSnapshot = await getDocs(postRef)

  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commnetSnapshot.size || 0,
    },
    revalidate: 60, // revalidada por 60 segundos
  }
} 
