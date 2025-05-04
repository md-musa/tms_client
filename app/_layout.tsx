import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BroadcastProvider } from "@/contexts/BroadcastContext";
import Toast from "react-native-toast-message"
import { SplashScreen, Slot } from 'expo-router';

SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <BroadcastProvider>
          <Stack screenOptions={{ headerShown: false }} />;
          <Toast />
        </BroadcastProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
