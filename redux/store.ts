import { configureStore } from "@reduxjs/toolkit";
import quizReducer, { initializeScores } from "./slices/quizSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
  },
});

// Load scores from AsyncStorage
AsyncStorage.getItem("quizScores")
  .then((scores) => {
    if (scores) {
      store.dispatch(initializeScores(JSON.parse(scores)));
    } else {
      store.dispatch(initializeScores([]));
    }
  })
  .catch((error) => {
    console.error("Error loading quiz scores:", error);
    store.dispatch(initializeScores([]));
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
