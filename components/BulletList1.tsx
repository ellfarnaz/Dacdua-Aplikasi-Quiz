import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

interface BulletList1Props {
  items: string[];
  showSpeakAllButton?: boolean;
}

const BulletList1: React.FC<BulletList1Props> = ({
  items,
  showSpeakAllButton = false,
}) => {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const speakItem = async (index: number) => {
    if (speakingIndex === index) {
      await Speech.stop();
      setSpeakingIndex(null);
    } else {
      setSpeakingIndex(index);
      const textToSpeak = items[index];

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

  const renderItem = (item: string, index: number) => {
    if (item.startsWith("Contoh:")) {
      return (
        <View
          key={index}
          style={styles.exampleItem}>
          <Text style={styles.boldText}>{item}</Text>
        </View>
      );
    }
    return (
      <View
        key={index}
        style={styles.li}>
        <Text style={styles.liBullet}>• </Text>
        <Text style={styles.liText}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.ul}>
        {items.map((item, index) => (
          <View
            key={index}
            style={styles.itemContainer}>
            {renderItem(item, index)}
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
        ))}
      </View>
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
  ul: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingRight: 17,
    gap: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  li: {
    flexDirection: "row",
    flex: 1,
  },
  exampleItem: {
    flex: 1,
    // paddingLeft: 25, // To align with bulleted items
  },
  liBullet: {
    fontWeight: "bold",
    fontSize: 20,
    marginRight: 10,
  },
  liText: {
    fontSize: 16,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconContainer: {
    marginLeft: 8,
    alignSelf: "flex-start",
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

export default BulletList1;
