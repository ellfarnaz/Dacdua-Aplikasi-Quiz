import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import NaratifText from "../../../(materi)/naratif-text";
import ExpoSisi from "../../../(materi)/expo-sisi";
import { RootState, AppDispatch } from "../../../../redux/store";
import {
  selectClassById,
  // getClassesAsync,
  getClassesAsync,
} from "../../../../redux/slices/classSlice";

export default function ClassMaterial() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const classData = useSelector((state: RootState) =>
    selectClassById(state, id)
  );
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        setIsLoading(true);
        if (!classData) {
          // Jika kelas tidak ditemukan, coba muat kelas secara individual
          await dispatch(getClassesAsync(id));
        }
        setIsLoading(false);
      };
      loadData();
    }, [dispatch, id, classData])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#0000ff"
        />
        <Text>Loading class data...</Text>
      </View>
    );
  }

  if (!classData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: Class not found. Please try reloading the app.</Text>
      </View>
    );
  }

  const renderMaterial = () => {
    switch (classData.materialId) {
      case "teks-naratif":
        return <NaratifText classId={id} />;
      case "expo-sisi":
        return <ExpoSisi classId={id} />;
      default:
        return <Text>No material available for this class.</Text>;
    }
  };

  return <View style={styles.container}>{renderMaterial()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
