import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import NaratifText from "../../../(materi)/naratif-text";
import ExpoSisi from "../../../(materi)/expo-sisi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { selectClassById } from "../../../../redux/slices/classSlice";

export default function ClassMaterial() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const classData = useSelector((state: RootState) =>
    selectClassById(state, id)
  );

  if (!classData) {
    return null; // atau tampilkan pesan loading/error
  }

  const renderMaterial = () => {
    switch (classData.materialId) {
      case "teks-naratif":
        return <NaratifText classId={id} />;
      case "expo-sisi":
        return <ExpoSisi classId={id} />;
      default:
        return null; // atau tampilkan pesan error
    }
  };

  return <View style={styles.container}>{renderMaterial()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
