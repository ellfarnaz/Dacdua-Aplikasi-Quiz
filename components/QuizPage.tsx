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
import {
  setScoreAsync,
  selectQuizLoading,
  selectGeneralQuizScores,
  selectClassQuizScores,
} from "../redux/slices/quizSlice";
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
  const generalQuizScores = useSelector((state: RootState) =>
    selectGeneralQuizScores(state)
  );
  const classQuizScores = useSelector((state: RootState) =>
    selectClassQuizScores(state)
  );
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const router = useRouter();

  const material = materials.find((m) => m.name === materialName);
  const quiz = material?.quizzes.find((q) => q.name === quizName);

  useEffect(() => {
    if (!material || !quiz || !user) {
      Alert.alert(
        "Kesalahan",
        "Kuis tidak ditemukan atau pengguna belum terautentikasi",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  }, [material, quiz, user, router]);

  useEffect(() => {
    const quizScores = classId ? classQuizScores : generalQuizScores;
    const existingScore = quizScores.find(
      (score) =>
        score.materialName === materialName &&
        score.quizName === quizName &&
        score.userId === user?.id
    );

    if (existingScore && quiz?.questions.length === 20) {
      setQuizCompleted(true);
      Alert.alert(
        "Kuis Selesai",
        "Anda sudah menyelesaikan kuis ini dan skor Anda tidak dapat diperbarui.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  }, [
    classId,
    classQuizScores,
    generalQuizScores,
    materialName,
    quizName,
    user,
    quiz,
    router,
  ]);

  if (!material || !quiz || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#4a90e2"
        />
      </View>
    );
  }

  const handleAnswer = (questionIndex: number, answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answer });
  };

  const handleFinish = async () => {
    const totalQuestions = quiz.questions.length;
    if (Object.keys(selectedAnswers).length < totalQuestions) {
      Alert.alert(
        "Peringatan",
        "Silakan jawab semua pertanyaan sebelum menyelesaikan kuis."
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
      const quizScores = classId ? classQuizScores : generalQuizScores;
      const existingScore = quizScores.find(
        (score) =>
          score.materialName === materialName &&
          score.quizName === quizName &&
          score.userId === user.id
      );

      if (existingScore && totalQuestions === 20) {
        Alert.alert(
          "Kuis Selesai",
          "Anda sudah menyelesaikan kuis ini dan skor Anda tidak dapat diperbarui.",
          [{ text: "OK", onPress: () => router.back() }]
        );
        return;
      }

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

      if (totalQuestions === 20 || score >= 80) {
        setQuizCompleted(true);
        Alert.alert("Kuis Selesai", `Selamat! Skor Anda: ${score} dari 100`, [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert(
          "Kuis Selesai",
          `Skor Anda: ${score} dari 100. Anda perlu mendapatkan skor setidaknya 80 untuk lulus kuis. Silakan coba lagi.`,
          [{ text: "OK", onPress: () => setSelectedAnswers({}) }]
        );
      }
    } catch (error) {
      console.error("Gagal menyimpan skor:", error);
      Alert.alert(
        "Kesalahan",
        "Gagal menyimpan skor. Silakan coba lagi nanti.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                  selectedAnswers[questionIndex] === key &&
                    styles.selectedAnswer,
                ]}
                onPress={() => handleAnswer(questionIndex, key)}
                disabled={quizCompleted}>
                <Text
                  style={[
                    styles.answerText,
                    selectedAnswers[questionIndex] === key &&
                      styles.selectedAnswerText,
                  ]}>
                  {`${key}. ${value}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.finishButton, quizCompleted && styles.disabledButton]}
        onPress={handleFinish}
        disabled={quizCompleted}>
        <Text style={styles.finishButtonText}>Selesaikan Kuis</Text>
      </TouchableOpacity>
      {isLoading === "pending" && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color="#ffffff"
          />
          <Text style={styles.loadingText}>Menyimpan skor Anda...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7ff",
  },
  scrollContainer: {
    padding: 20,
  },
  questionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e88e5",
  },
  answerButton: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedAnswer: {
    backgroundColor: "#1e88e5",
  },
  answerText: {
    fontSize: 18,
    color: "#1e88e5",
  },
  selectedAnswerText: {
    color: "#ffffff",
  },
  finishButton: {
    backgroundColor: "#1e88e5",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#bbdefb",
  },
  finishButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f7ff",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 18,
    marginTop: 10,
  },
});

export default Quiz;
