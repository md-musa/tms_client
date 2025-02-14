import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Linking } from "react-native";
import { Link } from "expo-router";

export default function BroadcastBusLocation() {
  const [busType, setBusType] = useState("");
  const [routeType, setRouteType] = useState("");
  const [busName, setBusName] = useState("");

  return (
    <View className="flex-1 bg-gray-100 p-5">
      {/* Header Image */}
      <Image
        source={{
          uri: "https://png.pngtree.com/png-clipart/20230802/original/pngtree-school-bus-tracking-software-picture-image_7832713.png",
        }}
        className="w-full h-1/3 rounded-xl mb-6"
      />

      {/* Heading */}
      <Text className="text-xl font-bold text-center text-gray-800 mb-6">Help others to watch bus locations</Text>

      {/* Select route */}
      <View className="flex-row justify-between mb-4 bg-white  rounded-lg shadow-md">
        <Picker selectedValue={routeType} onValueChange={(value) => setRouteType(value)} style={{ flex: 1 }}>
          <Picker.Item label="Select Route" value="" />
          <Picker.Item label="Campus to Uttara" value="campusToX" />
          <Picker.Item label="Uttara to Campus" value="xToCampus" />
        </Picker>
      </View>
      {/* Bus Type Selection */}
      <View className="flex-row justify-between mb-4 bg-white rounded-lg shadow-md">
        <Picker selectedValue={routeType} onValueChange={(value) => setRouteType(value)} style={{ flex: 1 }}>
          <Picker.Item label="Select Bus Type" value="" />
          <Picker.Item label="Student bus" value="campusToX" />
          <Picker.Item label="Faculty bus" value="xToCampus" />
        </Picker>
      </View>

      {/* Bus Name Selection */}
      <View className="bg-white rounded-lg shadow-md mb-6">
        <Picker selectedValue={busName} onValueChange={(value) => setBusName(value)}>
          <Picker.Item label="Select Bus" value="" />
          <Picker.Item label="Bus 1" value="bus1" />
          <Picker.Item label="Bus 2" value="bus2" />
          <Picker.Item label="Bus 3" value="bus3" />
        </Picker>
      </View>

      {/* Share Location Button */}

      <Link
        href="/home/broadcast/liveLocationSharing"
        className="bg-gray-200 border border-gray-300 text-primary-900 px-5 py-3 font-semibold text-center rounded-full"
      >
        Share bus location
      </Link>
    </View>
  );
}
