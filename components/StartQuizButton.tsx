import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { selectQuizScores } from "../redux/slices/quizSlice";
import { Link } from "expo-router";

interface StartQuizButtonProps {
  title: string;
  materialName: string;
  quizName: string;
}

export const StartQuizButton: React.FC<StartQuizButtonProps> = ({
  title,
  materialName,
  quizName,
}) => {
  const quizScores = useSelector(selectQuizScores);

  // Pastikan quizScores adalah array, jika tidak, gunakan array kosong
  const scores = Array.isArray(quizScores) ? quizScores : [];

  const score =
    scores.find(
      (score) =>
        score.materialName === materialName && score.quizName === quizName
    )?.score ?? 0;

  return (
    <View style={styles.container}>
      <Link
        href={`/quiz?materialName=${encodeURIComponent(
          materialName
        )}&quizName=${encodeURIComponent(quizName)}`}
        asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </Link>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreText}>{score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B0E0FF",
    padding: 12,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: "#4DA8FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3D8CFF",
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreContainer: {
    backgroundColor: "#E6F3FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B0E0FF",
    alignItems: "center",
  },
  scoreLabel: {
    color: "#4DA8FF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  scoreText: {
    color: "#2E86DE",
    fontSize: 20,
    fontWeight: "bold",
  },
});
