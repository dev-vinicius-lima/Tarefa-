import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import styles from "./Header.module.css";

const Header = () => {
  const { data: session, status } = useSession();
  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Tarefas <span>+</span>
            </h1>
          </Link>
          {session?.user && (<Link href={"/dashboard"} className={styles.link}>
            Meu painel
          </Link>)}
        </nav>
        {status === "loading" ? (
          <></>
        ) : session ? (
          <button className={styles.loginButton} onClick={() => signOut()}>Olá {session?.user?.name}</button>
        ) : (
          <button className={styles.loginButton} onClick={() => signIn("google")}>Entrar</button>
        )}
      </section>
    </header>
  );
};

export default Header;
