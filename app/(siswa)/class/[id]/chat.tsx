import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  Animated,
  LayoutAnimation,
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

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<SerializableChatMessage>
);

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const MessageItem = memo(
  ({
    item,
    isOwnMessage,
  }: {
    item: SerializableChatMessage;
    isOwnMessage: boolean;
  }) => (
    <View
      style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}>
      <Text style={styles.userName}>Anonymous Chat</Text>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
    </View>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.isOwnMessage === nextProps.isOwnMessage
    );
  }
);

const ClassChat = memo(() => {
  const localParams = useLocalSearchParams<{ id: string }>();
  const globalParams = useGlobalSearchParams<{ id: string }>();
  const classId = localParams.id || globalParams.id;
  const user = useSelector((state: RootState) => selectUser(state));
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) =>
    selectMessages(state, classId || "")
  );
  const [newMessage, setNewMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollButtonOpacity = useRef(new Animated.Value(0)).current;
  const inputContainerHeight = useRef(new Animated.Value(40)).current;
  const scrollButtonTranslateY = useRef(new Animated.Value(0)).current;
  const [inputHeight, setInputHeight] = useState(10);

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
        (event) => {
          router.setParams({ hideTabBar: "true" });
          animateInputContainer(event.endCoordinates.height);
        }
      );
      const keyboardWillHideListener = Keyboard.addListener(
        "keyboardWillHide",
        () => {
          router.setParams({ hideTabBar: "false" });
          animateInputContainer(0);
        }
      );

      return () => {
        unsubscribe();
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
      };
    }
  }, [classId, user, dispatch, router]);

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const shouldShow = value > 100;
      setShowScrollButton(shouldShow);
      Animated.timing(scrollButtonOpacity, {
        toValue: shouldShow ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    return () => scrollY.removeListener(listener);
  }, [scrollY, scrollButtonOpacity]);

  const animateInputContainer = useCallback(
    (keyboardHeight: number) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.parallel([
        Animated.timing(inputContainerHeight, {
          toValue: Math.min(
            150,
            Math.max(60, inputHeight + 20 + keyboardHeight)
          ),
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(scrollButtonTranslateY, {
          toValue: -keyboardHeight,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [inputHeight, inputContainerHeight, scrollButtonTranslateY]
  );

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim() && user && classId) {
      const messageToSend = newMessage.trim();
      setNewMessage("");

      try {
        await sendMessage({
          classId,
          userId: user.id,
          userName: user.name,
          text: messageToSend,
        });

        const currentTimestamp = Date.now();
        dispatch(
          updateLastReadTimestamp({ classId, timestamp: currentTimestamp })
        );
        dispatch(setUnreadMessages({ classId, count: 0 }));
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
      }
    }
  }, [newMessage, user, classId, dispatch]);

  const renderMessage = useCallback(
    ({ item }: { item: SerializableChatMessage }) => (
      <MessageItem
        item={item}
        isOwnMessage={item.userId === user?.id}
      />
    ),
    [user]
  );

  const keyExtractor = useCallback(
    (item: SerializableChatMessage) => item.id || item.timestamp.toString(),
    []
  );

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 100,
      offset: 100 * index,
      index,
    }),
    []
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const handleScrollToBottom = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, []);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => b.timestamp - a.timestamp);
  }, [messages]);

  const updateInputContainerHeight = useCallback(
    (height: number) => {
      Animated.timing(inputContainerHeight, {
        toValue: Math.min(150, Math.max(40, height + 20)),
        duration: 100,
        useNativeDriver: false,
      }).start();
    },
    [inputContainerHeight]
  );

  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        <AnimatedFlatList
          ref={flatListRef}
          data={sortedMessages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.messagesContainer}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={20}
          windowSize={21}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          inverted
        />
        <Animated.View
          style={[styles.inputContainer, { height: inputContainerHeight }]}>
          <TextInput
            style={[
              styles.input,
              { height: Math.min(125, Math.max(10, inputHeight)) },
            ]}
            value={newMessage}
            onChangeText={setNewMessage}
            onContentSizeChange={(event) => {
              const height = event.nativeEvent.contentSize.height;
              setInputHeight(height);
              updateInputContainerHeight(height);
            }}
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
        </Animated.View>
        {showScrollButton && (
          <Animated.View
            style={[
              styles.scrollToBottomButton,
              {
                opacity: scrollButtonOpacity,
                transform: [{ translateY: scrollButtonTranslateY }],
              },
            ]}>
            <TouchableOpacity onPress={handleScrollToBottom}>
              <Ionicons
                name="arrow-down"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
});

export default ClassChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginRight: 10,
    maxHeight: 125,
    // minHeight: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollToBottomButton: {
    position: "absolute",
    right: 30,
    bottom: 120,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
