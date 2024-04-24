import { GetServerSideProps } from "next";
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import styles from "./Dashboard.module.css";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Textarea from '@/components/Textarea';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

// firebase
import { db } from '@/services/firebaseConection';
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from "firebase/firestore"
import Link from 'next/link';


type HomeProps = {
  user: {
    email: string
  }
}

type TaskProps = {
  id: string,
  created: string,
  public: boolean,
  tarefa: string,
  user: string
}
export default function Dashboard({ user }: HomeProps) {
  const [tasks, setTasks] = useState<TaskProps[]>([])
  const [input, setInput] = useState("")
  const [publicTask, setPublicTask] = useState(false)

  useEffect(() => {
    async function loadTask() {

      const tarefasRef = collection(db, "tarefas")
      const q = query(
        tarefasRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      )
      onSnapshot(q, (snapshot) => {
        // 
        let list = [] as TaskProps[]
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            created: doc.data().created,
            public: doc.data().public,
            tarefa: doc.data().tarefa,
            user: doc.data().user
          })
        })
        setTasks(list)
      })
    }
    loadTask()

  }, [user?.email])

  function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
    setPublicTask(e.target.checked)
  }


  async function handleRegisterTask(e: FormEvent) {
    e.preventDefault();
    if (input === "") return

    try {
      const userEmail = user?.email || 'teste@gmail.com';
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: userEmail,
        public: publicTask
      })
      setInput("")
      setPublicTask(false)
      alert("Tarefa cadastrada com sucesso!")
    } catch (error) {
      console.log(error)
    }
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    )
    alert("URL copiada com sucesso!")
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tarefas", id)
    await deleteDoc(docRef)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form onSubmit={handleRegisterTask}>
              <Textarea placeholder='Digite qual sua tarefa...' value={input} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} />
              <div className={styles.checkBoxArea}>
                <label>
                  <input type="checkbox" className={styles.checkBox} checked={publicTask} onChange={handleChangePublic} />
                  <span className={styles.checkBoxText}>Deixar tarefa pública?</span>
                </label>
              </div>
              <button type='submit' className={styles.button}>Registrar</button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1 className={styles.title}>Minhas Tarefas</h1>
          {tasks.map((item) => (
            <article className={styles.task} key={item.id}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PUBLICO</label>
                  <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}
              <div className={styles.taskContent}>
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.tarefa}</p>
                  </Link>
                ) : (
                  <p>{item.tarefa}</p>
                )}
                <button className={styles.trashButton}>
                  <FaTrash size={24} color='#ea3140' onClick={() => handleDeleteTask(item.id)} />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  console.log(session);
  if (!session?.user) {
    // redirecionando usuario que nao esta logado
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: { email: session?.user?.email }
    },
  };
};
