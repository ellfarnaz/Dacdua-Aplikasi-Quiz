import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { User } from "../types";

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.role}>{user.role}</Text>
      <Text style={styles.institution}>{user.institution}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  role: {
    fontSize: 14,
    color: "#4a90e2",
    marginTop: 5,
  },
  institution: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default UserItem;
