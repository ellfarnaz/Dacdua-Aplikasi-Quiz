import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SerializableChatMessage {
  id?: string;
  classId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  readBy: string[];
}

interface ChatState {
  unreadMessages: {
    [classId: string]: number;
  };
  lastReadTimestamp: {
    [classId: string]: number;
  };
  messages: {
    [classId: string]: SerializableChatMessage[];
  };
}

const initialState: ChatState = {
  unreadMessages: {},
  lastReadTimestamp: {},
  messages: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUnreadMessages: (
      state,
      action: PayloadAction<{ classId: string; count: number }>
    ) => {
      state.unreadMessages[action.payload.classId] = action.payload.count;
    },
    updateLastReadTimestamp: (
      state,
      action: PayloadAction<{ classId: string; timestamp: number }>
    ) => {
      state.lastReadTimestamp[action.payload.classId] =
        action.payload.timestamp;
    },
    clearUnreadMessages: (state, action: PayloadAction<string>) => {
      state.unreadMessages[action.payload] = 0;
    },
    setMessages: (
      state,
      action: PayloadAction<{
        classId: string;
        messages: SerializableChatMessage[];
      }>
    ) => {
      state.messages[action.payload.classId] = action.payload.messages;
    },
    markAllMessagesAsRead: (state, action: PayloadAction<string>) => {
      state.unreadMessages[action.payload] = 0;
      if (state.messages[action.payload]) {
        state.messages[action.payload] = state.messages[action.payload].map(
          (msg) => ({
            ...msg,
            readBy: [...new Set([...msg.readBy, action.payload])],
          })
        );
      }
      state.lastReadTimestamp[action.payload] = Date.now();
    },
    addNewMessage: (
      state,
      action: PayloadAction<{
        classId: string;
        message: SerializableChatMessage;
      }>
    ) => {
      const { classId, message } = action.payload;
      if (!state.messages[classId]) {
        state.messages[classId] = [];
      }
      state.messages[classId].unshift(message);
      if (message.timestamp > (state.lastReadTimestamp[classId] || 0)) {
        state.lastReadTimestamp[classId] = message.timestamp;
      }
    },
  },
});

export const {
  setUnreadMessages,
  updateLastReadTimestamp,
  clearUnreadMessages,
  setMessages,
  markAllMessagesAsRead,
  addNewMessage,
} = chatSlice.actions;

export const selectUnreadMessages = (state: RootState, classId: string) =>
  state.chat.unreadMessages[classId] || 0;
export const selectLastReadTimestamp = (state: RootState, classId: string) =>
  state.chat.lastReadTimestamp[classId] || 0;
export const selectMessages = createSelector(
  [
    (state: RootState) => state.chat.messages,
    (state: RootState, classId: string) => classId,
  ],
  (messages, classId) => messages[classId] || []
);
export const selectTotalUnreadMessages = (state: RootState) =>
  Object.values(state.chat.unreadMessages).reduce(
    (sum, count) => sum + count,
    0
  );

export default chatSlice.reducer;
