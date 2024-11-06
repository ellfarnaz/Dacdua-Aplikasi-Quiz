import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./slices/quizSlice";
import authReducer from "./slices/authSlice";
import classReducer from "./slices/classSlice";
import chatReducer from "./slices/chatSlice";
import networkReducer from "./slices/networkSlice";

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    auth: authReducer,
    class: classReducer,
    chat: chatReducer,
    network: networkReducer, // Add this line
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
