import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log({ email, password });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-end px-10 mb-10">
        <View className="">
          <Text className="text-title-2 font-semibold text-center mb-10">
            Please Login for service of university buses
          </Text>
          <Text className="text-body text-center text-gray-500 mb-10">Enter you registered email and password</Text>
        </View>

        <View className="">
          <View className="my-3">
            <View className="flex-row items-center gap-2 ">
              <MaterialCommunityIcons name="email-outline" size={24} color="black" />
              <Text className="text-lg font-semibold mb-2">Email Address</Text>
            </View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              className="border border-gray-300 rounded-xl px-5 py-3"
            />
          </View>
          <View className="my-3">
            <View className="flex-row items-center gap-2 ">
              <MaterialIcons name="password" size={24} color="black" />
              <Text className="text-lg font-semibold mb-2">Password</Text>
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              className="border border-gray-300 rounded-xl px-5 py-3"
            />
          </View>
          <View className="">
            <TouchableOpacity className="w-full bg-tertiary-900 p-3 rounded-xl my-2">
              <Text className="text-body text-center text-white"> Login </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
