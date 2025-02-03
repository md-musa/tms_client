import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-end px-10 mb-10">
        <View className="mb-6">
          <Text className="text-title-2 font-semibold text-center mb-4">Create an Account</Text>
          <Text className="text-body text-center text-gray-500 mb-6">Enter your details to register</Text>
        </View>

        <View className="">
          {/* Name Input */}
          <View className="my-3">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="person-outline" size={22} color="black" />
              <Text className="text-md ">Full Name</Text>
            </View>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              className="border border-gray-300 rounded-xl px-5 py-3"
            />
          </View>

          {/* Route Picker */}
          <View className="my-3">
            <View className="flex-row items-center gap-2 mb-2">
              <FontAwesome5 name="route" size={22} color="black" /> <Text className="text-md">Route</Text>
            </View>
            <View className="border border-gray-300 rounded-xl">
              <Picker selectedValue={route} onValueChange={(itemValue) => setRoute(itemValue)} className="">
                <Picker.Item label="Select a route" value="" />
                <Picker.Item label="Route 1" value="route1" />
                <Picker.Item label="Route 2" value="route2" />
                <Picker.Item label="Route 3" value="route3" />
              </Picker>
            </View>
          </View>

          {/* Role Picker */}
          <View className="my-3">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="person-add-outline" size={22} color="black" />
              <Text className="text-md ">Role</Text>
            </View>
            <View className="border border-gray-300 rounded-xl">
              <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)} className="">
                <Picker.Item label="Select a role" value="" />
                <Picker.Item label="Student" value="student" />
                <Picker.Item label="Faculty" value="faculty" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>
          </View>

          {/* Email Input */}
          <View className="my-3">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialCommunityIcons name="email-outline" size={22} color="black" />
              <Text className="text-md ">Email Address</Text>
            </View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              className="border border-gray-300 rounded-xl px-5 py-3"
            />
          </View>

          {/* Password Input */}
          <View className="my-3">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="lock-outline" size={22} color="black" />
              <Text className="text-md ">Password</Text>
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              className="border border-gray-300 rounded-xl px-5 py-3"
            />
          </View>

          {/* Register Button */}
          <View className="my-3">
            <TouchableOpacity onPress={handleRegister} className="w-full bg-tertiary-900 p-3 rounded-xl">
              <Text className="text-body text-center text-white">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
