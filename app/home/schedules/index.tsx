import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
// import { Ionicons } from "@expo/vector-icons";

const BusSchedule = () => {
  const [selectedRoute, setSelectedRoute] = useState("Route 1");
  const [selectedFilter, setSelectedFilter] = useState("All"); // Filter for Student, Faculty, or All

  // Dummy Bus Schedule Data
  const scheduleData = [
    { id: "1", time: "08:00 AM", buses: "Bus 1 & 2", type: "Student", route: "Campus to Destination1" },
    { id: "2", time: "10:00 AM", buses: "Bus 1 & 2", type: "Faculty", route: "Destination1 to Campus", active: true },
    { id: "3", time: "01:00 PM", buses: "Bus 1 & 2", type: "Student", route: "Campus to Destination1" },
    { id: "4", time: "03:00 PM", buses: "Bus 1", type: "Faculty", route: "Destination1 to Campus" },
    { id: "5", time: "05:00 PM", buses: "Bus 1 & 2", type: "Student", route: "Campus to Destination1" },
    { id: "6", time: "05:00 PM", buses: "Bus 1 & 2", type: "Student", route: "Campus to Destination1" },
  ];

  // Filtering Schedule Data
  const filteredData = scheduleData.filter((item) => (selectedFilter === "All" ? true : item.type === selectedFilter));

  return (
    <View className="flex-1 bg-white p-4">
      {/* View Stoppage Button */}
      <View className="mt-4">
        <TouchableOpacity className="bg-indigo-500 p-3 rounded-lg">
          <Text className="text-white text-center font-semibold">View Bus Stoppage Points</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-tertiary-900 rounded-3xl my-4 p-1">
        {/* Date & Route Selector */}
        <View className="mt-4 flex-row justify-between items-center px-4">
          <Text className="text-lg font-semibold text-white">Sunday, 03 June 2020</Text>
          <View className="bg-primary-1000 text-white rounded-md">
            <Picker
              className="bg-white h-50 h-80 text-white"
              selectedValue={selectedRoute}
              style={{ height: 50, width: 150, color: "white", fontWeight: "semibold", borderBlockColor: "#ffff" }}
              onValueChange={(itemValue) => setSelectedRoute(itemValue)}
            >
              <Picker.Item label="Route 1" value="Route 1" />
              <Picker.Item label="Route 2" value="Route 2" />
            </Picker>
          </View>
        </View>

        <View className="bg-white p-4 my-4 rounded-xl">
          {/* Student, Faculty, All Filter */}
          <View className="flex-row justify-around rounded-md">
            <TouchableOpacity
              className={`px-6 py-2 rounded-lg ${selectedFilter === "All" ? "bg-indigo-500" : "bg-gray-300"}`}
              onPress={() => setSelectedFilter("All")}
            >
              <Text className="text-white font-semibold">All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-6 py-2 rounded-lg ${selectedFilter === "Student" ? "bg-indigo-500" : "bg-gray-300"}`}
              onPress={() => setSelectedFilter("Student")}
            >
              <Text className="text-white font-semibold">Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-6 py-2 rounded-lg ${selectedFilter === "Faculty" ? "bg-indigo-500" : "bg-gray-300"}`}
              onPress={() => setSelectedFilter("Faculty")}
            >
              <Text className="text-white font-semibold">Faculty</Text>
            </TouchableOpacity>
          </View>

          {/* Bus Schedule List */}
          <ScrollView className="mt-4">
            <View className="">
              <Text className="font-semibold px-4 py-2 bg-primary-200 text-primary-1000 rounded-md w-44 my-2">Route to Campus</Text>
              {filteredData.map((item) => (
                <View
                  key={item.id}
                  className={`p-3 my-1 rounded-lg border ${
                    item.active ? "bg-indigo-100 border-indigo-500" : "border-gray-300"
                  }`}
                >
                  <View className="flex-row justify-between">
                    <Text className={`text-lg ${item.active ? "font-bold text-indigo-600" : "text-gray-700"}`}>
                      {item.time} {item.active && "(Active)"}
                    </Text>
                    <Text className="text-sm text-purple-900 bg-purple-100 border border-purple-400 shadow-md px-4 rounded-full py-1">
                      {item.type}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View className="">
              <Text className="font-semibold px-4 py-2 bg-primary-200 text-primary-1000 rounded-md w-44 mt-5">Route to Campus</Text>
              {filteredData.map((item) => (
                <View
                  key={item.id}
                  className={`p-3 my-1 rounded-lg border ${
                    item.active ? "bg-indigo-100 border-indigo-500" : "border-gray-300"
                  }`}
                >
                  <View className="flex-row justify-between">
                    <Text className={`text-lg ${item.active ? "font-bold text-indigo-600" : "text-gray-700"}`}>
                      {item.time} {item.active && "(Active)"}
                    </Text>
                    <Text className="text-sm text-purple-900 bg-purple-100 border border-purple-400 px-4 rounded-full py-1">
                      {item.type}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Bottom Navigation */}
      {/* <View className="absolute bottom-0 left-0 right-0 bg-white p-4 flex-row justify-around border-t">
        <Ionicons name="home-outline" size={24} color="gray" />
        <Ionicons name="bus-outline" size={24} color="black" />
        <Ionicons name="notifications-outline" size={24} color="gray" />
        <Ionicons name="person-outline" size={24} color="gray" />
      </View> */}
    </View>
  );
};

export default BusSchedule;
