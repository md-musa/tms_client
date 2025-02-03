import { View, Text, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import coverImage from "@/assets/images/start_coverpage.jpg";

const Start = () => {
  return (
    <SafeAreaView>
      <View className="h-full w-full">
        <Image source={coverImage} className="w-full h-1/4" />

        <Text className="text-2xl text-primary-900 font-semibold text-center my-10">Welcome to TMS</Text>
        <Text className="text-2xl text-black-400 font-semibold text-center capitalize px-5">
          Let's make you life easier with our transportation management system
        </Text>

        <View className="mt-32">
          <View className="flex justify-center my-5 mx-14">
            <Link href="/login" className="bg-primary-900 text-white px-5 py-3 font-semibold text-center rounded-full">
              Login
            </Link>
          </View>
          <View className="flex justify-center mx-10">
            <Link
              href="/register"
              className="bg-gray-200 border border-gray-300 text-primary-900 px-5 py-3 font-semibold text-center rounded-full"
            >
              Create an Account
            </Link>
          </View>

          <Link
              href="/home"
              className="bg-gray-200 border border-gray-300 text-primary-900 px-5 py-3 font-semibold text-center rounded-full"
            >
              Homepage
            </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Start;
