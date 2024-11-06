import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { NavButton } from "../../components/NavButton";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type MaterialItem = {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  route: {
    pathname: "/(materi)/naratif-text" | "/(materi)/expo-sisi";
    params?: Record<string, string>;
  };
};

const materiList: MaterialItem[] = [
  {
    title: "Teks Naratif",
    iconName: "book-outline",
    route: { pathname: "/(materi)/naratif-text" },
  },
  {
    title: "Teks Eksposisi",
    iconName: "document-text-outline",
    route: { pathname: "/(materi)/expo-sisi" },
  },
  // Tambahkan materi lain di sini
];

export default function Materi() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {materiList.map((materi, index) => (
          <NavButton
            key={index}
            title={materi.title}
            iconName={materi.iconName}
            onPress={() => router.push(materi.route)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
});
