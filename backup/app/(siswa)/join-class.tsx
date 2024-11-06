import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { joinClass, getClassesForStudent } from "../../services/classService";
import { selectUser } from "../../redux/slices/authSlice";
import { useRouter } from "expo-router";
import { RootState, AppDispatch } from "../../redux/store";
import { getClassesAsync } from "../../redux/slices/classSlice";
import { Class } from "../../types";

export default function JoinClass() {
  const [classCode, setClassCode] = useState("");
  const [joinedClasses, setJoinedClasses] = useState<Class[]>([]);
  const user = useSelector((state: RootState) => selectUser(state));
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user) {
      loadJoinedClasses();
    }
  }, [user]);

  const loadJoinedClasses = async () => {
    if (user) {
      const classes = await getClassesForStudent(user.id);
      setJoinedClasses(classes);
    }
  };

  const handleJoinClass = async () => {
    if (!user) {
      alert("You must be logged in to join a class");
      return;
    }

    try {
      const classData = await joinClass(user.id, classCode);
      alert(`Successfully joined class: ${classData.name}`);
      dispatch(getClassesAsync(user.id)); // Refresh the classes in Redux store
      loadJoinedClasses(); // Refresh the local state of joined classes
      setClassCode(""); // Clear the input field
    } catch (error) {
      console.error("Failed to join class:", error);
      alert("Failed to join class. Please check the class code and try again.");
    }
  };

  const renderClassItem = ({ item }: { item: Class }) => (
    <TouchableOpacity
      style={styles.classItem}
      onPress={() => router.push(`/(siswa)/class/${item.id}`)}>
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.classMaterial}>{item.material}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Class</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Class Code"
        value={classCode}
        onChangeText={setClassCode}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleJoinClass}>
        <Text style={styles.buttonText}>Join Class</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Your Joined Classes:</Text>
      <FlatList
        data={joinedClasses}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.id}
        style={styles.classList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  classList: {
    flex: 1,
  },
  classItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
  },
  classMaterial: {
    fontSize: 14,
    color: "#666",
  },
});
