import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface DefinitionItemProps {
  titlee: string;
  children: React.ReactNode;
}

export const DefinitionItem: React.FC<DefinitionItemProps> = ({
  titlee,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        onPress={toggleExpansion}
        style={styles.titleContainer}>
        <ThemedText
          type="titlee"
          style={styles.titleText}
          speech={false}>
          {titlee}
        </ThemedText>
        <Ionicons
          name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={18}
          color="#FFFFFF"
        />
      </TouchableOpacity>
      {isExpanded && (
        <ThemedView style={styles.contentContainer}>{children}</ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#4DA8FF",
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: "#E6F3FF",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#4DA8FF",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  titleText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
});
