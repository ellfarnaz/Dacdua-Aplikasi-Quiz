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
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../../redux/slices/authSlice";
import { registerUser } from "../../services/authService";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [institutionError, setInstitutionError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const validateName = (name: string) => {
    if (!name) {
      setNameError("Nama harus diisi");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email harus diisi");
      return false;
    }
    if (!re.test(email)) {
      setEmailError("Format email tidak valid");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Kata sandi harus diisi");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Kata sandi harus minimal 6 karakter");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Konfirmasi kata sandi tidak cocok");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const validateInstitution = (institution: string) => {
    if (!institution) {
      setInstitutionError("Institusi harus diisi");
      return false;
    }
    setInstitutionError("");
    return true;
  };

  const handleRegister = async () => {
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
    dispatch(setLoading(true));

    try {
      const userData = await registerUser(
        email,
        password,
        name,
        institution,
        "student"
      );
      dispatch(setUser(userData));
      Alert.alert("Berhasil", "Pendaftaran berhasil!", [{ text: "OK" }]);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        dispatch(setError(error.message));
      } else {
        dispatch(setError("Terjadi kesalahan yang tidak diketahui"));
      }
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Pendaftaran gagal. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Ionicons
            name="school-outline"
            size={100}
            color="#4DA8FF"
          />
          <Text style={styles.title}>Daftar</Text>
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
            placeholder="Nama Lengkap"
            placeholderTextColor="#999"
            value={name}
            onChangeText={(text) => {
              setName(text);
              validateName(text);
            }}
            autoCapitalize="words"
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
            placeholderTextColor="#999"
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
            placeholder="Kata Sandi"
            placeholderTextColor="#999"
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
            placeholder="Konfirmasi Kata Sandi"
            placeholderTextColor="#999"
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
            placeholder="Institusi"
            placeholderTextColor="#999"
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
          onPress={handleRegister}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Daftar</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.linkText}>Sudah punya akun? Masuk</Text>
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
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    color: "#4DA8FF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  linkText: {
    marginTop: 15,
    color: "#4DA8FF",
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 10,
  },
});
