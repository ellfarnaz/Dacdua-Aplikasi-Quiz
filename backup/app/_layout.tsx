import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Provider, useSelector, useDispatch } from "react-redux";
import { AppDispatch, store } from "../redux/store";
import * as SplashScreen from "expo-splash-screen";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebaseConfig";
import { setUser, clearUser, selectUser } from "../redux/slices/authSlice";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkInternetConnection } from "../utils/networkUtils";
import { fetchScoresAsync, syncOfflineScores } from "../redux/slices/quizSlice";
import { syncLocalScoresToFirestore } from "../services/firebaseService";
import NetInfo from "@react-native-community/netinfo";
import { User } from "../types";
import {
  clearAllSubscriptions,
  subscribeToAllClassMessages,
  loadMessages,
} from "../services/chatService";
import {
  fetchStudentClassesAsync,
  fetchDosenClassesAsync,
} from "../redux/slices/classSlice";
import { setIsOnline } from "../redux/slices/networkSlice";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const dispatch = useDispatch<AppDispatch>();
  const segments = useSegments();
  const router = useRouter();
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
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
            } else if (user.role === "dosen") {
              await dispatch(fetchDosenClassesAsync());
              subscribeToAllClassMessages(user.id);
            }
          } else {
            await clearAllSubscriptions();
            dispatch(clearUser());
            await AsyncStorage.removeItem("userRole");
            await AsyncStorage.removeItem("user");
          }
          setIsLoading(false);
        });
        return unsubscribe;
      } else {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          dispatch(setUser(JSON.parse(storedUser)));
        } else {
          dispatch(clearUser());
        }
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Add this new useEffect for handling network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setIsOnline(state.isConnected ?? false));
      if (state.isConnected && user && user.role === "student") {
        // Reload messages for all classes when coming back online
        store.getState().class.classes.forEach((classItem) => {
          loadMessages(classItem.id, user.id);
        });
      }
    });

    return () => unsubscribe();
  }, [dispatch, user]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      switch (user.role) {
        case "admin":
          router.replace("/(admin)/dashboard");
          break;
        case "dosen":
          router.replace("/(dosen)/");
          break;
        case "student":
          router.replace("/(siswa)/");
          break;
        default:
          router.replace("/(auth)/login");
      }
    }
  }, [user, segments, isLoading, router]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(auth)"
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
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
