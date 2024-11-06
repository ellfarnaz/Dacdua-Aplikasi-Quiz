// app/(dosen)/class/[id]/chat.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import {
  useLocalSearchParams,
  useGlobalSearchParams,
  useRouter,
} from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../../../redux/slices/authSlice";
import {
  sendMessage,
  markMessagesAsRead,
  loadMessages,
} from "../../../../services/chatService";
import { Ionicons } from "@expo/vector-icons";
import { AppDispatch, RootState } from "../../../../redux/store";
import {
  updateLastReadTimestamp,
  setUnreadMessages,
  selectMessages,
} from "../../../../redux/slices/chatSlice";
import { SerializableChatMessage } from "../../../../types";
import NetInfo from "@react-native-community/netinfo";

export default function ClassChat() {
  const localParams = useLocalSearchParams<{ id: string }>();
  const globalParams = useGlobalSearchParams<{ id: string }>();
  const classId = localParams.id || globalParams.id;
  const user = useSelector((state: RootState) => selectUser(state));
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) =>
    selectMessages(state, classId || "")
  );
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  useEffect(() => {
    if (classId && user) {
      loadMessages(classId, user.id);
      markMessagesAsRead(classId, user.id);

      const currentTimestamp = Date.now();
      dispatch(
        updateLastReadTimestamp({ classId, timestamp: currentTimestamp })
      );
      dispatch(setUnreadMessages({ classId, count: 0 }));

      const unsubscribe = NetInfo.addEventListener((state) => {
        if (state.isConnected) {
          loadMessages(classId, user.id);
        }
      });

      const keyboardWillShowListener = Keyboard.addListener(
        "keyboardWillShow",
        () => {
          router.setParams({ hideTabBar: "true" });
        }
      );
      const keyboardWillHideListener = Keyboard.addListener(
        "keyboardWillHide",
        () => {
          router.setParams({ hideTabBar: "false" });
        }
      );

      return () => {
        unsubscribe();
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
      };
    }
  }, [classId, user, dispatch, router]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user && classId) {
      try {
        await sendMessage({
          classId,
          userId: user.id,
          userName: user.name,
          text: newMessage.trim(),
        });
        setNewMessage("");

        const currentTimestamp = Date.now();
        dispatch(
          updateLastReadTimestamp({ classId, timestamp: currentTimestamp })
        );
        dispatch(setUnreadMessages({ classId, count: 0 }));

        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const renderMessage = ({ item }: { item: SerializableChatMessage }) => (
    <View
      style={[
        styles.messageContainer,
        item.userId === user?.id ? styles.ownMessage : styles.otherMessage,
      ]}>
      <Text style={styles.userName}>{item.userName}</Text>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
      {user?.role === "dosen" && (
        <TouchableOpacity style={styles.deleteButton}>
          <Ionicons
            name="trash-outline"
            size={20}
            color="red"
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id!}
          inverted
          contentContainerStyle={styles.messagesContainer}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}>
            <Ionicons
              name="send"
              size={24}
              color="#007AFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ... styles remain the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
  },
  chatContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  messagesContainer: {
    paddingVertical: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  ownMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
