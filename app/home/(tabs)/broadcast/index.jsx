import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import apiClient from "@/config/axiosConfig";
import { useBroadcast } from "@/contexts/BroadcastContext";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { setBroadcastData } = useBroadcast();
  const { userData } = useAuth();
  const navigation = useNavigation();
  const [busType, setBusType] = useState("");
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [note, setNote] = useState("");
  const [availableBuses, setAvailableBuses] = useState([]);
  const [recentBuses, setRecentBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBuses = async () => {
      try {
        const response = await apiClient.get("/buses");
        setAvailableBuses(response.data.data);
      } catch (error) {
        console.error("Error loading buses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBuses();
  }, []);

  const filteredBuses = availableBuses
    .filter((bus) => bus.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const isValid = selectedBus && busType;

  const handleStartSharing = async () => {
    if (!isValid) {
      Alert.alert("Incomplete Information", "Please select a bus and bus type.");
      return;
    }

    Alert.alert("Confirm Sharing", `Start sharing location of ${selectedBus.name} bus for ${busType}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            const res = await apiClient.post("/trips", {
              routeId: userData.route._id,
              hostId: userData.userId,
              busName: selectedBus.name,
              busType: busType,
              note: note,
            });

            if (res.data.success) {
              setBroadcastData({
                bus: selectedBus,
                busType,
                tripId: res.data.data._id,
                note,
              });
              navigation.navigate("liveLocationSharing");
            }
          } catch (error) {
            console.error("Error creating trip:", error);
            Alert.alert("Error", "Failed to start sharing. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="p-3">
        {/* Header */}
        <View className="mb-3 items-center">
          <Text className="text-xl font-semibold text-gray-900 mb-1">Start Location Sharing</Text>
          <Text className="text-sm text-gray-600">Select your bus and start broadcasting</Text>
        </View>

        {/* Bus Search */}
        <View className="bg-white rounded-lg p-4 mb-2 shadow-md border border-gray-200">
          <Text className="text-base font-semibold text-gray-900 mb-3">Search bus by name</Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg border border-gray-300 px-3 mb-3">
            <Ionicons name="search" size={20} color="#828282" className="mr-2" />
            <TextInput
              className="flex-1 h-10 text-gray-900"
              placeholder="Search buses..."
              placeholderTextColor="#828282"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Bus List */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#00C89B" className="mt-4" />
          ) : (
            <ScrollView className="max-h-72" nestedScrollEnabled>
              {filteredBuses.length > 0 ? (
                filteredBuses.map((bus) => {
                  const isSelected = selectedBus?._id === bus._id;
                  return (
                    <TouchableOpacity
                      key={bus._id}
                      className={`py-2 px-2 mt-1 border-b border-gray-300 ${
                        isSelected ? "bg-green-100 border border-green-300 rounded-md" : ""
                      }`}
                      onPress={() => setSelectedBus(bus)}
                    >
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="bus" size={20} color={isSelected ? "#00C89B" : "#828282"} />
                        <Text className="flex-1 text-base text-gray-900 ml-3 capitalize">{bus.name}</Text>

                        {isSelected && <Ionicons name="checkmark-circle" size={20} color="#00C89B" />}
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text className="text-center p-4 text-gray-600">No buses found</Text>
              )}
            </ScrollView>
          )}
        </View>

        {/* Bus Type Select */}
        <View className="bg-white rounded-lg p-4 mb-2 shadow-md border border-gray-200">
          <Text className="text-base font-semibold text-gray-900 mb-3">Bus Type</Text>
          <View className="flex-row justify-between">
            {["student", "employee"].map((type) => (
              <TouchableOpacity
                key={type}
                className={`flex-1 p-3 mx-1 rounded-lg items-center ${
                  busType === type ? "bg-green-100 border border-green-600" : "bg-gray-100"
                }`}
                onPress={() => setBusType(type)}
              >
                <Text className={`text-sm font-medium ${busType === type ? "text-green-600" : "text-gray-900"}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Note */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-200">
          <Text className="text-base font-semibold text-gray-900 mb-3">Additional Note (Optional)</Text>
          <TextInput
            className="min-h-14 border border-gray-300 rounded-lg p-3 text-gray-900"
            placeholder="Any special instructions?"
            placeholderTextColor="#828282"
            multiline
            numberOfLines={2}
            value={note}
            onChangeText={setNote}
          />
        </View>
      </ScrollView>

      {/* Start Button Fixed at Bottom */}
      <View className="absolute bottom-8 left-5 right-5">
        <TouchableOpacity
          className={`rounded-lg p-3 items-center justify-center ${isValid ? "bg-green-600" : "bg-gray-500"}`}
          onPress={handleStartSharing}
          disabled={!isValid}
        >
          <Text className="text-white text-base font-bold">
            <Ionicons name="location" size={18} color="white" /> Start Sharing
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Index;
