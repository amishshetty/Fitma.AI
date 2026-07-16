import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCyOYXriTx0ivDVjtBaHiesPArYz_1NOMU",
  authDomain: "fitma-ai.firebaseapp.com",
  databaseURL: "https://fitma-ai-default-rtdb.firebaseio.com",
  projectId: "fitma-ai",
  storageBucket: "fitma-ai.firebasestorage.app",
  messagingSenderId: "133103230543",
  appId: "1:133103230543:web:e4d2360d7d015161b6143a",
  measurementId: "G-2VR7YC6KZ6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
