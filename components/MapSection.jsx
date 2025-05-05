import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MapComponent from "@/components/MapComponent";
import StatusOverlayComponent from "@/components/UI/StatusOverlayComponent";

const MapSection = ({ location, zoom, recenterMap, userData, activeBuses, setZoom, currentlyConnectedUserCount }) => {
  const router = useRouter();
  const mapRef = useRef(null);

  const centerToUserLocation = () => {
    setZoom(13);
    mapRef.current?.setCamera({
      center: [location.longitude, location.latitude] || [90.4125, 23.8103], // Default to Dhaka coordinates if location is not available
      zoom: 12,
      animationDuration: 500, // Smooth animation in ms
    });
  };

  return (
    <View className="flex-1 relative mt-4 mx-2 rounded-md overflow-hidden border border-gray-300">
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
        className="absolute bottom-20 right-3 bg-white  border border-gray-300 rounded-full shadow flex-row p-3 items-center justify-center"
        onPress={centerToUserLocation}
      >
        {/* <Text className="text-black text-base mx-2"></Text> */}
        <Ionicons name="locate" size={25} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        className="absolute bottom-6 right-3 bg-white border border-gray-300 rounded-full shadow-lg flex-row p-2 items-center justify-center"
        onPress={() => router.push("/home/watchBusLocation")}
      >
        <Text className="text-black text-base mx-2">Full Screen</Text>
        <Ionicons name="expand" size={22} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default MapSection;
