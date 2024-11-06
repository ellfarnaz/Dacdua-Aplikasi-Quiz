import React from "react";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { Redirect } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function MateriLayout() {
  const user = useSelector(selectUser);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen
          name="naratif-text"
          options={{
            headerTitle: "Teks Naratif",
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            headerShown: true,
            headerBackTitleVisible: true,
            headerBackTitle: "Kembali",
            headerTintColor: "#fff", // Consistent white text
          }}
        />
        <Stack.Screen
          name="expo-sisi"
          options={{
            headerTitle: "Teks Eksposisi",
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            headerTintColor: "#fff", // Consistent white text
          }}
        />
        {/* Add additional screens as per your material */}
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F3FF", // Consistent background color
  },
  header: {
    backgroundColor: "#4DA8FF", // Consistent blue for headers
    elevation: 3, // Adding slight shadow to the header
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerTitle: {
    color: "#fff", // White text for readability
    fontWeight: "bold",
    fontSize: 20, // Consistent font size for headers
  },
});
