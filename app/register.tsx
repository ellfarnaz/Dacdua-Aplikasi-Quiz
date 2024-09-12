import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { initializeScores } from "../redux/slices/quizSlice";

export default function Register() {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (name.trim() === "" || institution.trim() === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({ name, institution })
      );
      await AsyncStorage.removeItem("quizScores");
      dispatch(initializeScores([]));
      router.replace("/");
    } catch (error) {
      console.error("Error saving user data:", error);
      Alert.alert("Error", "Failed to save user data. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Institution"
          value={institution}
          onChangeText={setInstitution}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
