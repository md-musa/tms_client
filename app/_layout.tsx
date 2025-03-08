import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BroadcastProvider } from "@/contexts/BroadcastContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <BroadcastProvider>
          <Stack screenOptions={{ headerShown: false }} />;
        </BroadcastProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
