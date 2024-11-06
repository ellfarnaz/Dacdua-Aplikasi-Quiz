// Description: This file is the admin dashboard screen of the application.
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, selectUser } from "../../redux/slices/authSlice";
import { clearScores } from "../../redux/slices/quizSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleManageUsers = () => {
    router.push("/(admin)/user-list");
  };

  const handleCreateDosen = () => {
    router.push("/(admin)/create-dosen");
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
            await signOut(auth);
            dispatch(clearUser());
            dispatch(clearScores());
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  if (!user) {
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
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
        <Text style={styles.profileInstitution}>{user.institution}</Text>
      </View>
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Admin Dashboard</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleManageUsers}>
          <Text style={styles.buttonText}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateDosen}>
          <Text style={styles.buttonText}>Create Dosen Account</Text>
        </TouchableOpacity>
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
    marginBottom: 5,
  },
  profileInstitution: {
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
  button: {
    backgroundColor: "#4DA8FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
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
