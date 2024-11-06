import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ListRenderItemInfo,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getClassById } from "../../../../services/classService";
import { Class, User } from "../../../../types";
import { Ionicons } from "@expo/vector-icons";

export default function ClassOverview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [classData, setClassData] = useState<Class | null>(null);

  useEffect(() => {
    const fetchClassData = async () => {
      if (id) {
        const data = await getClassById(id);
        setClassData(data);
      }
    };
    fetchClassData();
  }, [id]);

  if (!classData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#4DA8FF"
        />
        <Text style={styles.loadingText}>Memuat data kelas...</Text>
      </View>
    );
  }

  const renderStudentItem = ({ item }: ListRenderItemInfo<User>) => (
    <View style={styles.studentItem}>
      <Ionicons
        name="person-circle-outline"
        size={40}
        color="#4DA8FF"
      />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentEmail}>{item.email}</Text>
        <Text style={styles.studentInstitution}>{item.institution}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.headerContainer}>
          <Ionicons
            name="school-outline"
            size={40}
            color="#4DA8FF"
          />
          <Text style={styles.title}>{classData.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <InfoItem
            icon="book-outline"
            text={`Materi: ${classData.material}`}
          />
          <InfoItem
            icon="key-outline"
            text={`Kode Kelas: ${classData.classCode}`}
          />
          <InfoItem
            icon="people-outline"
            text={`Jumlah Siswa: ${classData.students?.length || 0}`}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Daftar Siswa:</Text>
      <FlatList
        data={classData.studentsData}
        keyExtractor={(item: User) => item.id}
        renderItem={renderStudentItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada siswa di kelas ini.</Text>
        }
      />
    </SafeAreaView>
  );
}

interface InfoItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Ionicons
      name={icon}
      size={24}
      color="#4DA8FF"
    />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F3FF",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#4DA8FF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7FAFF",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4DA8FF",
    marginLeft: 12,
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E86DE",
    marginTop: 16,
    marginBottom: 12,
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  studentInfo: {
    marginLeft: 16,
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4DA8FF",
  },
  studentEmail: {
    fontSize: 14,
    color: "#666",
  },
  studentInstitution: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
});
