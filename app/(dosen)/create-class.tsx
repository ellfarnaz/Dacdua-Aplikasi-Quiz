import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { createClass } from "../../services/classService";
import { selectUser } from "../../redux/slices/authSlice";
import { useRouter } from "expo-router";
import { AppDispatch, RootState } from "../../redux/store";
import { Ionicons } from "@expo/vector-icons";
import { addClass } from "../../redux/slices/classSlice";

const materials = [
  { label: "Pilih Materi", value: "" },
  { label: "Teks Naratif", value: "teks-naratif" },
  // { label: "Teks Eksposisi", value: "teks-eksposisi" },
  // ... tambahkan materi lain di sini
];

export default function CreateClass() {
  const [className, setClassName] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [classCode, setClassCode] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectUser(state));
  const router = useRouter();

  const handleCreateClass = async () => {
    if (!className || !materialId || !classCode || !user) {
      alert("Mohon isi semua field");
      return;
    }

    try {
      const newClass = await createClass({
        name: className,
        material: materials.find((m) => m.value === materialId)?.label || "",
        materialId,
        teacherId: user.id,
        teacherName: user.name,
        classCode,
      });
      dispatch(addClass(newClass));
      alert(`Kelas berhasil dibuat. Kode kelas: ${classCode}`);
      router.back();
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Gagal membuat kelas. Silakan coba lagi.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Ionicons
              name="school-outline"
              size={60}
              color="#4DA8FF"
            />
            <Text style={styles.title}>Buat Kelas Baru</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="book-outline"
                size={24}
                color="#4DA8FF"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nama Kelas"
                placeholderTextColor="#999"
                value={className}
                onChangeText={setClassName}
              />
            </View>
            <View style={styles.pickerContainer}>
              <Ionicons
                name="list-outline"
                size={24}
                color="#4DA8FF"
                style={styles.icon}
              />
              <Picker
                selectedValue={materialId}
                onValueChange={(itemValue) => setMaterialId(itemValue)}
                style={styles.picker}>
                {materials.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                name="key-outline"
                size={24}
                color="#4DA8FF"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Kode Kelas"
                placeholderTextColor="#999"
                value={classCode}
                onChangeText={setClassCode}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateClass}>
              <Text style={styles.buttonText}>Buat Kelas</Text>
              <Ionicons
                name="arrow-forward-outline"
                size={24}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F3FF",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4DA8FF",
    marginTop: 15,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    marginBottom: 20,
    paddingLeft: 15,
    elevation: 2,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    flex: 1,
    height: 55,
  },
  button: {
    backgroundColor: "#4DA8FF",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});
