import React, { forwardRef } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface NavButtonProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export const NavButton = forwardRef<TouchableOpacity, NavButtonProps>(
  ({ title, iconName, onPress }, ref) => {
    return (
      <TouchableOpacity
        style={styles.navButton}
        onPress={onPress}
        ref={ref}>
        <Ionicons
          name={iconName}
          size={24}
          color="white"
          style={styles.navIcon}
        />
        <Text style={styles.navButtonText}>{title}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color="white"
          style={styles.navArrow}
        />
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navIcon: {
    marginRight: 15,
  },
  navButtonText: {
    flex: 1,
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  navArrow: {
    marginLeft: "auto",
  },
});
