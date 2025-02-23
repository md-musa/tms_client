import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MapComponent from "@/components/MapComponent";
import StatusOverlayComponent from "@/components/UI/StatusOverlayComponent";

const MapSection = ({ location, zoom, recenterMap, userData, activeBuses, setZoom, currentlyConnectedUserCount }) => {
  const router = useRouter();

  return (
    <View className="flex-1 relative mt-4 mx-2 rounded-md overflow-hidden">
      <MapComponent
        location={location}
        zoom={zoom}
        recenterMap={recenterMap}
        userData={userData}
        activeBuses={activeBuses}
        setZoom={setZoom}
      />
      <StatusOverlayComponent currentlyConnectedUserCount={currentlyConnectedUserCount} activeBuses={activeBuses} />

      <TouchableOpacity
        className="absolute bottom-3 right-3 bg-white rounded-full shadow-lg flex-row p-2 items-center justify-center"
        onPress={() => router.push("/home/watchBusLocation")}
      >
        <Text className="text-black text-base mx-2">Tap to Track</Text>
        <Ionicons name="expand" size={22} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default MapSection;
