import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { Redirect } from "expo-router";
import { getClassById } from "../../services/classService";
import { Class } from "../../types";
import { selectTotalUnreadMessages } from "../../redux/slices/chatSlice";

export default function SiswaLayout() {
  const user = useSelector(selectUser);
  const [className, setClassName] = useState<string | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const totalUnreadMessages = useSelector(selectTotalUnreadMessages);

  useEffect(() => {
    if (id) {
      fetchClassName(id);
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
    }
  };

  if (!user || user.role !== "student") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
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
          headerLeft: () => null,
          gestureEnabled: false,
          headerBackVisible: false,
        })}
      />
      <Stack.Screen
        name="class/[id]"
        options={{
          title: "Kelas",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="leaderboardGeneral"
        options={{
          title: "Leaderboard",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="materi"
        options={{
          title: "Materi",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="finalquiz"
        options={{
          title: "Final Quiz",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="tujuan"
        options={{
          title: "Tujuan Pembelajaran",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
