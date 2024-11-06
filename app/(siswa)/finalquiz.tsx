import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
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

interface NaratifTextProps {
  classId?: string;
}

export default function NaratifText({ classId }: NaratifTextProps) {
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);

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
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loader}
        />
      ) : error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Collapsible
            title="FINAL SUMMATIVE QUIZ"
            isLockedGeneral={!generalQuizStatus["Level 3 Kuis Formatif"]}
            isLockedClass={!classQuizStatus["Level 3 Kuis Formatif"]}
            classId={effectiveClassId}>
            <DefinitionItem titlee="Summative Quiz">
              <StartQuizButton
                title="Start Quiz"
                materialName="Teks Naratif"
                quizName="Summative Quiz"
                classId={effectiveClassId}
              />
            </DefinitionItem>
          </Collapsible>
        </ScrollView>
      )}
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#E6F3FF",
    },
    scrollContent: {
      padding: width * 0.05,
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      fontSize: width < 360 ? 16 : 18,
      color: "red",
      textAlign: "center",
      marginTop: height * 0.1,
    },
  });
