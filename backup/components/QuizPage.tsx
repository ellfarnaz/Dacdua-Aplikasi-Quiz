// components/Quiz.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setScoreAsync, selectQuizLoading } from "../redux/slices/quizSlice";
import { selectUser } from "../redux/slices/authSlice";
import { materials, Question } from "../data/questions";
import { useLocalSearchParams, useRouter } from "expo-router";
import { QuizScore } from "../types";

interface QuizProps {
  onFinish: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ onFinish }) => {
  const { materialName, quizName, classId } = useLocalSearchParams<{
    materialName: string;
    quizName: string;
    classId?: string;
  }>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectUser(state));
  const isLoading = useSelector((state: RootState) => selectQuizLoading(state));
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const router = useRouter();

  const material = materials.find((m) => m.name === materialName);
  const quiz = material?.quizzes.find((q) => q.name === quizName);

  useEffect(() => {
    if (!material || !quiz || !user) {
      Alert.alert("Error", "Quiz not found or user not authenticated", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [material, quiz, user, router]);

  if (!material || !quiz || !user) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
      />
    );
  }

  const handleAnswer = (questionIndex: number, answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answer });
  };

  const handleFinish = async () => {
    const totalQuestions = quiz.questions.length;
    if (Object.keys(selectedAnswers).length < totalQuestions) {
      Alert.alert(
        "Warning",
        "Please answer all questions before finishing the quiz."
      );
      return;
    }

    let correctAnswers = 0;
    quiz.questions.forEach((question: Question, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    try {
      const scoreData: Omit<QuizScore, "id" | "timestamp" | "synced"> = {
        materialName,
        quizName,
        score,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userInstitution: user.institution,
      };

      if (classId !== undefined) {
        scoreData.classId = classId;
      }

      await dispatch(setScoreAsync(scoreData)).unwrap();
      Alert.alert(
        "Quiz Completed",
        `Congratulations! Your score: ${score} out of 100`,
        [{ text: "OK", onPress: onFinish }]
      );
    } catch (error) {
      console.error("Failed to save score:", error);
      Alert.alert("Error", "Failed to save score. Please try again later.", [
        { text: "OK" },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {quiz.questions.map((question: Question, questionIndex: number) => (
        <View
          key={questionIndex}
          style={styles.questionContainer}>
          <Text style={styles.questionText}>{`${questionIndex + 1}. ${
            question.question
          }`}</Text>
          {Object.entries(question.answers).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.answerButton,
                selectedAnswers[questionIndex] === key && styles.selectedAnswer,
              ]}
              onPress={() => handleAnswer(questionIndex, key)}>
              <Text style={styles.answerText}>{`${key}. ${value}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <TouchableOpacity
        style={styles.finishButton}
        onPress={handleFinish}>
        <Text style={styles.finishButtonText}>Finish Quiz</Text>
      </TouchableOpacity>
      {isLoading === "pending" && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#0000ff"
          />
          <Text>Saving your score...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  questionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  answerButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedAnswer: {
    backgroundColor: "#4a90e2",
  },
  answerText: {
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  finishButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});

export default Quiz;
