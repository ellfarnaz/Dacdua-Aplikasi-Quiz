import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

interface BulletListProps {
  children: string;
  showSpeakAllButton?: boolean;
}

const BulletList: React.FC<BulletListProps> = ({
  children,
  showSpeakAllButton = false,
}) => {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const items = children
    .split("\n")
    .filter((item) => item.trim() !== "")
    .map((item) => {
      const [title, ...contentParts] = item.split(":");
      return {
        title: title.trim(),
        content: contentParts.join(":").trim(),
      };
    });

  const speakItem = async (index: number) => {
    if (speakingIndex === index) {
      await Speech.stop();
      setSpeakingIndex(null);
    } else {
      setSpeakingIndex(index);
      const textToSpeak = `${items[index].title}. ${items[index].content}`;

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
    console.log("speakAll started");
    if (speakingIndex !== null) {
      console.log("Stopping speech");
      await Speech.stop();
      setSpeakingIndex(null);
    } else {
      setSpeakingIndex(0);
      for (let i = 0; i < items.length; i++) {
        console.log(`Speaking item ${i}`);
        const textToSpeak = `${items[i].title}. ${items[i].content}`;

        try {
          await new Promise<void>((resolve, reject) => {
            Speech.speak(textToSpeak, {
              language: "id-ID",
              onStart: () => console.log(`Started speaking item ${i}`),
              onDone: () => {
                console.log(`Finished speaking item ${i}`);
                resolve();
              },
              onError: (error) => {
                console.error(`Speech error for item ${i}:`, error);
                reject(error);
              },
            });
          });

          if (i < items.length - 1) {
            setSpeakingIndex(i + 1);
          }
        } catch (error) {
          console.error("Speech error:", error);
          break;
        }
      }
      console.log("speakAll finished");
      setSpeakingIndex(null);
    }
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View
          key={index}
          style={styles.itemContainer}>
          <View style={styles.bulletAndTitle}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.title}>{item.title}:</Text>
          </View>
          <Text style={styles.content}>{item.content}</Text>
          {!showSpeakAllButton && (
            <TouchableOpacity
              style={styles.speakerIcon}
              onPress={() => speakItem(index)}>
              <Ionicons
                name={speakingIndex === index ? "volume-high" : "volume-medium"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          )}
        </View>
      ))}
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
  itemContainer: {
    marginBottom: 10,
    position: "relative",
  },
  bulletAndTitle: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  bullet: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  content: {
    fontSize: 16,
    marginLeft: 20,
    lineHeight: 22,
  },
  speakerIcon: {
    position: "absolute",
    right: 0,
    top: 0,
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
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default BulletList;
