import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { createClass } from "../../services/classService";
import { selectUser } from "../../redux/slices/authSlice";
import { useRouter } from "expo-router";
import { AppDispatch, RootState } from "../../redux/store";

const materials = [
  { label: "Pilih Materi", value: "" },
  { label: "Teks Naratif", value: "teks-naratif" },
  { label: "Teks exposisi", value: "expo-sisi" },

  // ... tambahkan materi lain di sini
];

export default function CreateClass() {
  const [className, setClassName] = useState("");
  const [materialId, setMaterialId] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectUser(state));
  const router = useRouter();

  const handleCreateClass = async () => {
    if (!className || !materialId || !user) {
      alert("Mohon isi semua field");
      return;
    }

    try {
      const classCode = Math.random().toString(36).substring(7);
      const newClass = await createClass({
        name: className,
        material: materials.find((m) => m.value === materialId)?.label || "",
        materialId,
        teacherId: user.id,
        teacherName: user.name,
        classCode,
      });
      alert(`Kelas berhasil dibuat. Kode kelas: ${classCode}`);
      router.back();
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Gagal membuat kelas. Silakan coba lagi.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buat Kelas Baru</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama Kelas"
        value={className}
        onChangeText={setClassName}
      />
      <View style={styles.pickerContainer}>
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
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateClass}>
        <Text style={styles.buttonText}>Buat Kelas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
