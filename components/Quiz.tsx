import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setScore, selectQuizScores } from "../redux/slices/quizSlice";
import { materials, Question } from "../data/questions";
import { useRouter } from "expo-router";
import { saveScoreToGoogleSheets } from "../services/googleSheetsService";

interface QuizProps {
  materialName: string;
  quizName: string;
}

export const Quiz: React.FC<QuizProps> = ({ materialName, quizName }) => {
  const dispatch = useDispatch();
  const quizScores = useSelector(selectQuizScores);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const material = materials.find((m) => m.name === materialName);
  const quiz = material?.quizzes.find((q) => q.name === quizName);

  if (!material || !quiz) {
    return <Text>Quiz not found</Text>;
  }

  const handleAnswer = (questionIndex: number, answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answer });
  };

  const handleFinish = async () => {
    const totalQuestions = quiz.questions.length;
    if (Object.keys(selectedAnswers).length < totalQuestions) {
      Alert.alert(
        "Peringatan",
        "Harap jawab semua pertanyaan sebelum menyelesaikan Quiz."
      );
      return;
    }

    setIsLoading(true);

    let correctAnswers = 0;
    quiz.questions.forEach((question: Question, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    dispatch(setScore({ materialName, quizName, score }));

    // Save score to Google Sheets
    const saved = await saveScoreToGoogleSheets(materialName, quizName, score);

    setIsLoading(false);

    if (saved) {
      Alert.alert(
        "Quiz Selesai",
        `Skor Anda: ${score} dari 100\nNilai telah disimpan.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        "Quiz Selesai",
        `Skor Anda: ${score} dari 100\nGagal menyimpan nilai. Silakan coba lagi nanti.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
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
        <Text style={styles.finishButtonText}>Selesaikan Kuis</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ActivityIndicator
              size="large"
              color="#4DA8FF"
            />
            <Text style={styles.modalText}>Sedang menyimpan nilai quiz...</Text>
            <Text style={styles.modalSubText}>
              Harap gunakan internet untuk upload nilai Anda
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... (previous styles remain the same)

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  modalSubText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
    color: "#666",
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E6F3FF",
  },
  questionContainer: {
    marginBottom: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#4DA8FF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "black",
  },
  answerButton: {
    backgroundColor: "#F0F8FF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#B0E0FF",
  },
  selectedAnswer: {
    backgroundColor: "#B0E0FF",
    borderColor: "#4DA8FF",
  },
  answerText: {
    fontSize: 16,
    color: "black",
  },
  finishButton: {
    backgroundColor: "#4DA8FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 50,
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
