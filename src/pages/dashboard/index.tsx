import { GetServerSideProps } from 'next';
import styles from "./Dashboard.module.css";
import Head from "next/head";
import { getSession } from 'next-auth/react';

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      <h1>Meu painel de tarefas</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  console.log(session)
  if (!session?.user) {
    // redirecionando usuario que nao esta logado
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {}
  }
} 
