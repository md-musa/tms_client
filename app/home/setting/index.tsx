import React from "react";
import { View, Text, TouchableOpacity, Image, Linking, ScrollView } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function Settings() {
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Profile Section */}
      <View className="items-center mb-6 bg-tertiary-700 py-5">
        <Image
          source={{ uri: "https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg=" }} // Replace with actual image URL
          className="w-24 h-24 rounded-full mb-3 border-2 border-tertiary-400"
        />
        <Text className="text-xl font-bold text-white">Mohammad Musa</Text>
        <Text className="text-white">Route</Text>
      </View>

      {/* Settings Options */}
      <View className="bg-white rounded-lg shadow-md px-5">
        <SettingOption icon="person-circle" text="Profile" />
        <SettingOption icon="notifications" text="Notifications" />
        <SettingOption icon="settings" text="Settings" />
        <SettingOption icon="help-circle" text="FAQ" />
        <SettingOption icon="information-circle" text="About" />
        <SettingOption icon="log-out" text="Logout" color="red" />
      </View>

      {/* Developer Info */}
      {/* <View className="bg-white rounded-lg shadow-md p-4 mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Developed By</Text>
        <View className="items-center">
          <Image
            source={{ uri: "https://example.com/developer-image.png" }} // Replace with actual image URL
            className="w-20 h-20 rounded-full mb-2"
          />
          <Text className="text-md font-bold text-gray-800">Mohammad Musa</Text>
          <Text className="text-sm text-gray-600 text-center px-4">
            Passionate Software Engineer skilled in Backend Development and Web Technologies.
          </Text>
        </View>
        <View className="flex-row justify-center mt-4">
          <TouchableOpacity onPress={() => handleLinkPress("https://facebook.com/md-musa")} className="mx-2">
            <FontAwesome name="facebook" size={28} color="#1877F2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLinkPress("mailto:mohammad.musa706@gmail.com")} className="mx-2">
            <Ionicons name="mail" size={28} color="#D44638" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLinkPress("https://github.com/md-musa")} className="mx-2">
            <FontAwesome name="github" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View> */}
    </ScrollView>
  );
}

// Reusable Setting Option Component
const SettingOption = ({ icon, text, color = "black" }) => (
  <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200">
    <Ionicons name={icon} size={24} color={color} className="mr-3" />
    <Text className={`text-lg font-medium ${color === "red" ? "text-red-600" : "text-gray-800"}`}>{text}</Text>
  </TouchableOpacity>
);
