import React, { useEffect, useState, useCallback } from "react";
import { Slot, useRouter, useSegments, Href, Stack } from "expo-router";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, AppDispatch, RootState } from "../redux/store";
import { auth, db } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { setUser, clearUser, selectUser } from "../redux/slices/authSlice";
import { View, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkInternetConnection } from "../utils/networkUtils";
import { fetchScoresAsync } from "../redux/slices/quizSlice";
import { syncLocalScoresToFirestore } from "../services/firebaseService";
import NetInfo from "@react-native-community/netinfo";
import { User } from "../types";
import {
  clearAllSubscriptions,
  subscribeToAllClassMessages,
  loadMessages,
  syncOfflineMessages,
} from "../services/chatService";
import {
  fetchStudentClassesAsync,
  fetchDosenClassesAsync,
} from "../redux/slices/classSlice";
import { setIsOnline } from "../redux/slices/networkSlice";
import * as SplashScreen from "expo-splash-screen";

type AppRoute =
  | "/(auth)/login"
  | "/(admin)/dashboard"
  | "/(dosen)/"
  | "/(siswa)/"
  | "/(materi)/";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<AppRoute | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const initializeApp = useCallback(async () => {
    try {
      const isConnected = await checkInternetConnection();
      if (isConnected) {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            const userData = userDoc.data();
            const user: User = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              name: userData?.name || "",
              institution: userData?.institution || "",
              role: userData?.role || "student",
            };
            await AsyncStorage.setItem("userRole", user.role);
            await AsyncStorage.setItem("user", JSON.stringify(user));
            dispatch(setUser(user));
            dispatch(fetchScoresAsync());
            await syncLocalScoresToFirestore();

            if (user.role === "student") {
              await dispatch(fetchStudentClassesAsync());
              subscribeToAllClassMessages(user.id);
              setInitialRoute("/(siswa)/");
            } else if (user.role === "dosen") {
              await dispatch(fetchDosenClassesAsync());
              subscribeToAllClassMessages(user.id);
              setInitialRoute("/(dosen)/");
            } else if (user.role === "admin") {
              setInitialRoute("/(admin)/dashboard");
            }
          } else {
            await clearAllSubscriptions();
            dispatch(clearUser());
            await AsyncStorage.removeItem("userRole");
            await AsyncStorage.removeItem("user");
            setInitialRoute("/(auth)/login");
          }
          setIsLoading(false);
        });
        return unsubscribe;
      } else {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          dispatch(setUser(user));
          if (user.role === "student") {
            setInitialRoute("/(siswa)/");
          } else if (user.role === "dosen") {
            setInitialRoute("/(dosen)/");
          } else if (user.role === "admin") {
            setInitialRoute("/(admin)/dashboard");
          }
        } else {
          dispatch(clearUser());
          setInitialRoute("/(auth)/login");
        }
        setIsLoading(false);
      }
    } catch (e) {
      console.warn(e);
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setIsOnline(state.isConnected ?? false));
      if (state.isConnected && user && user.role === "student") {
        syncOfflineMessages();
        store.getState().class.classes.forEach((classItem) => {
          loadMessages(classItem.id, user.id);
        });
      }
    });

    return () => unsubscribe();
  }, [dispatch, user]);

  useEffect(() => {
    if (!isLoading && initialRoute) {
      const inAuthGroup = segments[0] === "(auth)";
      const inAdminGroup = segments[0] === "(admin)";
      const inDosenGroup = segments[0] === "(dosen)";
      const inSiswaGroup = segments[0] === "(siswa)";
      const inMateriGroup = segments[0] === "(materi)";

      if (!user && !inAuthGroup && !inMateriGroup) {
        router.replace("/(auth)/login" as Href<string>);
      } else if (user && inAuthGroup) {
        router.replace(initialRoute as Href<string>);
      } else if (user && user.role === "admin" && !inAdminGroup) {
        router.replace("/(admin)/dashboard" as Href<string>);
      } else if (user && user.role === "dosen" && !inDosenGroup) {
        router.replace("/(dosen)/" as Href<string>);
      } else if (
        user &&
        user.role === "student" &&
        !inSiswaGroup &&
        !inMateriGroup
      ) {
        router.replace("/(siswa)/" as Href<string>);
      }

      // Hide the splash screen
      SplashScreen.hideAsync();

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [user, isLoading, segments, initialRoute, fadeAnim, router]);

  if (isLoading || !initialRoute) {
    return null; // This will keep the splash screen visible
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(auth)/login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(admin)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(dosen)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(siswa)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(materi)"
          options={{ headerShown: false }}
        />
      </Stack>
    </Animated.View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
