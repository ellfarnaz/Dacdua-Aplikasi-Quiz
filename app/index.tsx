import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { NavButton } from "../components/NavButton";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { clearScores } from "../redux/slices/quizSlice";

export default function Home() {
  const { colors } = useTheme();
  const [userData, setUserData] = useState({ name: "", institution: "" });
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    checkAndLoadUserData();
  }, []);

  const checkAndLoadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        setUserData(JSON.parse(data));
      } else {
        router.replace("/register");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      router.replace("/register");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Keluar", "Apakah Kamu Yakin Ingin Keluar", [
      {
        text: "Tidak",
        style: "cancel",
      },
      {
        text: "Keluar",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.removeItem("quizScores");
            dispatch(clearScores());
            router.replace("/register");
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  if (!userData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Ionicons
            name="person-circle-outline"
            size={140}
            color="white"
          />
        </View>
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileEmail}>{userData.institution}</Text>
      </View>
      <View style={styles.menuSection}>
        <Text style={[styles.menuTitle, { color: colors.text }]}>
          Materi Pembelajaran
        </Text>
        <Link
          href="./Materi/naratif-text"
          asChild>
          <NavButton
            title="Materi Teks Naratif"
            iconName="book-outline"
          />
        </Link>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}>
        <Ionicons
          name="log-out-outline"
          size={24}
          color="white"
        />
        <Text style={styles.logoutButtonText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: "#3498db",
  },
  profileImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#e6f2ff",
    marginBottom: 20,
  },
  menuSection: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
