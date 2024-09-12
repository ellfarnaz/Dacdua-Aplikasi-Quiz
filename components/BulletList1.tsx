import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

interface BulletList1Props {
  items: string[];
}

const BulletList1: React.FC<BulletList1Props> = ({ items }) => {
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
          <ThemedText type="default">{item}</ThemedText>
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
    gap: 5,
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

export default BulletList1;
