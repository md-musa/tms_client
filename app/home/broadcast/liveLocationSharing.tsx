import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

export default function LiveLocationSharing() {
  const [watchingCount, setWatchingCount] = useState(25); // Example count
  const [routeName, setRouteName] = useState("Campus to Uttara");
  const [busName, setBusName] = useState("Bus 1");

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Google Map Section */}
      <View className="relative h-2/3 rounded-lg overflow-hidden shadow-lg">
        <MapView
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: 23.8103, // Example location (Dhaka)
            longitude: 90.4125,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {/* Bus Marker */}
          <Marker coordinate={{ latitude: 23.8103, longitude: 90.4125 }} title="Bus Location" />
        </MapView>

        {/* Watching Count Label */}
        <View className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-lg">
          <Text className="text-white text-sm">Watching: {watchingCount}</Text>
        </View>

        {/* Route Name Label */}
        <View className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-lg">
          <Text className="text-white text-sm">{routeName}</Text>
        </View>

        {/* Fullscreen Icon */}
        <TouchableOpacity className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg">
          <Ionicons name="expand" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Route Details */}
      <View className="bg-white p-4 mt-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-gray-800">Route: {routeName}</Text>
        <Text className="text-md text-gray-600 mt-1">Bus: {busName}</Text>
      </View>

      {/* Stop Location Sharing Button */}
      <TouchableOpacity className="bg-red-600 py-3 rounded-xl shadow-lg mt-6">
        <Text className="text-white text-center font-semibold text-lg">Stop Location Sharing</Text>
      </TouchableOpacity>
    </View>
  );
}
