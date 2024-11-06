// components/DosenDashboard.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, selectUser } from "../../redux/slices/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { getClasses, deleteClass } from "../../services/classService";
import { Class } from "../../types";
import { setClasses, selectClasses } from "../../redux/slices/classSlice";
import { AppDispatch, RootState } from "../../redux/store";

export default function DosenDashboard() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const classes = useSelector(selectClasses);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClasses();
    }
  }, [user]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      if (user && user.id) {
        const fetchedClasses = await getClasses(user.id);
        dispatch(setClasses(fetchedClasses));
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
  };

  const handleCreateClass = () => {
    router.push("/create-class");
  };

  const handleViewScores = () => {
    router.push("/student-scores");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleClassPress = (classId: string) => {
    router.push(`/class/${classId}`);
  };

  const handleDeleteClass = (classId: string, className: string) => {
    Alert.alert(
      "Hapus Kelas",
      `Apakah Anda yakin ingin menghapus kelas "${className}"? Semua data terkait kelas ini akan dihapus.`,
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteClass(classId);
              fetchClasses();
            } catch (error) {
              console.error("Error deleting class:", error);
              Alert.alert("Error", "Gagal menghapus kelas. Silakan coba lagi.");
            }
          },
        },
      ]
    );
  };

  const renderClassItem = ({ item }: { item: Class }) => (
    <View style={styles.classItem}>
      <TouchableOpacity
        onPress={() => handleClassPress(item.id)}
        style={styles.classContent}>
        <Text style={styles.className}>{item.name}</Text>
        <Text style={styles.classMaterial}>{item.material}</Text>
        <Text style={styles.classCode}>Kode Kelas: {item.classCode}</Text>
        <Text style={styles.studentCount}>
          Jumlah Siswa: {item.students?.length || 0}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteClass(item.id, item.name)}>
        <Ionicons
          name="trash-outline"
          size={24}
          color="#FF6B6B"
        />
      </TouchableOpacity>
    </View>
  );

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4DA8FF"]}
          />
        }>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard Dosen</Text>
          <Text style={styles.subtitle}>{user.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateClass}>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color="#4DA8FF"
            />
            <Text style={styles.buttonText}>Buat Kelas Baru</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleViewScores}>
            <Ionicons
              name="list-outline"
              size={24}
              color="#4DA8FF"
            />
            <Text style={styles.buttonText}>Lihat Nilai Siswa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.classesContainer}>
          <Text style={styles.classesTitle}>Kelas Anda</Text>
          {loading ? (
            <Text style={styles.loadingText}>Memuat kelas...</Text>
          ) : classes.length > 0 ? (
            <FlatList
              data={classes}
              renderItem={renderClassItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>
              Anda belum membuat kelas apapun.
            </Text>
          )}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F3FF",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#4DA8FF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    flex: 0.48,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#4DA8FF",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  classesContainer: {
    padding: 20,
  },
  classesTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4DA8FF",
  },
  classItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  classContent: {
    flex: 1,
    padding: 20,
  },
  className: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  classMaterial: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  classCode: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  studentCount: {
    fontSize: 14,
    color: "#4DA8FF",
    marginTop: 5,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 12,
    margin: 20,
    justifyContent: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 16,
    color: "#4DA8FF",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});
