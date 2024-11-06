import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
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
  // {
  //   title: "Teks Eksposisi",
  //   iconName: "document-text-outline",
  //   route: { pathname: "/(materi)/expo-sisi" },
  // },
  // Tambahkan materi lain di sini
];

export default function Materi() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {materiList.map((materi, index) => (
          <NavButton
            key={index}
            title={materi.title}
            iconName={materi.iconName}
            onPress={() => router.push(materi.route)}
            // style={styles.navButton}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#E6F3FF", // Light blue background
    },
    content: {
      padding: width * 0.05,
      paddingBottom: height * 0.05, // Extra bottom padding for better scrolling
    },
    navButton: {
      backgroundColor: "#4DA8FF", // Consistent blue theme for buttons
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: height * 0.02, // Space between buttons
      elevation: 3, // Shadow for button depth
      shadowColor: "#4DA8FF",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    buttonText: {
      color: "#fff", // White text for contrast
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 15,
    },
    icon: {
      color: "#fff", // White icon to match the text
      fontSize: 24,
    },
  });
