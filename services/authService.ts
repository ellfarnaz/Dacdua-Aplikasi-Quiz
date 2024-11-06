// authService.ts
import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { User } from "../types";
import {
  getAuth,
  createUserWithEmailAndPassword as createUser,
} from "firebase/auth";

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  institution: string,
  role: "student" | "dosen" | "admin"
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const userData: User = {
    id: user.uid, // Menggunakan 'id' alih-alih 'uid'
    uid: user.uid, // Tetap menyimpan 'uid' untuk kompatibilitas
    email: user.email!,
    name,
    institution,
    role,
  };

  await setDoc(doc(db, "users", user.uid), userData);

  return userData;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.data() as User;

  // Memastikan bahwa 'id' selalu ada
  return {
    ...userData,
    id: user.uid,
  };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const createDosenAccount = async (
  email: string,
  password: string,
  name: string,
  institution: string
): Promise<void> => {
  const secondaryAuth = getAuth();

  const userCredential = await createUser(secondaryAuth, email, password);
  const user = userCredential.user;

  const userData: User = {
    id: user.uid, // Menggunakan 'id' alih-alih 'uid'
    uid: user.uid, // Tetap menyimpan 'uid' untuk kompatibilitas
    email: user.email!,
    name,
    institution,
    role: "dosen",
  };

  await setDoc(doc(db, "users", user.uid), userData);
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
