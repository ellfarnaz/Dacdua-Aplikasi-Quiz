// Admin Create Dosen Account Screen
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { createDosenAccount, loginUser } from "../../services/authService";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from "../../redux/slices/authSlice";
import { useRouter } from "expo-router";

export default function CreateDosen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [institutionError, setInstitutionError] = useState("");

  const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();

  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!re.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const validateInstitution = (institution: string) => {
    if (!institution.trim()) {
      setInstitutionError("Institution is required");
      return false;
    }
    setInstitutionError("");
    return true;
  };

  const loginAsAdmin = async () => {
    try {
      const adminEmail = "farelnazhari.22@gmail.com";
      const adminPassword = "dac2dac.";
      const adminUser = await loginUser(adminEmail, adminPassword);
      dispatch(setUser(adminUser));
      console.log("Logged back in as admin");
      router.back();
    } catch (error) {
      console.error("Error logging back in as admin:", error);
      Alert.alert(
        "Error",
        "Failed to log back in as admin. Please login manually."
      );
    }
  };

  const handleCreateDosen = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isInstitutionValid = validateInstitution(institution);

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid ||
      !isInstitutionValid
    ) {
      return;
    }

    setIsLoading(true);
    try {
      console.log(
        "Current user role before creating dosen:",
        currentUser?.role
      );
      await createDosenAccount(email, password, name, institution);
      console.log("Dosen account created successfully");
      Alert.alert("Success", "Dosen account created successfully");

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setInstitution("");

      // Login back as admin
      await loginAsAdmin();
    } catch (error: any) {
      console.error("Error creating dosen account:", error);
      Alert.alert("Error", error.message || "Failed to create dosen account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Ionicons
            name="person-add-outline"
            size={100}
            color="#4DA8FF"
          />
          <Text style={styles.title}>Create Dosen Account</Text>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={24}
            color="#4DA8FF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="gray"
            value={name}
            onChangeText={(text) => {
              setName(text);
              validateName(text);
            }}
          />
        </View>
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={24}
            color="#4DA8FF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color="#4DA8FF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="gray"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#4DA8FF"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color="#4DA8FF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="gray"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              validateConfirmPassword(text);
            }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#4DA8FF"
            />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        ) : null}
        <View style={styles.inputContainer}>
          <Ionicons
            name="business-outline"
            size={24}
            color="#4DA8FF"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Institution"
            placeholderTextColor="gray"
            value={institution}
            onChangeText={(text) => {
              setInstitution(text);
              validateInstitution(text);
            }}
          />
        </View>
        {institutionError ? (
          <Text style={styles.errorText}>{institutionError}</Text>
        ) : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateDosen}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Create Dosen Account</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F3FF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
    color: "#4DA8FF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4DA8FF",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    elevation: 3,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    marginTop: -5,
  },
});
