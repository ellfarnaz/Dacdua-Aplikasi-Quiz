import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectUser } from "../../redux/slices/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import NetInfo from "@react-native-community/netinfo";
import { AppDispatch, RootState } from "../../redux/store";
import { clearAllSubscriptions } from "../../services/chatService";

export default function Home() {
  const { colors } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectUser(state));
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Keluar", "Apakah Kamu Yakin Ingin Keluar", [
      { text: "Tidak", style: "cancel" },
      {
        text: "Keluar",
        onPress: async () => {
          try {
            await clearAllSubscriptions();
            dispatch(clearUser());
            await signOut(auth);
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };
  const handleJoinClass = () => {
    router.push("/join-class");
  };

  if (!user) {
    return null;
  }

  return (
    <ImageBackground
      source={require("../../assets/images/iconcz.png")}
      style={styles.backgroundImage}>
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={["rgba(52, 152, 219, 0.8)", "rgba(41, 128, 185, 0.9)"]}
          style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Ionicons
              name="person-circle-outline"
              size={100}
              color="white"
            />
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <Text style={styles.profileInstitution}>{user.institution}</Text>
          {!isOnline && (
            <Text style={styles.offlineMessage}>
              You are currently offline. Some features may be limited.
            </Text>
          )}
        </LinearGradient>

        <View style={styles.menuSection}>
          <Text style={[styles.menuTitle, { color: colors.text }]}>Dacdua</Text>

          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => router.push("/tujuan")}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={32}
              color="#fff"
            />
            <Text style={styles.quizButtonText}>Tujuan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => router.push("/materi")}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={32}
              color="#fff"
            />
            <Text style={styles.quizButtonText}>Materi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => router.push("/finalquiz")}>
            <MaterialCommunityIcons
              name="rocket-launch"
              size={32}
              color="#fff"
            />
            <Text style={styles.quizButtonText}>Kuis Sumatif</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quizButton}
            onPress={handleJoinClass}>
            <MaterialCommunityIcons
              name="history"
              size={32}
              color="#fff"
            />
            <Text style={styles.quizButtonText}>Kelas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => router.push("/leaderboardGeneral")}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={32}
              color="#fff"
            />
            <Text style={styles.quizButtonText}>Leaderboard</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color="white"
          />
          <Text style={styles.logoutButtonText}>Keluar</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#e6f2ff",
    marginBottom: 5,
  },
  profileInstitution: {
    fontSize: 16,
    color: "#e6f2ff",
    marginBottom: 20,
  },
  menuSection: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  quizButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  quizButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  offlineMessage: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    padding: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
  },
});
