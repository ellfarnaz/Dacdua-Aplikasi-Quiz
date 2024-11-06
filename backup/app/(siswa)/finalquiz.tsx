import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { DefinitionItem } from "../../components/DefinitionItem";
import BulletList from "../../components/BulletList";
import BulletList1 from "../../components/BulletList1";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Collapsible } from "../../components/Collapsible";
import { StartQuizButton } from "../../components/StartQuizButton";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchScoresAsync,
  selectGeneralQuizScores,
  selectClassQuizScores,
} from "../../redux/slices/quizSlice";

const { width, height } = Dimensions.get("window");

interface NaratifTextProps {
  classId?: string;
}

export default function NaratifText({ classId }: NaratifTextProps) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectUser(state));
  const generalQuizScores = useSelector(selectGeneralQuizScores);
  const classQuizScores = useSelector(selectClassQuizScores);
  const params = useLocalSearchParams<{ classId: string }>();
  const effectiveClassId = classId || params.classId;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [generalQuizStatus, setGeneralQuizStatus] = useState<
    Record<string, boolean>
  >({
    "Definisi Teks Naratif": false,
    "Tujuan Teks Naratif": false,
    "Fungsi Teks Naratif": false,
    "Jenis-jenis Teks Naratif": false,
    "Perbedaan Teks Naratif": false,
    "Ciri-ciri Teks Naratif": false,
    "Struktur Teks Naratif": false,
  });

  const [classQuizStatus, setClassQuizStatus] = useState<
    Record<string, boolean>
  >({
    "Definisi Teks Naratif": false,
    "Tujuan Teks Naratif": false,
    "Fungsi Teks Naratif": false,
    "Jenis-jenis Teks Naratif": false,
    "Perbedaan Teks Naratif": false,
    "Ciri-ciri Teks Naratif": false,
    "Struktur Teks Naratif": false,
  });

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setError(null);
      dispatch(fetchScoresAsync())
        .unwrap()
        .then(() => setIsLoading(false))
        .catch((err) => {
          setError("Failed to load quiz scores. Please try again.");
          setIsLoading(false);
        });
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (generalQuizScores.length > 0) {
      const newGeneralQuizStatus = { ...generalQuizStatus };
      generalQuizScores.forEach((score) => {
        if (score.quizName in newGeneralQuizStatus) {
          newGeneralQuizStatus[score.quizName] = score.score > 0;
        }
      });
      setGeneralQuizStatus(newGeneralQuizStatus);
    }
  }, [generalQuizScores]);

  useEffect(() => {
    if (classQuizScores.length > 0 && effectiveClassId) {
      const newClassQuizStatus = { ...classQuizStatus };
      classQuizScores.forEach((score) => {
        if (
          score.quizName in newClassQuizStatus &&
          score.classId === effectiveClassId
        ) {
          newClassQuizStatus[score.quizName] = score.score > 0;
        }
      });
      setClassQuizStatus(newClassQuizStatus);
    }
  }, [classQuizScores, effectiveClassId]);

  return (
    <View>
      <Collapsible
        title="Final Quiz"
        isLockedGeneral={!generalQuizStatus["Tujuan Teks Naratif"]}
        isLockedClass={!classQuizStatus["Tujuan Teks Naratif"]}
        classId={effectiveClassId}>
        <StartQuizButton
          title="Start Quiz"
          materialName="Teks Naratif"
          quizName="Fungsi Teks Naratif"
          classId={effectiveClassId}
        />
        {/* <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Sumber: Labov & Waletzky (1967)</ThemedText>
        </ExternalLink> */}
      </Collapsible>
    </View>
  );
}
