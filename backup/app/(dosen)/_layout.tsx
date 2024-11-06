import React from "react";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { Redirect } from "expo-router";

export default function DosenLayout() {
  const user = useSelector(selectUser);

  if (!user || user.role !== "dosen") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Dashboard Dosen",
        }}
      />
      <Stack.Screen
        name="student-scores"
        options={{
          headerShown: true,
          title: "Student Scores",
        }}
      />
      <Stack.Screen
        name="class/[id]"
        options={{
          title: "Kelas",
          headerShown: true,
          headerBackTitle: "Back",
          // Judul akan diatur secara dinamis di _layout.tsx kelas
        }}
      />
      <Stack.Screen
        name="create-class"
        options={{
          headerShown: true,
          title: "Create Class",
        }}
      />
    </Stack>
  );
}
