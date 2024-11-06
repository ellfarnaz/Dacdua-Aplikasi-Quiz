// Dosens can view all student scores in this page
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { getAllStudentScores } from "../../services/userService";
import { QuizScore, User } from "../../types";
import { formatDate } from "../../utils/dateUtils";

type EnhancedQuizScore = QuizScore & Partial<User>;

export default function StudentScores() {
  const [scores, setScores] = useState<EnhancedQuizScore[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      const allScores = await getAllStudentScores();
      setScores(allScores);
    };

    fetchScores();
  }, []);

  const renderScoreItem = ({ item }: { item: EnhancedQuizScore }) => (
    <View style={styles.scoreItem}>
      <Text style={styles.studentName}>{item.name || "N/A"}</Text>
      <Text style={styles.infoText}>Email: {item.email || "N/A"}</Text>
      <Text style={styles.infoText}>
        Institution: {item.institution || "N/A"}
      </Text>
      <Text style={styles.infoText}>Material: {item.materialName}</Text>
      <Text style={styles.infoText}>Quiz: {item.quizName}</Text>
      <Text style={styles.scoreText}>Score: {item.score}</Text>
      <Text style={styles.dateText}>Date: {formatDate(item.timestamp)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Student Scores</Text>
      {scores.length > 0 ? (
        <FlatList
          data={scores}
          renderItem={renderScoreItem}
          keyExtractor={(item) =>
            item.id || item.email || Math.random().toString()
          }
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noScoresText}>No scores available</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    marginHorizontal: 20,
    color: "#333",
  },
  scoreItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a90e2",
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  noScoresText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});
