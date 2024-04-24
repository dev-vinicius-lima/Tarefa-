// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCK2ldI-F_72cveBJwF4w3a4ZAGt4_HeWk",
  authDomain: "tarefasplus-9141c.firebaseapp.com",
  projectId: "tarefasplus-9141c",
  storageBucket: "tarefasplus-9141c.appspot.com",
  messagingSenderId: "606160525377",
  appId: "1:606160525377:web:3211c4a1603b5d8a5acec0",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db };
