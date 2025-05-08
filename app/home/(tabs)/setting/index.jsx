import React from "react";
import { View, Text, TouchableOpacity, Image, Linking, ScrollView } from "react-native";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import Constants from "expo-constants";
import developer1Img from "../../../../assets/images/musa.jpg";

export default function Settings() {
  const { userData, logout } = useAuth();
  const { name, email, role, route } = userData;

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const handleSendFeedback = () => {
    Linking.openURL("mailto:mohammad.musa706@gmail.com?subject=App Feedback");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 px-3">
      {/* Profile Header */}
      <View className="items-start bg-primary-700 px-6 py-10 rounded-xl space-y-2">
        <Text className="text-title-2 font-bold text-white">
          Name: <Text className="font-normal capitalize">{name}</Text>
        </Text>
        <Text className="text-subhead text-white">
          Email: <Text className="text-gray-200">{email}</Text>
        </Text>
        <Text className="text-subhead text-white">
          Role: <Text className="text-gray-200 capitalize">{role}</Text>
        </Text>
        <Text className="text-subhead text-white">
          Route: <Text className="text-gray-200 capitalize">{route.endLocation}</Text>
        </Text>
      </View>

      {/* Setting Options */}
      <View className="bg-white rounded-lg p-4 my-4 shadow-md border border-gray-200">
        <SettingOption icon="mail" text="Send Feedback" onPress={handleSendFeedback} />
        {/* <SettingOption icon="help-circle" text="Help / FAQ" onPress={() => handleLinkPress("https://example.com/help")} />
        <SettingOption icon="document-text" text="Terms of Service" onPress={() => handleLinkPress("https://example.com/terms")} />
        <SettingOption icon="shield-checkmark" text="Privacy Policy" onPress={() => handleLinkPress("https://example.com/privacy")} /> */}
        <SettingOption icon="log-out" text="Logout" color="red" onPress={handleLogout} />
      </View>

      {/* <View className="bg-gray-400 h-[1px] my-6" /> */}

      {/* Developer Info */}
      {/* <View className="bg-white rounded-lg p-4 mb-2 shadow-md border border-gray-200">
        <Text className="text-title-3 font-semibold text-gray-800 mb-3">Developed By</Text>
        <View className="flex-row items-center">
          <View className="flex-[0.3] items-center">
            <Image
              source={developer1Img}
              className="w-24 h-24 rounded-full border-2 border-tertiary-500"
            />
          </View>
          <View className="flex-[0.7] pl-4">
            <Text className="text-md font-bold text-gray-800">Mohammad Musa</Text>
            <Text className="text-sm text-gray-600 mt-1">
              Passionate Backend Developer with expertise in Node.js, WebSocket, and modern web technologies.
            </Text>
            <View className="flex-row mt-3">
              <TouchableOpacity onPress={() => handleLinkPress("https://facebook.com/md-musa")} className="mr-4">
                <FontAwesome name="facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLinkPress("mailto:mohammad.musa706@gmail.com")} className="mr-4">
                <Ionicons name="mail" size={24} color="#D44638" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLinkPress("https://github.com/md-musa")}>
                <FontAwesome name="github" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View> */}

      {/* App Version Footer */}
      <View className="items-center mb-6">
        <Text className="text-footnote text-gray-500">App Version {Constants.expoConfig.version}</Text>
      </View>
    </ScrollView>
  );
}

// Reusable Option Row
const SettingOption = ({ icon, text, onPress = () => {}, color = "black" }) => (
  <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-200" onPress={onPress}>
    <Ionicons name={icon} size={22} color={color} className="mr-3" />
    <Text className={`text-body ml-2 ${color === "red" ? "text-red-600" : "text-gray-800"}`}>{text}</Text>
  </TouchableOpacity>
);
