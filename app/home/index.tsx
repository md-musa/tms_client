import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import busImage from "@/assets/images/bug_front.png";
import MapView, { Marker } from "react-native-maps";
import { TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/config/axiosConfig";
import { getSchedulesByRoute } from "@/services/scheduleService";
// import { parse, isAfter, compareAsc } from "date-fns"; 

export default function Index() {
  const { userData } = useAuth();
  const [route, setRoute] = useState(userData.user.routeId._id);
  const [availRoutes, setAvailRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("DSC to Uttara");
  const [schedules, setSchedules] = useState([]);
  const [schedulesTem, setSchedulesTem] = useState([
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

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await apiClient.get("/routes");
        setAvailRoutes(res.data.data);
      } catch (err) {
        console.error("API Error:", err.message);
        console.log(err);
      }
    };

    fetchRoutes();
  }, []);

  // Function to find the next schedule
  // const findNextSchedule = (scheduleList) => {
  //   const currentTime = new Date();

  //   // Parse times and sort schedules
  //   const sortedSchedules = [...scheduleList].sort((a, b) =>
  //     compareAsc(parse(a.time, "HH:mm", currentTime), parse(b.time, "HH:mm", currentTime))
  //   );

  //   // Find the first schedule that is after the current time
  //   return sortedSchedules.find((schedule) => isAfter(parse(schedule.time, "HH:mm", currentTime), currentTime)) || null; // Return null if no upcoming schedule is found
  // };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const today = new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        console.log("routeId =", route, "today =", today);

        const { data } = await apiClient.get(`/schedules/get-single-route-schedule`, {
          params: { routeId: route, day: today },
        });

        console.log("Schedules data", data);
      } catch (err) {
        console.log(err);
      }
    };

    if (route) fetchSchedules();
  }, [route]);

  const filteredSchedules = schedulesTem.find((schedule) => schedule.route === selectedRoute)?.buses;

  return (
    <ScrollView className="bg-[#f4f4f4] h-full">
      <Header />
      {/* Next buses */}

      <View className="bg-primary-1000 p-4 mx-2 rounded-md">
        {/* Select route */}
        <View className="flex flex-row items-center bg-white border border-gray-300 rounded-xl px-4">
          <Image source={busImage} resizeMode="contain" style={{ width: 30, height: 30 }} />
          {/* <Picker
            selectedValue={route}
            onValueChange={(itemValue) => setRoute(itemValue)}
            
          ></Picker> */}

          <Picker
            selectedValue={route}
            onValueChange={(itemValue) => setRoute(itemValue)}
            style={{ flex: 1, backgroundColor: "white" }}
          >
            <Picker.Item label="Select a route" value="" />
            {availRoutes?.map((route) => (
              <Picker.Item key={route._id} label={`${route.startLocation} <> ${route.endLocation}`} value={route._id} />
            ))}
          </Picker>
        </View>
        {/* Recent bus schedule */}
        <View className="mt-2">
          <Text className="py-1 mb-4 px-4 w-36 rounded-md text-white bg-gray-50/30 text-md">Next bus time</Text>
          <View className="flex-row justify-between">
            <Text className="text-white text-lg">Campus to Uttara</Text>
            <Text className="text-white text-2xl font-semibold">01:00PM</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-white text-lg">Uttara to Campus</Text>
            <Text className="text-white text-2xl font-semibold">02:30PM</Text>
          </View>
        </View>
      </View>

      <View className="h-full rounded-md p-2 bg-tertiary-700">
        {/* Map */}
        <View className="relative h-1/3 rounded-lg overflow-hidden shadow-lg border border-primary-600">
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
          <View className="absolute top-3 left-3 bg-black/50 px-3 py-1 rounded-lg">
            <Text className="text-white text-sm">Watching: {100}</Text>
          </View>

          {/* Route Name Label */}

          <View className="absolute bottom-3 right-3 bg-white/90 px-3 py-2 rounded-lg">
            <Text className="text-black text-base">Tap to Track</Text>
          </View>
          <View className="absolute bottom-2 left-2 bg-black/75 px-1 rounded-lg flex-row items-center">
            <Ionicons name="bus" size={16} color="white" style={{ marginRight: 4 }} />
            <Text className="text-white text-sm">2 Bus available</Text>
          </View>

          {/* Fullscreen Icon */}
          {/* <TouchableOpacity className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg">
                <Ionicons name="expand" size={24} color="black" />
              </TouchableOpacity> */}
        </View>

        {/* Bus Schedules */}
        <View className="h-full rounded-md mt-2 bg-tertiary-900 p-4">
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

          <ScrollView>
            <View>
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
                      {/* <View className="flex-row gap-2 bg-gray-200 px-2 rounded-full mt-2">
                      <Image
                        source={busImage}
                        className="bg-gray-200"
                        style={{ width: 25, height: 25, borderRadius: 20 }}
                      />
                      <Text className="text-gray-700 font-semibold ml-2">{bus.sharedBy.name}</Text>
                    </View> */}
                    </View>
                    <View className="mt-2 h-full">
                      {/* <View className="">
                      <Text className="text-gray-800 text-md">
                        Time Left:{"\n"} {bus.timeLeft}
                      </Text>
                    </View> */}
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
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}
