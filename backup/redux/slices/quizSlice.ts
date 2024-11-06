import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { saveQuizScore, getQuizScores } from "../../services/firebaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkInternetConnection } from "../../utils/networkUtils";
import { QuizScore } from "../../types";
import { getStudentUsers } from "../../services/userService";

interface QuizState {
  generalScores: QuizScore[];
  classScores: QuizScore[];
  leaderboard: LeaderboardEntry[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  leaderboardLoading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  leaderboardError: string | null;
}
export interface LeaderboardEntry extends QuizScore {
  quizCount: number;
  totalScore: number;
}
const initialState: QuizState = {
  generalScores: [],
  classScores: [],
  leaderboard: [],
  loading: "idle",
  leaderboardLoading: "idle",
  error: null,
  leaderboardError: null,
};

export const setScoreAsync = createAsyncThunk<
  QuizScore,
  Omit<QuizScore, "id" | "timestamp" | "synced">,
  { state: RootState; rejectValue: string }
>("quiz/setScoreAsync", async (scoreData, { rejectWithValue }) => {
  if (scoreData.score < 0 || scoreData.score > 100) {
    return rejectWithValue("Invalid score");
  }
  try {
    const { success, offlineSaved, id } = await saveQuizScore(
      scoreData.materialName,
      scoreData.quizName,
      scoreData.score,
      scoreData.userId,
      scoreData.userName,
      scoreData.userEmail,
      scoreData.userInstitution,
      scoreData.classId
    );
    if (success) {
      const newScore: QuizScore = {
        id,
        ...scoreData,
        timestamp: Date.now(),
        synced: !offlineSaved,
      };
      return newScore;
    } else {
      return rejectWithValue("Failed to save score");
    }
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
});

export const syncOfflineScores = createAsyncThunk<
  QuizScore[],
  void,
  { state: RootState; rejectValue: string }
>("quiz/syncOfflineScores", async (_, { getState, rejectWithValue }) => {
  try {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      return rejectWithValue("No internet connection");
    }

    const state = getState() as RootState;
    const userId = state.auth.user?.id;

    if (!userId) {
      return rejectWithValue("User not authenticated");
    }

    const unsyncedScores = await AsyncStorage.getItem("unsyncedScores");
    if (!unsyncedScores) {
      return [];
    }

    const scores = JSON.parse(unsyncedScores);
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

    // Ubah pemanggilan getQuizScores di sini
    return await getQuizScores(false, undefined, undefined, undefined, userId);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to sync scores"
    );
  }
});

export const fetchScoresAsync = createAsyncThunk<
  { generalScores: QuizScore[]; classScores: QuizScore[] },
  void,
  { state: RootState; rejectValue: string }
>("quiz/fetchScoresAsync", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const userId = state.auth.user?.id;
    if (!userId) {
      return rejectWithValue("User not authenticated");
    }
    const generalScores = await getQuizScores(
      false,
      undefined,
      undefined,
      undefined,
      userId
    );
    const classScores = await getQuizScores(
      true,
      undefined,
      undefined,
      undefined,
      userId
    );
    await AsyncStorage.setItem("generalScores", JSON.stringify(generalScores));
    await AsyncStorage.setItem("classScores", JSON.stringify(classScores));
    return { generalScores, classScores };
  } catch (error) {
    const storedGeneralScores = await AsyncStorage.getItem("generalScores");
    const storedClassScores = await AsyncStorage.getItem("classScores");
    if (storedGeneralScores && storedClassScores) {
      return {
        generalScores: JSON.parse(storedGeneralScores),
        classScores: JSON.parse(storedClassScores),
      };
    }
    return rejectWithValue(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
});

export const fetchClassLeaderboard = createAsyncThunk<
  LeaderboardEntry[],
  { materialName: string; classId: string },
  { state: RootState; rejectValue: string }
>(
  "quiz/fetchClassLeaderboard",
  async ({ materialName, classId }, { rejectWithValue }) => {
    try {
      const scores = await getQuizScores(
        true,
        materialName,
        undefined,
        classId
      );

      // Gabungkan skor untuk setiap pengguna
      const userScores = scores.reduce((acc, score) => {
        if (!acc[score.userId]) {
          acc[score.userId] = {
            ...score,
            quizCount: 1,
            totalScore: score.score,
          };
        } else {
          acc[score.userId].quizCount += 1;
          acc[score.userId].totalScore += score.score;
          // Update timestamp jika skor ini lebih baru
          if (score.timestamp > acc[score.userId].timestamp) {
            acc[score.userId].timestamp = score.timestamp;
          }
        }
        return acc;
      }, {} as Record<string, LeaderboardEntry>);

      // Hitung rata-rata skor dan urutkan
      const leaderboard = Object.values(userScores)
        .map((userScore) => ({
          ...userScore,
          score: userScore.totalScore / userScore.quizCount,
        }))
        .sort((a, b) => b.score - a.score);

      return leaderboard;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch class leaderboard"
      );
    }
  }
);

export const fetchGeneralLeaderboard = createAsyncThunk<
  LeaderboardEntry[],
  void,
  { state: RootState; rejectValue: string }
>("quiz/fetchGeneralLeaderboard", async (_, { rejectWithValue }) => {
  try {
    const scores = await getQuizScores(false); // false for general scores
    const allStudents = await getStudentUsers(); // Ambil semua siswa

    const userScores: Record<string, LeaderboardEntry> = {};

    // Inisialisasi skor untuk semua siswa
    allStudents.forEach((student) => {
      userScores[student.id] = {
        id: student.id,
        userId: student.id,
        userName: student.name,
        userEmail: student.email,
        userInstitution: student.institution,
        quizCount: 0,
        totalScore: 0,
        score: 0,
        timestamp: 0,
        materialName: "", // or any default value
        quizName: "", // or any default value
      };
    });

    // Proses skor quiz yang ada
    scores.forEach((score) => {
      if (!userScores[score.userId]) {
        userScores[score.userId] = {
          ...score,
          quizCount: 1,
          totalScore: score.score,
          score: score.score,
        };
      } else {
        userScores[score.userId].quizCount += 1;
        userScores[score.userId].totalScore += score.score;
        userScores[score.userId].score =
          userScores[score.userId].totalScore /
          userScores[score.userId].quizCount;
        if (score.timestamp > userScores[score.userId].timestamp) {
          userScores[score.userId].timestamp = score.timestamp;
        }
      }
    });

    const leaderboard = Object.values(userScores).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.quizCount !== a.quizCount) return b.quizCount - a.quizCount;
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return a.timestamp - b.timestamp;
    });

    return leaderboard;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Failed to fetch general leaderboard"
    );
  }
});

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    clearScores: (state) => {
      state.generalScores = [];
      state.classScores = [];
    },
    clearLeaderboard: (state) => {
      state.leaderboard = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setScoreAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(setScoreAsync.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const scores = action.payload.classId
          ? state.classScores
          : state.generalScores;
        const index = scores.findIndex(
          (score) =>
            score.userId === action.payload.userId &&
            score.quizName === action.payload.quizName &&
            score.classId === action.payload.classId
        );
        if (index !== -1) {
          scores[index] = action.payload;
        } else {
          scores.push(action.payload);
        }
      })
      .addCase(setScoreAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload ?? "An unknown error occurred";
      })
      .addCase(fetchScoresAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchScoresAsync.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.generalScores = action.payload.generalScores;
        state.classScores = action.payload.classScores;
      })
      .addCase(fetchScoresAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload ?? "An unknown error occurred";
      })
      .addCase(syncOfflineScores.fulfilled, (state, action) => {
        if (action.payload) {
          state.generalScores = action.payload.filter(
            (score) => !score.classId
          );
          state.classScores = action.payload.filter((score) => score.classId);
        }
      })
      .addCase(fetchClassLeaderboard.pending, (state) => {
        state.leaderboardLoading = "pending";
      })
      .addCase(
        fetchClassLeaderboard.fulfilled,
        (state, action: PayloadAction<LeaderboardEntry[]>) => {
          state.leaderboardLoading = "succeeded";
          state.leaderboard = action.payload;
          state.leaderboardError = null;
        }
      )
      .addCase(fetchClassLeaderboard.rejected, (state, action) => {
        state.leaderboardLoading = "failed";
        state.leaderboardError = action.payload ?? "An unknown error occurred";
      })
      .addCase(fetchGeneralLeaderboard.pending, (state) => {
        state.leaderboardLoading = "pending";
      })
      .addCase(
        fetchGeneralLeaderboard.fulfilled,
        (state, action: PayloadAction<LeaderboardEntry[]>) => {
          state.leaderboardLoading = "succeeded";
          state.leaderboard = action.payload;
          state.leaderboardError = null;
        }
      )
      .addCase(fetchGeneralLeaderboard.rejected, (state, action) => {
        state.leaderboardLoading = "failed";
        state.leaderboardError = action.payload ?? "An unknown error occurred";
      });
  },
});

export const { clearScores, clearLeaderboard } = quizSlice.actions;

export const selectGeneralQuizScores = (state: RootState) =>
  state.quiz.generalScores;
export const selectClassQuizScores = (state: RootState) =>
  state.quiz.classScores;
export const selectQuizLoading = (state: RootState) => state.quiz.loading;
export const selectQuizError = (state: RootState) => state.quiz.error;
export const selectLeaderboard = (state: RootState): LeaderboardEntry[] =>
  state.quiz.leaderboard;
export const selectLeaderboardLoading = (state: RootState) =>
  state.quiz.leaderboardLoading;
export const selectLeaderboardError = (state: RootState) =>
  state.quiz.leaderboardError;

export default quizSlice.reducer;
