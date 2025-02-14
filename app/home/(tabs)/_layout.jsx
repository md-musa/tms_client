import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="schedules" options={{ title: "Schedules" }} />
      <Tabs.Screen name="broadcast" options={{ title: "Broadcast" }} />
      <Tabs.Screen name="notification" options={{ title: "Notifications" }} />
      <Tabs.Screen name="setting" options={{ title: "Settings" }} />
    </Tabs>
  );
}
