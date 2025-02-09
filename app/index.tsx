import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import coverImage from "@/assets/images/login_bg.png";
const Start = () => {
  return (
    
    <SafeAreaView className="flex justify-end h-full">
      <Image source={coverImage} className="w-2/3 h-[33%] mx-auto rounded-full mt-5" />

      <Text className="text-2xl text-slate-900 font-semibold text-center mt-16 mb-4 px-5">
        Daffodil International University bus tracking app
      </Text>
      <Text className="text-footnote text-gray-600 text-center px-8">
        Getting your dat to day bus tracking update is now just a matter of some clicks!
      </Text>

      <View className="mt-20">
        <Link
          href="/login"
          className="my-2 flex-row text-center items-center justify-center border-2 border-tertiary-300 shadow-sm bg-tertiary-900 py-3 px-8 rounded-full mx-6"
        >
          <Text className="text-white text-lg font-semibold ml-2">Login</Text>
        </Link>
        <Link
          href="/register"
          className="my-2 flex-row text-center items-center justify-center border-2 border-tertiary-300 shadow-sm bg-tertiary-900 py-3 px-8 rounded-full mx-6"
        >
          <Text className="text-white text-lg font-semibold ml-2">Registration</Text>
        </Link>

        <Link
          href="/home"
          className="bg-gray-200 my-5 mx-5 border border-gray-300 text-primary-900 px-5 py-3 font-semibold text-center rounded-full"
        >
          <Text>Homepage</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Start;
