// components/DosenLayout.tsx

import React from "react";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { Redirect } from "expo-router";
import { StyleSheet } from "react-native";

export default function DosenLayout() {
  const user = useSelector(selectUser);

  if (!user || user.role !== "dosen") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: "#fff", // Consistent white text
      }}>
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
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <Stack.Screen
        name="class/[id]"
        options={{
          title: "Kelas",
          headerShown: true,
          headerBackTitle: "Back",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          // Judul akan diatur secara dinamis di _layout.tsx kelas
        }}
      />
      <Stack.Screen
        name="create-class"
        options={{
          headerShown: true,
          title: "Create Class",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4DA8FF", // Warna header biru
  },
  headerTitle: {
    color: "#fff", // Warna teks putih
    fontWeight: "bold",
    fontSize: 20,
  },
});
