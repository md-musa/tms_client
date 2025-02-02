import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log({ email, password });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-end">
        <View className="bg-white p-10 mb-5">
          <Text className="text-lg font-semibold mb-2">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />

          <Text className="text-lg font-semibold mb-2">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />

          <Button title="Login" onPress={handleLogin} color="#4F46E5" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
