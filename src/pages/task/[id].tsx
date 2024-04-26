import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import styles from "./Task.module.css";
import { GetServerSideProps } from "next";
import { db } from "@/services/firebaseConection";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc
} from "firebase/firestore";
import Textarea from "@/components/Textarea";
import { FaTrash } from 'react-icons/fa';
type TaskItemProps = {
  item: {
    tarefa: string;
    created: string;
    public: boolean;
    user: string;
    taskId: string;
  };
  allcomments: CommentProps[];
};
type CommentProps = {
  id: string;
  comment: string;
  user: string;
  taskId: string;
  name: string;
};

export default function Task({ item, allcomments }: TaskItemProps) {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(allcomments || []);


  async function handleComment(e: FormEvent) {
    e.preventDefault();
    if (input === "") return;
    if (!session?.user?.email || !session?.user.name) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      });
      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      }

      setComments((oldItem) => [...oldItem, data])
      setInput("");
    } catch (error) {
      console.log(error);
    }
  }

  // deletar comentarios
  async function handleDeleteComment(id: string) {
    try {
      const docRef = doc(db, "comments", id)
      await deleteDoc(docRef)

      const deleteComment = comments.filter((comment) => comment.id !== id)
      setComments(deleteComment)

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefa - Detalhes da tarefa</title>
      </Head>
      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>{item.tarefa}</p>
        </article>
      </main>
      <section className={styles.commentsContainer}>
        <h2>Deixar comentário</h2>
        <form onSubmit={handleComment}>
          <Textarea
            placeholder="Digite seu comentário..."
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
          />
          <button disabled={!session?.user} className={styles.button}>
            Enviar comentário
          </button>
        </form>
      </section>

      <section className={styles.commentsContainer}>
        <h2>Todos os comentários</h2>
        {comments.length === 0 && <span>Nenhum comentario encontrado...</span>}
        {comments.map((item) => (
          <article className={styles.comment} key={item.id}>
            <div className={styles.headComment}>
              <label className={styles.commentsLabel}>{item.name}</label>
              {item.user === session?.user?.email && (
                <button className={styles.buttonTrash}
                  onClick={() => handleDeleteComment(item.id)}><FaTrash size={18} color='#ea3140' /></button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const docRef = doc(db, "tarefas", params?.id as string);
  const q = query(
    collection(db, "comments"),
    where("taskId", "==", params?.id as string)
  );
  const snapshotComments = await getDocs(q);
  let allcomments: CommentProps[] = [];

  snapshotComments.forEach((doc) => {
    allcomments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      taskId: doc.data().taskId,
      name: doc.data().name,
    });
  });
  console.log(allcomments);

  const snapshot = await getDoc(docRef);
  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000;
  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    taskId: params?.id as string,
  };

  return {
    props: {
      item: task,
      allcomments: allcomments,
    },
  };
};
