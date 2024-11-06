import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Quiz } from "../../components/QuizPage";
import { BackHandler } from "react-native";

export default function QuizScreen() {
  const { materialName, quizName, classId } = useLocalSearchParams<{
    materialName: string;
    quizName: string;
    classId?: string;
  }>();
  const router = useRouter();

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  return <Quiz onFinish={() => router.back()} />;
}
