import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

interface BulletListProps {
  items: string[];
}

const BulletList: React.FC<BulletListProps> = ({ items }) => {
  return (
    <View style={styles.ul}>
      {items.map((item, index) => (
        <View
          style={styles.li}
          key={index}>
          <ThemedText
            style={styles.liBullet}
            speech={false}>
            .{" "}
          </ThemedText>
          <ThemedText
            type="defaultSemiBold1"
            speech={false}>
            {item}
          </ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  ul: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingRight: 17,
    gap: 7,
  },
  li: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  liBullet: {
    fontWeight: "bold",
    fontSize: 40,
    marginLeft: -5,
  },
});

export default BulletList;
