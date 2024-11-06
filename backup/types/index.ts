export interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
  institution: string;
  role: "student" | "dosen" | "admin";
}

export interface QuizScore {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userInstitution: string;
  materialName: string;
  quizName: string;
  score: number;
  timestamp: number;
  synced?: boolean;
  classId?: string;
}

export interface Class {
  id: string;
  name: string;
  material: string;
  teacherId: string;
  teacherName: string;
  classCode: string;
  createdAt: number;
  materialId: string;
  students?: string[];
  studentsData?: User[]; // Tambahkan ini
  // Array of student IDs
}
export interface SerializableChatMessage {
  id?: string;
  classId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  readBy: string[];
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userInstitution: string;
  totalScore: number;
  quizScores: {
    [quizName: string]: number;
  };
  lastUpdated: number;
}
