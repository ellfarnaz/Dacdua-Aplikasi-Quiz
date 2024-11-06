// components/LoadingOverlay.tsx
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoadingOverlay = () => (
  <View style={styles.container}>
    <ActivityIndicator
      size="large"
      color="#FFFFFF"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#169ED1",
  },
});

export default LoadingOverlay;
