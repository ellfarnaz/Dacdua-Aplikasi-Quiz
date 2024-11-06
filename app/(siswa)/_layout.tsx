// components/SiswaLayout.tsx

import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { Redirect } from "expo-router";
import { getClassById } from "../../services/classService";
import { Class } from "../../types";
import { selectTotalUnreadMessages } from "../../redux/slices/chatSlice";
import { ActivityIndicator, Text, View, StyleSheet } from "react-native";

export default function SiswaLayout() {
  const user = useSelector(selectUser);
  const [className, setClassName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams<{ id: string }>();
  const totalUnreadMessages = useSelector(selectTotalUnreadMessages);

  useEffect(() => {
    if (id) {
      fetchClassName(id);
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const fetchClassName = async (classId: string) => {
    try {
      const classData = await getClassById(classId);
      if (classData) {
        setClassName(classData.name);
      }
    } catch (error) {
      console.error("Error fetching class name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== "student") {
    return <Redirect href="/(auth)/login" />;
  }

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#4DA8FF"
        />
        <Text style={styles.loadingText}>Memuat data kelas...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: "#fff", // Consistent white text
      }}>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="quiz"
        options={({ route }: { route: any }) => ({
          title: route.params?.quizName
            ? `Quiz ${decodeURIComponent(route.params.quizName)}`
            : "Quiz",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => null,
          gestureEnabled: false,
          headerBackVisible: false,
        })}
      />
      <Stack.Screen
        name="class/[id]"
        options={{
          title: className ? `Kelas ${className}` : "Kelas",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerBackTitle: "Kembali",
        }}
      />
      <Stack.Screen
        name="leaderboardGeneral"
        options={{
          title: "Papan Peringkat",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerBackTitle: "Kembali",
        }}
      />
      <Stack.Screen
        name="materi"
        options={{
          title: "Materi",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerBackTitle: "Kembali",
        }}
      />
      <Stack.Screen
        name="finalquiz"
        options={{
          title: "Quiz Final",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerBackTitle: "Kembali",
        }}
      />
      <Stack.Screen
        name="tujuan"
        options={{
          title: "Tujuan Pembelajaran",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerBackTitle: "Kembali",
        }}
      />
      <Stack.Screen
        name="join-class"
        options={{
          title: "Bergabung dengan Kelas",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerBackTitle: "Kembali",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F3FF", // Background biru muda
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#4DA8FF", // Warna teks biru
  },
  header: {
    backgroundColor: "#4DA8FF", // Warna header biru
  },
  headerTitle: {
    color: "#fff", // Warna teks putih
    fontWeight: "bold",
    fontSize: 20,
  },
});
