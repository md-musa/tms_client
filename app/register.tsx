import { View, Text, TextInput, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Register = () => {
  const [name, setName] = useState("");
  const [route, setRoute] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log({ name, route, role, email, password });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-end bg-white h-full w-full">
        <View className="bg-white p-10">
          <Text className="text-lg font-semibold mb-2">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            className="border border-gray-300 rounded-lg p-3 mb-4"
          />

          <Text className="text-lg font-semibold mb-2">Route</Text>
          <View className="border border-gray-300 rounded-lg mb-4">
            <Picker
              selectedValue={route}
              onValueChange={(itemValue) => setRoute(itemValue)}
            >
              <Picker.Item label="Select a route" value="" />
              <Picker.Item label="Route 1" value="route1" />
              <Picker.Item label="Route 2" value="route2" />
              <Picker.Item label="Route 3" value="route3" />
            </Picker>
          </View>

          <Text className="text-lg font-semibold mb-2">Role</Text>
          <View className="border border-gray-300 rounded-lg mb-4">
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="Select a role" value="" />
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Faculty" value="faculty" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
          </View>

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

          <Button title="Register" onPress={handleRegister} color="#4F46E5" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
