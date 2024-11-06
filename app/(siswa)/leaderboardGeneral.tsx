// app/(siswa)/leaderboardGeneral.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import LeaderboardGeneral from "../../components/LeaderboardGeneral";

export default function LeaderboardGeneralScreen() {
  return (
    <View style={styles.container}>
      <LeaderboardGeneral />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
