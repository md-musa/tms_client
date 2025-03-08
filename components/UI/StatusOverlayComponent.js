import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default StatusOverlayComponent = ({ currentlyConnectedUserCount, activeBuses }) => {
  return (
    <View className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-lg text-white">
      <View className="flex flex-row items-center">
        <Ionicons name="eye" size={12} color="white" style={{ marginRight: 4 }} />
        <Text className="text-white text-sm">{currentlyConnectedUserCount} Watching</Text>
      </View>

      <View className="flex flex-row items-center">
        <Ionicons name="bus" size={12} color="white" style={{ marginRight: 4 }} />
        <Text className="text-white text-sm">{Object.keys(activeBuses).length} Buses</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
});
