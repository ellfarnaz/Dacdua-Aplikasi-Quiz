import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

interface BulletList3Props {
  children: string;
}

const BulletList3: React.FC<BulletList3Props> = ({ children }) => {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const lines = children.split("\n").filter((line) => line.trim() !== "");
  const title = lines[0];
  const items = lines.slice(1).map((line) => {
    const [itemTitle, ...contentParts] = line.split(":");
    return {
      title: itemTitle.trim(),
      content: contentParts.join(":").trim(),
    };
  });

  const speakItem = async (index: number) => {
    if (speakingIndex === index) {
      await Speech.stop();
      setSpeakingIndex(null);
    } else {
      if (speakingIndex !== null) {
        await Speech.stop();
      }
      setSpeakingIndex(index);
      const textToSpeak =
        index === -1 ? title : `${items[index].title}. ${items[index].content}`;

      try {
        await Speech.speak(textToSpeak, {
          language: "id-ID",
          onDone: () => setSpeakingIndex(null),
          onError: () => setSpeakingIndex(null),
        });
      } catch (error) {
        console.error("Speech error:", error);
        setSpeakingIndex(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => speakItem(-1)}>
        <Text style={styles.mainTitle}>{title}</Text>
      </TouchableOpacity>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => speakItem(index)}>
          <View style={styles.bulletAndTitle}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.itemTitle}>{item.title}:</Text>
          </View>
          <Text style={styles.itemContent}>{item.content}</Text>
          <View style={styles.speakerIcon}>
            <Ionicons
              name={speakingIndex === index ? "volume-high" : "volume-medium"}
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    backgroundColor: "white",
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemContainer: {
    marginBottom: 16,
    position: "relative",
  },
  bulletAndTitle: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 20,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  itemContent: {
    fontSize: 14,
    marginLeft: 16,
    lineHeight: 20,
  },
  speakerIcon: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});

export default BulletList3;
