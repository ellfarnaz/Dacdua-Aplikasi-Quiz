import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface QuizScore {
  materialName: string;
  quizName: string;
  score: number;
}

interface QuizState {
  scores: QuizScore[];
}

const initialState: QuizState = {
  scores: [],
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setScore: (state, action: PayloadAction<QuizScore>) => {
      if (!Array.isArray(state.scores)) {
        state.scores = [];
      }

      const index = state.scores.findIndex(
        (score) =>
          score.materialName === action.payload.materialName &&
          score.quizName === action.payload.quizName
      );
      if (index !== -1) {
        state.scores[index] = action.payload;
      } else {
        state.scores.push(action.payload);
      }
      AsyncStorage.setItem("quizScores", JSON.stringify(state.scores)).catch(
        (error) => {
          console.error("Error saving quiz scores:", error);
        }
      );
    },
    initializeScores: (state, action: PayloadAction<QuizScore[]>) => {
      state.scores = action.payload || [];
    },
    clearScores: (state) => {
      state.scores = [];
      AsyncStorage.removeItem("quizScores").catch((error) => {
        console.error("Error clearing quiz scores:", error);
      });
    },
  },
});

export const { setScore, initializeScores, clearScores } = quizSlice.actions;

export const selectQuizScores = (state: RootState) => state.quiz.scores || [];

export default quizSlice.reducer;
