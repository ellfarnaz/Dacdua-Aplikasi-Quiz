import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Quiz } from "../components/Quiz";

export default function QuizScreen() {
  const { materialName, quizName } = useLocalSearchParams<{
    materialName: string;
    quizName: string;
  }>();

  return (
    <Quiz
      materialName={materialName}
      quizName={quizName}
    />
  );
}
