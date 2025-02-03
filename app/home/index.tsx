import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import busImage from "@/assets/images/bug_front.png";
import MapView, { Marker } from "react-native-maps";
import { TouchableOpacity, ScrollView } from "react-native";

export default function Index() {
  const [route, setRoute] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("DSC to Uttara");
  const [schedules, setSchedules] = useState([
    {
      route: "DSC to Uttara",
      buses: [
        {
          name: "Bus 1",
          number: "123",
          status: "Scheduled",
          startTime: "01:00PM",
          timeLeft: "10 mins",
          sharedBy: {
            name: "John Doe",
            profilePic: "https://example.com/john.jpg",
          },
        },
        {
          name: "Bus 1",
          number: "123",
          status: "Scheduled",
          startTime: "01:00PM",
          timeLeft: "10 mins",
          sharedBy: {
            name: "John Doe",
            profilePic: "https://example.com/john.jpg",
          },
        },
        {
          name: "Bus 1",
          number: "123",
          status: "Scheduled",
          startTime: "01:00PM",
          timeLeft: "10 mins",
          sharedBy: {
            name: "John Doe",
            profilePic: "https://example.com/john.jpg",
          },
        },
        {
          name: "Bus 1",
          number: "123",
          status: "Scheduled",
          startTime: "01:00PM",
          timeLeft: "10 mins",
          sharedBy: {
            name: "John Doe",
            profilePic: "https://example.com/john.jpg",
          },
        },
        {
          name: "Bus 1",
          number: "123",
          status: "Scheduled",
          startTime: "01:00PM",
          timeLeft: "10 mins",
          sharedBy: {
            name: "John Doe",
            profilePic: "https://example.com/john.jpg",
          },
        },
        // Add more bus schedules here
      ],
    },
    {
      route: "Uttara to DSC",
      buses: [
        {
          name: "Bus 2",
          number: "456",
          status: "Ongoing",
          startTime: "02:30PM",
          timeLeft: "5 mins",
          sharedBy: {
            name: "Jane Smith",
            profilePic: "https://example.com/jane.jpg",
          },
        },
        // Add more bus schedules here
      ],
    },
  ]);

  const filteredSchedules = schedules.find((schedule) => schedule.route === selectedRoute)?.buses;

  return (
    <SafeAreaView>
      <ScrollView>
      <View className="px-2 bg-[#f4f4f4] h-full">
        {/* Next buses */}
        <View className="bg-primary-1000 p-5 rounded-xl">
          {/* Select route */}
          <View className="flex flex-row items-center bg-white border border-gray-300 rounded-xl px-4">
            <Image source={busImage} resizeMode="contain" style={{ width: 30, height: 30, marginRight: 10 }} />
            <Picker
              selectedValue={route}
              onValueChange={(itemValue) => setRoute(itemValue)}
              style={{ flex: 1, backgroundColor: "white" }}
            >
              <Picker.Item label="Select a route" value="" />
              <Picker.Item label="Route 1" value="route1" />
              <Picker.Item label="Route 2" value="route2" />
              <Picker.Item label="Route 3" value="route3" />
            </Picker>
          </View>
          {/* Recent bus schedule */}
          <View className="mt-4">
            <Text className="font-semibold py-2 mt-2 mb-4 px-4 w-40 rounded-md text-white bg-gray-50/30 text-md">
              Next bus time
            </Text>
            <View className="flex-row justify-between">
              <Text className="text-white text-lg">University to Uttara</Text>
              <Text className="text-white text-2xl font-semibold">01:00PM</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-white text-lg">Uttara to University</Text>
              <Text className="text-white text-2xl font-semibold">02:30PM</Text>
            </View>
          </View>
        </View>

        <View className="bg-tertiary-900 h-full rounded-md mt-2 p-2">
          {/* Map */}
          <View className="h-60 rounded-md overflow-hidden">
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 23.8103, // Example: Dhaka, Bangladesh
                longitude: 90.4125,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker coordinate={{ latitude: 23.8103, longitude: 90.4125 }} title="Dhaka" />
            </MapView>
          </View>
          {/* Bus Schedules */}
          <View className="h-full rounded-md mt-2">
            <View className="flex-row justify-around mb-4">
              <TouchableOpacity
                className={`rounded-md px-8 py-3 w-[45%] font-semibold ${
                  selectedRoute === "DSC to Uttara" ? "bg-primary-800" : "bg-white text-black"
                }`}
                onPress={() => setSelectedRoute("DSC to Uttara")}
              >
                <Text className="text-white">DSC to Uttara</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`rounded-md px-8 py-3 w-[45%] font-semibold text-black ${
                  selectedRoute === "Uttara to DSC" ? "bg-primary-800" : "bg-gray-200"
                }`}
                onPress={() => setSelectedRoute("Uttara to DSC")}
              >
                <Text className="text-white">Uttara to DSC</Text>
              </TouchableOpacity>
            </View>
            {filteredSchedules?.map((bus, index) => (
              <View key={index} className="bg-white p-2 mb-4 rounded-md shadow-md">
                <View className="flex-row justify-between items-center">
                  <View>
                    <View className="">
                      <Text className="text-lg font-semibold">{bus.name + bus.number}</Text>
                      <View className="flex-row items-center gap-2 my-1">
                        <Text className="text-gray-800 font-semibold">{bus.startTime}</Text>
                        <Text className="bg-primary-200 text-primary-1000 px-2 rounded-full font-semibold text-[12px] w-22">
                          {bus.status}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row gap-2 bg-gray-200 px-2 rounded-full mt-2">
                      <Image
                        source={busImage}
                        className="bg-gray-200"
                        style={{ width: 25, height: 25, borderRadius: 20 }}
                      />
                      <Text className="text-gray-700 font-semibold ml-2">{bus.sharedBy.name}</Text>
                    </View>
                  </View>
                  <View className="mt-2 h-full">
                    <View className="">
                      <Text className="text-gray-800 text-md">
                        Time Left:{"\n"} {bus.timeLeft}
                      </Text>
                    </View>
                    <View className="flex items-center justify-center mt">
                      <Image
                        source={busImage}
                        className="bg-gray-200"
                        style={{ width: 30, height: 30, borderRadius: 20 }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
