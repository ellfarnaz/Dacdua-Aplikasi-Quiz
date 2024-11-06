import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

interface NumberedListComponentProps {
  children: string;
  showSpeakAllButton?: boolean;
}

const NumberedListComponent: React.FC<NumberedListComponentProps> = ({
  children,
  showSpeakAllButton = false,
}) => {
  const items = children.split("\n").filter((item) => item.trim() !== "");
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const speakItem = async (index: number) => {
    if (speakingIndex === index) {
      await Speech.stop();
      setSpeakingIndex(null);
    } else {
      setSpeakingIndex(index);
      const [title, ...contentParts] = items[index].split(":");
      const content = contentParts.join(":").trim();
      const textToSpeak = `Nomor ${index + 1}. ${title.trim()}: ${content}`;

      try {
        await Speech.speak(textToSpeak, {
          language: "id-ID",
          onDone: () => setSpeakingIndex(null),
          onError: (error) => {
            console.error("Speech error:", error);
            setSpeakingIndex(null);
          },
        });
      } catch (error) {
        console.error("Speech error:", error);
        setSpeakingIndex(null);
      }
    }
  };

  const speakAll = async () => {
    if (speakingIndex !== null) {
      await Speech.stop();
      setSpeakingIndex(null);
    } else {
      for (let i = 0; i < items.length; i++) {
        if (speakingIndex === null) {
          await speakItem(i);
        } else {
          break; // Stop if interrupted
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const [title, ...contentParts] = item.split(":");
        const content = contentParts.join(":").trim();

        return (
          <View
            key={index}
            style={styles.listItem}>
            <Text style={styles.number}>{index + 1}.</Text>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title.trim()}:</Text>
              <Text style={styles.content}>{content}</Text>
            </View>
            {!showSpeakAllButton && (
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => speakItem(index)}>
                <Ionicons
                  name={
                    speakingIndex === index ? "volume-high" : "volume-medium"
                  }
                  size={24}
                  color="#000"
                />
              </TouchableOpacity>
            )}
          </View>
        );
      })}
      {showSpeakAllButton && (
        <TouchableOpacity
          onPress={speakAll}
          style={styles.speakAllButton}>
          <Text style={styles.speakAllText}>
            {speakingIndex !== null ? "Berhenti" : "Dengarkan Semua"}
          </Text>
          <Ionicons
            name={speakingIndex !== null ? "volume-high" : "volume-medium"}
            size={24}
            color="#000"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  speakAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6F3FF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10, // Added margin at the top
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  speakAllText: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 8,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  number: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
    marginTop: 2,
  },
  iconContainer: {
    marginLeft: 8,
    alignSelf: "flex-start",
  },
});

export default NumberedListComponent;
