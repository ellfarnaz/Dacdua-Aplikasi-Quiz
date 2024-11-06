// app/(siswa)/class/[id]/leaderboard.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ClassLeaderboard from "../../../../components/ClassLeaderboard";

export default function ClassLeaderboardScreen() {
  const { id, materialName } = useLocalSearchParams<{
    id: string;
    materialName: string;
  }>();

  return (
    <View style={styles.container}>
      <ClassLeaderboard
        materialName={materialName}
        classId={id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
