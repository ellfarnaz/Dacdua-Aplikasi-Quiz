import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextStyle,
  ViewStyle,
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

type TextType =
  | "default"
  | "default1"
  | "title"
  | "defaultSemiBold"
  | "defaultSemiBold1"
  | "subtitle"
  | "link"
  | "titlee";

interface ThemedTextProps {
  style?: TextStyle;
  color?: string;
  type?: TextType;
  speech?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

export function ThemedText({
  style,
  color = "#000000",
  type = "default",
  speech = true,
  children,
  ...rest
}: ThemedTextProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePress = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToSpeak = typeof children === "string" ? children : "";
      await Speech.speak(textToSpeak, {
        language: "id-ID", // Set to Indonesian
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const textComponent = (
    <Text
      style={[
        { color: type === "title" ? "#4DA8FF" : color },
        type === "default" ? styles.default : undefined,
        type === "default1" ? styles.default1 : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "defaultSemiBold1" ? styles.defaultSemiBold1 : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "titlee" ? styles.titlee : undefined,
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );

  if (speech) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.container}>
        <View style={styles.textIconContainer}>
          {textComponent}
          <View style={styles.iconContainer}>
            <Ionicons
              name={isSpeaking ? "volume-high" : "volume-medium"}
              size={24}
              color={color}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return textComponent;
}

interface Styles {
  container: ViewStyle;
  textIconContainer: ViewStyle;
  iconContainer: ViewStyle;
  default: TextStyle;
  default1: TextStyle;
  defaultSemiBold: TextStyle;
  defaultSemiBold1: TextStyle;
  title: TextStyle;
  titlee: TextStyle;
  subtitle: TextStyle;
  link: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  textIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  iconContainer: {
    marginLeft: 8,
    alignSelf: "flex-end",
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  default1: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 13,
    marginBottom: 8,
  },
  defaultSemiBold: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: "600",
  },
  defaultSemiBold1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
    color: "#4DA8FF", // Light blue color for title
    textShadowColor: "rgba(77, 168, 255, 0.3)", // Light blue shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  titlee: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 25,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
