// app/(dosen)/class/[id]/index.tsx

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getClassById } from "../../../../services/classService";
import { Class } from "../../../../types";

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
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{classData.name}</Text>
      <Text style={styles.subtitle}>Material: {classData.material}</Text>
      <Text style={styles.subtitle}>Class Code: {classData.classCode}</Text>
      <Text style={styles.subtitle}>
        Students: {classData.students?.length || 0}
      </Text>

      <Text style={styles.sectionTitle}>Student List:</Text>
      <FlatList
        data={classData.studentsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentEmail}>{item.email}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No students in this class yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  studentItem: {
    marginBottom: 8,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  studentEmail: {
    fontSize: 14,
    color: "#666",
  },
});
