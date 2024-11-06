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
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
// import { setUser } from "../../redux/slices/authSlice";
import { loginUser, resetPassword } from "../../services/authService";
import { Ionicons } from "@expo/vector-icons";
import { setUser, setLoading, setError } from "../../redux/slices/authSlice";

type SetIsLoginInProgressFunction = (isInProgress: boolean) => void;

interface LoginProps {
  setIsLoginInProgress: SetIsLoginInProgressFunction;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

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
  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const userData = await loginUser(email, password);
      dispatch(setUser(userData));
      // Navigasi akan ditangani oleh root layout
    } catch (error) {
      console.error(error);
      dispatch(
        setError(
          "Login gagal. Silakan periksa kembali email dan kata sandi Anda."
        )
      );
      setShowForgotPassword(true);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };
  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        "Berhasil",
        "Email untuk mengatur ulang kata sandi telah dikirim. Silakan periksa kotak masuk Anda."
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Gagal mengirim email untuk mengatur ulang kata sandi. Silakan coba lagi."
      );
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
            name="school-outline"
            size={100}
            color="#4DA8FF"
          />
          <Text style={styles.title}>Masuk</Text>
        </View>
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Masuk</Text>
          )}
        </TouchableOpacity>
        {showForgotPassword && (
          <TouchableOpacity
            onPress={handleForgotPassword}
            disabled={isLoading}>
            <Text style={styles.linkText}>Lupa Kata Sandi?</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.replace("/register")}
          disabled={isLoading}>
          <Text style={styles.linkText}>Belum punya akun? Daftar</Text>
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
