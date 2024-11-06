import React from "react";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { Redirect } from "expo-router";

export default function MateriLayout() {
  const user = useSelector(selectUser);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="naratif-text"
        options={{
          headerTitle: "Teks Naratif",
        }}
      />
      <Stack.Screen
        name="expo-sisi"
        options={{
          headerTitle: "Teks Eksposisi",
        }}
      />
      {/* Tambahkan screen lain sesuai dengan materi yang Anda miliki */}
    </Stack>
  );
}
