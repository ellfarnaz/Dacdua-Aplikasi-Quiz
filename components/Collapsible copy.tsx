import React, { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface CollapsibleProps extends PropsWithChildren {
  title: string;
  isLocked: boolean;
  isClassQuiz: boolean;
}

export function Collapsible({
  children,
  title,
  isLocked,
  isClassQuiz,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePress = () => {
    if (!isLocked) {
      setIsOpen((value) => !value);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={[
          styles.heading,
          isClassQuiz ? styles.classHeading : styles.generalHeading,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}>
        <Ionicons
          name={
            isLocked
              ? "lock-closed"
              : isOpen
              ? "chevron-down"
              : "chevron-forward-outline"
          }
          size={18}
          color="#FFFFFF"
        />
        <ThemedText
          style={styles.titleText}
          speech={false}>
          {title}
        </ThemedText>
      </TouchableOpacity>
      {isOpen && !isLocked && (
        <ThemedView style={styles.content}>{children}</ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6F3FF",
    borderRadius: 8,
    marginVertical: 0,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "black",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  generalHeading: {
    backgroundColor: "#4DA8FF",
  },
  classHeading: {
    backgroundColor: "#FF6B6B", // Different color for class quizzes
  },
  titleText: {
    color: "#FFFFFF",
    fontWeight: "600",
    paddingRight: 10,
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
});