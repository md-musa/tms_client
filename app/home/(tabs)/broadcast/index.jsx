import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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
  const [selectedBus, setSelectedBus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableBuses, setAvailableBuses] = useState([]);
  useEffect(() => {
    apiClient
      .get("/buses")
      .then((response) => {
        console.log("Buses=", JSON.stringify(response.data, null, 2));
        setAvailableBuses(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching buses", error);
      });
  }, []);

  //console.log(JSON.stringify(availableBuses, null, 1));

  const handleStartSharing = async () => {
    if (!selectedBus || !busType) {
      alert("Please select a bus and bus type.");
      return;
    }
    console.log(JSON.stringify(userData, null, 2));
    const res = await apiClient.post("/trips", {
      routeId: userData.route._id,
      hostId: userData.userId,
      busName: selectedBus.name,
      busType: busType,
    });
    console.log("Response:", JSON.stringify(res.data, null, 2));
    if (res.data.success) {
      console.log("Trip created successfully");
      setBroadcastData({ bus: selectedBus, busType, tripId: res.data.data._id });
      navigation.navigate("liveLocationSharing");
    } else {
      console.log("Error creating trip");
    }

    console.log("Selected Bus:", selectedBus);
    console.log("Bus Type:", busType);
  };
  if (availableBuses.length === 0) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Location Sharing</Text>

      {/* Bus Search and Select */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Bus</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a bus..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView style={styles.busList}>
          {availableBuses.map((bus) => (
            <TouchableOpacity
              key={bus._id}
              style={[styles.busItem, selectedBus._id === bus._id && styles.selectedBusItem]}
              onPress={() => setSelectedBus(bus)}
            >
              <Text className="" style={styles.busText}>
                {bus.name}
              </Text>
              {selectedBus._id === bus._id && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bus Type Select */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bus Type</Text>
        <View style={styles.selectContainer}>
          <TouchableOpacity
            style={[styles.selectOption, busType === "student" && styles.selectedOption]}
            onPress={() => setBusType("student")}
          >
            <Text style={styles.selectText}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectOption, busType === "employee" && styles.selectedOption]}
            onPress={() => setBusType("employee")}
          >
            <Text style={styles.selectText}>Employee</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Start Sharing Button */}
      <Button title="Start Sharing" onPress={handleStartSharing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#555",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  busList: {
    maxHeight: 150,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  busItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedBusItem: {
    backgroundColor: "#f0f0f0",
  },
  busText: {
    fontSize: 14,
    color: "#333",
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  selectOption: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedOption: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  selectText: {
    fontSize: 14,
    color: "#333",
  },
});

export default Index;
