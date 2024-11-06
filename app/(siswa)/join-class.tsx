import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  SafeAreaView,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { joinClass, getClassesForStudent } from "../../services/classService";
import { selectUser } from "../../redux/slices/authSlice";
import { useRouter } from "expo-router";
import { RootState, AppDispatch } from "../../redux/store";
import { getClassesAsync, addClass } from "../../redux/slices/classSlice";
import { Class } from "../../types";
import { MaterialIcons, FontAwesome5, AntDesign } from "@expo/vector-icons";

export default function JoinClass() {
  const [classCode, setClassCode] = useState("");
  const [joinedClasses, setJoinedClasses] = useState<Class[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: RootState) => selectUser(state));
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const loadJoinedClasses = useCallback(async () => {
    if (user) {
      try {
        const classes = await getClassesForStudent(user.id);
        setJoinedClasses(classes);
      } catch (error) {
        console.error("Failed to load classes:", error);
        Alert.alert("Error", "Failed to load classes. Please try again.");
      }
    }
  }, [user]);

  useEffect(() => {
    loadJoinedClasses();
  }, [loadJoinedClasses]);

  const handleJoinClass = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to join a class.");
      return;
    }

    if (!classCode.trim()) {
      Alert.alert("Error", "Please enter a class code.");
      return;
    }

    setIsLoading(true);
    try {
      const joinedClass = await joinClass(user.id, classCode);
      dispatch(addClass(joinedClass));
      await loadJoinedClasses();
      setModalVisible(false);
      setClassCode("");
      router.push(`/(siswa)/class/${joinedClass.id}`);
    } catch (error) {
      console.error("Failed to join class:", error);
      Alert.alert("Error", "Failed to join class. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ... (rest of the component remains the same)

  // ... (styles remain the same)

  const renderClassItem = ({ item }: { item: Class }) => (
    <TouchableOpacity
      style={styles.classItem}
      onPress={() => router.push(`/(siswa)/class/${item.id}`)}>
      <FontAwesome5
        name="chalkboard-teacher"
        size={24}
        color="#4DA8FF"
        style={styles.classIcon}
      />
      <View style={styles.classTextContainer}>
        <Text style={styles.className}>{item.name}</Text>
        <Text style={styles.classMaterial}>{item.material}</Text>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={24}
        color="#bdc3c7"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subtitle}>Kelas yang Diikuti:</Text>
      {joinedClasses.length > 0 ? (
        <FlatList
          data={joinedClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id}
          style={styles.classList}
        />
      ) : (
        <Text style={styles.emptyText}>
          Anda belum bergabung dengan kelas apapun.
        </Text>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <AntDesign
          name="plus"
          size={24}
          color="white"
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gabung Kelas Baru</Text>
            <View style={styles.inputContainer}>
              <AntDesign
                name="key"
                size={24}
                color="#7f8c8d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Masukkan Kode Kelas"
                value={classCode}
                onChangeText={setClassCode}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleJoinClass}>
              <AntDesign
                name="adduser"
                size={24}
                color="white"
              />
              <Text style={styles.buttonText}>Gabung Kelas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <AntDesign
                name="close"
                size={24}
                color="white"
              />
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E6F3FF",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4DA8FF",
    textAlign: "center",
  },
  classList: {
    flex: 1,
  },
  classItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#4DA8FF",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  classIcon: {
    marginRight: 15,
  },
  classTextContainer: {
    flex: 1,
  },
  className: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2980b9",
    marginBottom: 5,
  },
  classMaterial: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 25,
    bottom: 25,
    backgroundColor: "#4DA8FF",
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    shadowColor: "#4DA8FF",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4DA8FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#4DA8FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
});
