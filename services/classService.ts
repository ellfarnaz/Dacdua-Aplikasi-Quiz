// classService.ts
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
  //   deleteDoc,
} from "firebase/firestore";
import { Class, User } from "../types";

export const createClass = async (
  classData: Omit<Class, "id" | "createdAt">
): Promise<Class> => {
  const docRef = await addDoc(collection(db, "classes"), {
    ...classData,
    createdAt: Date.now(),
    students: [],
  });
  return { id: docRef.id, ...classData, createdAt: Date.now(), students: [] };
};

export const getClasses = async (userId: string): Promise<Class[]> => {
  const q = query(collection(db, "classes"), where("teacherId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Class)
  );
};

export const joinClass = async (
  userId: string,
  classCode: string
): Promise<Class> => {
  const q = query(
    collection(db, "classes"),
    where("classCode", "==", classCode)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    throw new Error("Class not found");
  }
  const classDoc = querySnapshot.docs[0];
  const classData = classDoc.data() as Class;

  await updateDoc(doc(db, "classes", classDoc.id), {
    students: arrayUnion(userId),
  });

  const { id, ...classDataWithoutId } = classData;
  return {
    id: classDoc.id,
    ...classDataWithoutId,
    students: [...(classData.students || []), userId],
  };
};

export const getClassById = async (classId: string): Promise<Class | null> => {
  try {
    const docRef = doc(db, "classes", classId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const classData = { id: docSnap.id, ...docSnap.data() } as Class;

      // Fetch student data
      if (classData.students && classData.students.length > 0) {
        const studentsQuery = query(
          collection(db, "users"),
          where("uid", "in", classData.students)
        );
        const studentSnap = await getDocs(studentsQuery);
        const studentsData = studentSnap.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as User)
        );

        // Add student names to classData
        classData.studentsData = studentsData;
      }

      return classData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching class:", error);
    throw error;
  }
};
export const getClassesForStudent = async (
  userId: string
): Promise<Class[]> => {
  const q = query(
    collection(db, "classes"),
    where("students", "array-contains", userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Class)
  );
};

export const getClassesForDosen = async (userId: string): Promise<Class[]> => {
  const q = query(collection(db, "classes"), where("teacherId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Class)
  );
};
export const deleteClass = async (classId: string): Promise<void> => {
  const batch = writeBatch(db);

  // 1. Hapus data kelas
  const classRef = doc(db, "classes", classId);
  batch.delete(classRef);

  // 2. Hapus skor kuis terkait
  const scoresQuery = query(
    collection(db, "classScores"),
    where("classId", "==", classId)
  );
  const scoresSnapshot = await getDocs(scoresQuery);
  scoresSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // 3. Hapus pesan chat terkait
  const chatQuery = query(
    collection(db, "chatMessages"),
    where("classId", "==", classId)
  );
  const chatSnapshot = await getDocs(chatQuery);
  chatSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};
