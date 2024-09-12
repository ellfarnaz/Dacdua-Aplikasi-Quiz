import React, { useEffect, useState, useCallback } from "react";
import { Stack, Redirect } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await checkUserData();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const checkUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      setIsLoggedIn(!!userData);
    } catch (error) {
      console.error("Error checking user data:", error);
      setIsLoggedIn(false);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <View
        style={{ flex: 1 }}
        onLayout={onLayoutRootView}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="register"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="quiz"
            options={{ title: "Quiz" }}
          />
          <Stack.Screen
            name="Materi/naratif-text"
            options={{ title: "Teks Naratif" }}
          />
        </Stack>
        {isLoggedIn === false && <Redirect href="/register" />}
      </View>
    </Provider>
  );
}
