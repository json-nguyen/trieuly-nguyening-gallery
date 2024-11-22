import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbx1K74RbcoZZwG_HJbdPTagNr90Xoelk",
  authDomain: "trieuly-nguyening-gallery.firebaseapp.com",
  projectId: "trieuly-nguyening-gallery",
  storageBucket: "trieuly-nguyening-gallery.firebasestorage.app",
  messagingSenderId: "457588377383",
  appId: "1:457588377383:web:9559e3afd340ce886c0b02",
  measurementId: "G-113TDJEYWC"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

const auth = getAuth();

const signIn = async () => {
  const email = "j.nguyen.ce28@gmail.com"; // 
  const password = "Hailey"; // 

  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in successfully!");
    // Now proceed with the file upload
  } catch (error) {
    console.error("Authentication failed:", error.message);
  }
};

signIn();