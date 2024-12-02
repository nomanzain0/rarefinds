import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import Toast from 'react-native-toast-message'; // Import the Toast library
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { UserContext } from "@/components/userContext";
import { useColorScheme } from "@/hooks/useColorScheme";



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    DM: require("../assets/fonts/DM.ttf"),
    "DM-italic": require("../assets/fonts/DM-italic.ttf"),
    Playfair: require("../assets/fonts/Playfair.ttf"),
    "Playfair-italic": require("../assets/fonts/Playfair-italic.ttf"),
    Quicksand: require("../assets/fonts/Quicksand.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Pinyon: require("../assets/fonts/PinyonScript-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
    <UserContext>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(product)/[product]"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="onBoarding" options={{ headerShown: false }} />
          <Stack.Screen name="(product)/add" options={{ headerShown: false }} />
          <Stack.Screen
            name="search/[search]"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(pages)/update-profile" options={{ headerShown: false }} />
          <Stack.Screen name="(pages)/account" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/verify" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/reset" options={{ headerShown: false }} />
          <Stack.Screen name="search/catagory" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/reset-password" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)/register"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </UserContext>
    <Toast />
    </>
  );
}
