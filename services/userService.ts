// userService.ts
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { User, QuizScore } from "../types";
export const getAllUsers = async (): Promise<User[]> => {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id } as User));
};
export const getAllStudentScores = async (): Promise<
  (QuizScore & Partial<User>)[]
> => {
  const scoresRef = collection(db, "quizScores");
  const snapshot = await getDocs(scoresRef);
  const scores = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as QuizScore)
  );

  // Fetch user data for each score
  const enhancedScores = await Promise.all(
    scores.map(async (score) => {
      const userDoc = await getDoc(doc(db, "users", score.userId));
      const userData = userDoc.data() as User;
      return {
        ...score,
        name: userData.name,
        email: userData.email,
        institution: userData.institution,
      };
    })
  );

  return enhancedScores;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as unknown as User;
  }
  return null;
};
export const getDosenUsers = async (): Promise<User[]> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("role", "==", "dosen"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id } as User));
};

export const getStudentUsers = async (): Promise<User[]> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("role", "==", "student"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id } as User));
};
