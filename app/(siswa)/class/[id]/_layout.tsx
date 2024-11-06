import React, { useState, useEffect } from "react";
import {
  Tabs,
  usePathname,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUnreadMessages,
  setUnreadMessages,
  updateLastReadTimestamp,
  selectMessages,
} from "../../../../redux/slices/chatSlice";
import { RootState, AppDispatch } from "../../../../redux/store";
import { Keyboard, Platform, View, Text, StyleSheet } from "react-native";
import { getClassById } from "../../../../services/classService";

export default function ClassTabLayout() {
  const { id: classId } = useLocalSearchParams<{ id: string }>();
  const [className, setClassName] = useState<string | null>(null);
  const unreadMessages = useSelector((state: RootState) =>
    selectUnreadMessages(state, classId || "")
  );
  const messages = useSelector((state: RootState) =>
    selectMessages(state, classId || "")
  );
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [lastReadTimestamp, setLastReadTimestamp] = useState(Date.now());
  const navigation = useNavigation();

  useEffect(() => {
    if (classId) {
      fetchClassName(classId);
    }
  }, [classId]);

  const fetchClassName = async (classId: string) => {
    try {
      const classData = await getClassById(classId);
      if (classData) {
        setClassName(classData.name);
      }
    } catch (error) {
      console.error("Error fetching class name:", error);
    }
  };

  useEffect(() => {
    if (className) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{className}</Text>
          </View>
        ),
      });
    }
  }, [className, navigation]);

  useEffect(() => {
    const newActiveTab = pathname.split("/").pop() || "";
    setActiveTab(newActiveTab);

    if (newActiveTab === "chat" && classId) {
      markAllMessagesAsRead();
    }
  }, [pathname, classId]);

  useEffect(() => {
    if (activeTab === "chat" && messages.length > 0) {
      markAllMessagesAsRead();
    }
  }, [messages, activeTab]);

  const markAllMessagesAsRead = () => {
    const currentTimestamp = Date.now();
    dispatch(updateLastReadTimestamp({ classId, timestamp: currentTimestamp }));
    dispatch(setUnreadMessages({ classId, count: 0 }));
    setLastReadTimestamp(currentTimestamp);
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const shouldShowBadge = (tabName: string) => {
    if (tabName !== "chat") {
      return false;
    }
    return unreadMessages > 0 && activeTab !== "chat";
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4a90e2",
        tabBarIconStyle: {
          marginBottom: -3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 15,
        },
        tabBarStyle: isKeyboardVisible
          ? { display: "none" }
          : {
              paddingBottom: 5,
              height: 80,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Materi",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="book-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Anonymous Chat",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubbles-outline"
              size={size}
              color={color}
            />
          ),
          tabBarBadge: shouldShowBadge("chat") ? unreadMessages : undefined,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="trophy-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {},
});
