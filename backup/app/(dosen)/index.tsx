// app/(dosen)/dashboard.tsx

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
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, selectUser } from "../../redux/slices/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { getClasses, deleteClass } from "../../services/classService";
import { Class } from "../../types";
import {} from "../../services/classService";

export default function DosenDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [classes, setClasses] = useState<Class[]>([]);
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
        setClasses(fetchedClasses);
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

  if (!user) return null;

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
              // Refresh daftar kelas setelah penghapusan
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
      <TouchableOpacity onPress={() => handleClassPress(item.id)}>
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
          color="red"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
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
            color="white"
          />
          <Text style={styles.buttonText}>Buat Kelas Baru</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleViewScores}>
          <Ionicons
            name="list-outline"
            size={24}
            color="white"
          />
          <Text style={styles.buttonText}>Lihat Nilai Siswa</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.classesContainer}>
        <Text style={styles.classesTitle}>Kelas Anda</Text>
        {loading ? (
          <Text>Loading classes...</Text>
        ) : classes.length > 0 ? (
          <FlatList
            data={classes}
            renderItem={renderClassItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text>Anda belum membuat kelas apapun.</Text>
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
        <Text style={styles.buttonText}>Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  classItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  deleteButton: {
    padding: 10,
  },
  header: {
    padding: 20,
    backgroundColor: "#4a90e2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  classesContainer: {
    padding: 20,
  },
  classesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  className: {
    fontSize: 18,
    fontWeight: "bold",
  },
  classMaterial: {
    fontSize: 14,
    color: "#666",
  },
  classCode: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  studentCount: {
    fontSize: 12,
    color: "#888",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 5,
    margin: 20,
  },
});
