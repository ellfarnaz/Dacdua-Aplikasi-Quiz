// firebaseService.ts

import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { QuizScore } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkInternetConnection } from "../utils/networkUtils";

export const saveQuizScore = async (
  materialName: string,
  quizName: string,
  score: number,
  userId: string,
  userName: string,
  userEmail: string,
  userInstitution: string,
  classId?: string
): Promise<{ success: boolean; offlineSaved: boolean; id: string }> => {
  try {
    const isConnected = await checkInternetConnection();

    const scoreData: Omit<QuizScore, "id" | "timestamp" | "synced"> = {
      materialName,
      quizName,
      score,
      userId,
      userName,
      userEmail,
      userInstitution,
    };

    if (classId) {
      scoreData.classId = classId;
    }

    if (!isConnected) {
      const unsyncedScores = await AsyncStorage.getItem("unsyncedScores");
      const scores = unsyncedScores ? JSON.parse(unsyncedScores) : [];
      const existingScoreIndex = scores.findIndex(
        (s: QuizScore) =>
          s.userId === userId &&
          s.quizName === quizName &&
          s.classId === classId
      );

      if (existingScoreIndex !== -1) {
        scores[existingScoreIndex] = {
          ...scores[existingScoreIndex],
          ...scoreData,
          timestamp: Date.now(),
        };
      } else {
        const newId = `${userId}_${quizName}_${classId || "general"}`;
        scores.push({
          ...scoreData,
          id: newId,
          timestamp: Date.now(),
          synced: false,
        });
      }

      await AsyncStorage.setItem("unsyncedScores", JSON.stringify(scores));
      return {
        success: true,
        offlineSaved: true,
        id: scores[
          existingScoreIndex !== -1 ? existingScoreIndex : scores.length - 1
        ].id,
      };
    }

    const collectionName = classId ? "classScores" : "quizScores";
    const q = query(
      collection(db, collectionName),
      where("userId", "==", userId),
      where("quizName", "==", quizName),
      where("classId", "==", classId || null)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = doc(db, collectionName, querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        ...scoreData,
        timestamp: serverTimestamp(),
      });
      return { success: true, offlineSaved: false, id: docRef.id };
    } else {
      const newId = `${userId}_${quizName}_${classId || "general"}`;
      const docRef = doc(db, collectionName, newId);
      await setDoc(docRef, {
        ...scoreData,
        timestamp: serverTimestamp(),
      });
      return { success: true, offlineSaved: false, id: newId };
    }
  } catch (error) {
    console.error("Error saving quiz score:", error);
    return { success: false, offlineSaved: false, id: "" };
  }
};

export const getQuizScores = async (
  isClassScore: boolean = false,
  materialName?: string,
  quizName?: string,
  classId?: string,
  userId?: string
): Promise<QuizScore[]> => {
  try {
    const collectionName = isClassScore ? "classScores" : "quizScores";
    let q = query(collection(db, collectionName));

    if (userId) {
      q = query(q, where("userId", "==", userId));
    }
    if (materialName) {
      q = query(q, where("materialName", "==", materialName));
    }
    if (quizName) {
      q = query(q, where("quizName", "==", quizName));
    }
    if (classId) {
      q = query(q, where("classId", "==", classId));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        timestamp:
          data.timestamp instanceof Timestamp
            ? data.timestamp.toMillis()
            : Date.now(),
      } as QuizScore;
    });
  } catch (error) {
    console.error("Error fetching quiz scores:", error);
    throw error;
  }
};

export const syncLocalScoresToFirestore = async (): Promise<void> => {
  try {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      console.log("No internet connection, skipping sync");
      return;
    }

    const unsyncedScores = await AsyncStorage.getItem("unsyncedScores");
    if (!unsyncedScores) {
      console.log("No local scores to sync");
      return;
    }

    const scores: QuizScore[] = JSON.parse(unsyncedScores);
    for (const score of scores) {
      if (!score.synced) {
        await saveQuizScore(
          score.materialName,
          score.quizName,
          score.score,
          score.userId,
          score.userName,
          score.userEmail,
          score.userInstitution,
          score.classId
        );
        score.synced = true;
      }
    }

    await AsyncStorage.setItem("unsyncedScores", JSON.stringify(scores));

    console.log("Local scores synced to Firestore");
  } catch (error) {
    console.error("Error syncing local scores to Firestore:", error);
  }
};
