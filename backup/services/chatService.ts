import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  getDocs,
  updateDoc,
  doc,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { store } from "../redux/store";
import {
  setUnreadMessages,
  updateLastReadTimestamp,
  setMessages,
} from "../redux/slices/chatSlice";
import { SerializableChatMessage } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkInternetConnection } from "../utils/networkUtils";

export interface ChatMessage {
  id?: string;
  classId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Timestamp;
  readBy: string[];
}

let activeSubscriptions: { [key: string]: () => void } = {};

export const sendMessage = async (
  message: Omit<ChatMessage, "id" | "timestamp" | "readBy">
) => {
  try {
    await addDoc(collection(db, "chatMessages"), {
      ...message,
      timestamp: Timestamp.now(),
      readBy: [message.userId],
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const subscribeToMessages = (
  classId: string,
  userId: string,
  callback: (messages: SerializableChatMessage[]) => void
) => {
  const q = query(
    collection(db, "chatMessages"),
    where("classId", "==", classId),
    orderBy("timestamp", "desc")
  );
  const unsubscribe = onSnapshot(
    q,
    async (querySnapshot) => {
      const messages: SerializableChatMessage[] = querySnapshot.docs.map(
        (doc) => {
          const data = doc.data() as ChatMessage;
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp.toMillis(),
          };
        }
      );

      // Save messages to local storage
      await saveMessagesToLocalStorage(classId, messages);

      store.dispatch(setMessages({ classId, messages }));

      const lastReadTimestamp =
        store.getState().chat.lastReadTimestamp[classId] || 0;
      const unreadCount = messages.filter(
        (msg) =>
          msg.timestamp > lastReadTimestamp && !msg.readBy.includes(userId)
      ).length;

      store.dispatch(setUnreadMessages({ classId, count: unreadCount }));

      callback(messages);
    },
    (error) => {
      //   console.error("Error in onSnapshot:", error);
      if (error.code === "permission-denied") {
        // console.log(
        //   "Permission denied, mungkin user sudah logout. Membersihkan subscription."
        // );
        unsubscribe();
        delete activeSubscriptions[classId];
      }
    }
  );

  activeSubscriptions[classId] = unsubscribe;
  return unsubscribe;
};

export const clearAllSubscriptions = async () => {
  //   console.log("Mulai membersihkan subscriptions");
  Object.values(activeSubscriptions).forEach((unsubscribe) => {
    unsubscribe();
  });
  activeSubscriptions = {};
  //   console.log("Semua subscriptions telah dibersihkan");
};

export const markMessagesAsRead = async (classId: string, userId: string) => {
  try {
    const q = query(
      collection(db, "chatMessages"),
      where("classId", "==", classId),
      where("readBy", "not-in", [[userId]])
    );

    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.docs.forEach((document) => {
      batch.update(doc(db, "chatMessages", document.id), {
        readBy: arrayUnion(userId),
      });
    });

    await batch.commit();

    const currentTimestamp = Date.now();
    store.dispatch(
      updateLastReadTimestamp({ classId, timestamp: currentTimestamp })
    );
    store.dispatch(setUnreadMessages({ classId, count: 0 }));
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};
export const subscribeToAllClassMessages = (userId: string) => {
  const classes = store.getState().class.classes;
  classes.forEach((classItem) => {
    if (!activeSubscriptions[classItem.id]) {
      subscribeToMessages(classItem.id, userId, () => {});
    }
  });
};

const saveMessagesToLocalStorage = async (
  classId: string,
  messages: SerializableChatMessage[]
) => {
  try {
    await AsyncStorage.setItem(
      `chat_messages_${classId}`,
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error("Error saving messages to local storage:", error);
  }
};

const loadMessagesFromLocalStorage = async (
  classId: string
): Promise<SerializableChatMessage[]> => {
  try {
    const messages = await AsyncStorage.getItem(`chat_messages_${classId}`);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error("Error loading messages from local storage:", error);
    return [];
  }
};

export const loadMessages = async (classId: string, userId: string) => {
  const isConnected = await checkInternetConnection();

  if (isConnected) {
    // If online, fetch from Firestore (this will update local storage via subscribeToMessages)
    subscribeToMessages(classId, userId, () => {});
  } else {
    // If offline, load from local storage
    const messages = await loadMessagesFromLocalStorage(classId);
    store.dispatch(setMessages({ classId, messages }));
  }
};
