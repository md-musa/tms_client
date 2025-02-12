import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import busImage from "@/assets/images/bug_front.png";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/config/axiosConfig";
import { findOngoingOrNextSchedule } from "@/utils/scheduleHelper";
import { Link } from "expo-router";
import * as MapLibreGL from "@maplibre/maplibre-react-native";
import campusArea from "@/assets/routes/campus.json";
import busMarker from "@/assets/images/bus-marker.png";
import io from "socket.io-client";
import { selectRoutePolyline, generateMarkers } from "@/utils/mappingHelper";

const socket = io("http://192.168.1.14:5000");

export default function Index() {
  const { userData, updateRoute } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(userData?.route);

  const [availRoutes, setAvailRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("DSC to Uttara");
  const [schedules, setSchedules] = useState(null);
  const [currentlyConnectedUserCount, setCurrentlyConnectedUserCount] = useState(0);


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

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const today = new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        console.log("routeId =", currentRoute, "today =", today);

        const { data } = await apiClient.get(`/schedules/get-single-route-schedule`, {
          params: { routeId: currentRoute, day: today },
        });
        setSchedules(data.data);

        // console.log("Schedules data", data);
        console.log("------((((((((Schedules data)))))))-----------\n", JSON.stringify(data, null, 2));
      } catch (err) {
        console.log(err);
      }
    };

    if (currentRoute) fetchSchedules();
  }, [currentRoute]);

  const [busLocations, setBusLocations] = useState({});

  useEffect(() => {
    socket.on("bus-location-update", (data) => {
      if (!data) {
        console.log("⚠ error", data);
        return;
      }
      setBusLocations((prevBuses) => ({
        ...prevBuses,
        [data.bus.id]: data,
      }));
      setCurrentlyConnectedUserCount(data.currentlyConnectedUserCount || 0);
    });

    const joinRoute = (routeId) => {
      if (!routeId) return Alert.alert("Route ID is null");
      socket.emit("join-route", routeId);
      console.log(`Joined route: ${routeId}`);
    };

    if (userData) joinRoute(userData?.route._id);

    return () => {
      socket.off("bus-location-update");
    };
  }, []);

  let toCampusStudent, fromCampusStudent, toCampusFaculty, fromCampusFaculty;
  if (schedules) {
    toCampusStudent = findOngoingOrNextSchedule(schedules.to_campus.student);
    fromCampusStudent = findOngoingOrNextSchedule(schedules.from_campus.student);
    toCampusFaculty = findOngoingOrNextSchedule(schedules.to_campus.faculty);
    fromCampusFaculty = findOngoingOrNextSchedule(schedules.from_campus.faculty);
  }

  const filteredSchedules = schedulesTem.find((schedule) => schedule.route === selectedRoute)?.buses;

  function handleRouteChange(selectedRouteId) {
    const selectedRouteData = availRoutes.filter((r) => r._id == selectedRouteId)[0];
    setCurrentRoute(selectedRouteData);
    updateRoute(selectedRouteData);
  }

  const busesMarkers = generateMarkers(busLocations);

  return (
    <View className="bg-[#e9e9e9] flex-1">
      <View className="bg-primary-1000 p-4 mx-2 rounded-md">
        {/*------- Select route ------------ */}
        <View className="flex flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-1">
          <Image source={busImage} resizeMode="contain" style={{ width: 30, height: 30 }} />

          <Picker
            selectedValue={currentRoute._id}
            onValueChange={(itemValue) => handleRouteChange(itemValue)}
            style={{ flex: 1, backgroundColor: "white", paddingVertical: 0 }}
          >
            <Picker.Item label="Select a route" value="" />
            {availRoutes?.map((route) => (
              <Picker.Item
                key={route?._id}
                label={`${route.startLocation} <> ${route.endLocation}`}
                value={route._id}
              />
            ))}
          </Picker>
        </View>

        <View className="mt-2">
          <Text className="py-1 my-2 px-2 w-44 rounded-md text-white font-semibold bg-gray-50/20 text-md">
            Next Bus Schedule
          </Text>

          {/* Table Header */}
          <View className="flex-row border-b border-white/70 pb-2 mb-2">
            <Text className="text-white text-md font-semibold flex-1">Route</Text>
            <Text className="text-white text-md font-semibold flex-1 text-center">Student</Text>
            <Text className="text-white text-md font-semibold flex-1 text-right">Faculty</Text>
          </View>

          {/* Table Rows */}
          <View className="flex-row border-b border-white/50 pb-2 mb-2">
            <Text className="text-white text-md flex-1">{`${currentRoute?.startLocation} to ${currentRoute?.endLocation}`}</Text>
            <Text className="text-white text-md flex-1 text-center">
              {fromCampusStudent ? `${fromCampusStudent.formattedTime} (${fromCampusStudent.status})` : "No schedule"}
            </Text>
            <Text className="text-white text-md flex-1 text-right">
              {fromCampusFaculty ? `${fromCampusFaculty.formattedTime} (${fromCampusFaculty.status})` : "No schedule"}
            </Text>
          </View>

          <View className="flex-row">
            <Text className="text-white text-md flex-1">{`${currentRoute.endLocation} to ${currentRoute.startLocation}`}</Text>
            <Text className="text-white text-md flex-1 text-center">
              {toCampusStudent ? `${toCampusStudent.formattedTime} (${toCampusStudent.status})` : "No schedule"}
            </Text>
            <Text className="text-white text-md flex-1 text-right">
              {toCampusFaculty ? `${toCampusFaculty.formattedTime} (${toCampusFaculty.status})` : "No schedule"}
            </Text>
          </View>
        </View>

        <Link className="text-right text-white mt-4 text-md font-semibold" href="/home/schedules">
          <Text>View all {">"} </Text>
        </Link>
      </View>

      {/* ----------------- Map ------------------------- */}
      <View className="flex-1 relative mt-4 mx-2 rounded-md overflow-hidden">
        <MapLibreGL.MapView style={styles.map}>
          {/* Camera */}
          <MapLibreGL.Camera
            zoomLevel={11}
            centerCoordinate={[90.34984171243167, 23.859482749844815]} // Center on route start
          />

          {/* OSM Raster Layer */}
          <MapLibreGL.RasterSource
            id="osm"
            tileUrlTemplates={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]}
            tileSize={256}
          >
            <MapLibreGL.RasterLayer id="osmLayer" sourceID="osm" />
          </MapLibreGL.RasterSource>

          {/* Load Marker Image */}
          <MapLibreGL.Images images={{ marker: busMarker }} />

          {/* Polygon Layer */}
          <MapLibreGL.ShapeSource id="polygonSource" shape={campusArea}>
            <MapLibreGL.FillLayer id="polygonLayer" style={{ fillColor: "rgba(255, 0, 100, 0.4)" }} />
          </MapLibreGL.ShapeSource>

          {/* Polyline Layer */}
          <MapLibreGL.ShapeSource id="routeSource" shape={selectRoutePolyline(currentRoute)}>
            <MapLibreGL.LineLayer
              id="routeLayer"
              style={{
                lineColor: "blue",
                lineWidth: 2,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </MapLibreGL.ShapeSource>

          {/* Marker Layer (Added LAST to ensure it's on top) */}
          <MapLibreGL.ShapeSource
            id="busMarkers"
            shape={{
              type: "FeatureCollection",
              features: busesMarkers,
            }}
          >
            <MapLibreGL.SymbolLayer
              id="busMarkerLayer"
              style={{
                iconImage: "marker",
                iconSize: 0.05,
                textField: ["get", "title"],
                textSize: 14,
                textColor: "#000000",
                textHaloColor: "#FFFFFF",
                textHaloWidth: 1,
                textOffset: [0, 1.5],
              }}
            />
          </MapLibreGL.ShapeSource>
        </MapLibreGL.MapView>

        {/* /* Watching Count Label */}
        <View className="absolute top-3 left-3 bg-black/50 px-3 py-1 rounded-lg">
          <Text className="text-white text-sm">Watching: {currentlyConnectedUserCount}</Text>
        </View>

        {/* /* Route Name Label */}
        <View className="absolute bottom-2 left-2 bg-black/75 px-1 rounded-lg flex-row items-center">
          <Ionicons name="bus" size={16} color="white" style={{ marginRight: 4 }} />
          <Text className="text-white text-sm">{busesMarkers.length} Buses available</Text>
        </View>

        {/* /* Fullscreen Icon */}

        <TouchableOpacity className="absolute flex-row px-2 bottom-3 right-3 bg-white p-2 rounded-full shadow-lg">
          <Text className="text-black text-base mx-2">Tap to Track</Text>
          <Ionicons name="expand" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    height: "100%",
  },
});






// const [schedulesTem, setSchedulesTem] = useState([
//   {
//     route: "DSC to Uttara",
//     buses: [
//       {
//         name: "Bus 1",
//         number: "123",
//         status: "Scheduled",
//         startTime: "01:00PM",
//         timeLeft: "10 mins",
//         sharedBy: {
//           name: "John Doe",
//           profilePic: "https://example.com/john.jpg",
//         },
//       },
//       {
//         name: "Bus 1",
//         number: "123",
//         status: "Scheduled",
//         startTime: "01:00PM",
//         timeLeft: "10 mins",
//         sharedBy: {
//           name: "John Doe",
//           profilePic: "https://example.com/john.jpg",
//         },
//       },
//       {
//         name: "Bus 1",
//         number: "123",
//         status: "Scheduled",
//         startTime: "01:00PM",
//         timeLeft: "10 mins",
//         sharedBy: {
//           name: "John Doe",
//           profilePic: "https://example.com/john.jpg",
//         },
//       },
//       {
//         name: "Bus 1",
//         number: "123",
//         status: "Scheduled",
//         startTime: "01:00PM",
//         timeLeft: "10 mins",
//         sharedBy: {
//           name: "John Doe",
//           profilePic: "https://example.com/john.jpg",
//         },
//       },
//       {
//         name: "Bus 1",
//         number: "123",
//         status: "Scheduled",
//         startTime: "01:00PM",
//         timeLeft: "10 mins",
//         sharedBy: {
//           name: "John Doe",
//           profilePic: "https://example.com/john.jpg",
//         },
//       },
//       // Add more bus schedules here
//     ],
//   },
//   {
//     route: "Uttara to DSC",
//     buses: [
//       {
//         name: "Bus 2",
//         number: "456",
//         status: "Ongoing",
//         startTime: "02:30PM",
//         timeLeft: "5 mins",
//         sharedBy: {
//           name: "Jane Smith",
//           profilePic: "https://example.com/jane.jpg",
//         },
//       },
//       // Add more bus schedules here
//     ],
//   },
]);
{
  /* Watching Count Label */
}
{
  /* <View className="absolute top-3 left-3 bg-black/50 px-3 py-1 rounded-lg">
              <Text className="text-white text-sm">Watching: {100}</Text>
            </View> */
}

{
  /* Route Name Label */
}

{
  /* <View className="absolute bottom-3 right-3 bg-white/90 px-3 py-2 rounded-lg">
              <Text className="text-black text-base">Tap to Track</Text>
            </View>
            <View className="absolute bottom-2 left-2 bg-black/75 px-1 rounded-lg flex-row items-center">
              <Ionicons name="bus" size={16} color="white" style={{ marginRight: 4 }} />
              <Text className="text-white text-sm">2 Bus available</Text>
            </View> */
}

{
  /* Fullscreen Icon */
}
{
  /* <TouchableOpacity className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg">
                <Ionicons name="expand" size={24} color="black" />
              </TouchableOpacity> */
}

{
  /* <View className="h-full rounded-md p-2 bg-tertiary-700 mx-2 mt-2"> */
}
{
  /* -------------- Map -------------------- */
}

{
  /* Bus Schedules */
}
{
  /* <View className="h-full rounded-md mt-2 bg-tertiary-900 p-4">
            <View className="flex-row justify-around mb-4">
              <TouchableOpacity
                className={`rounded-md px-8 py-3 w-[45%] font-semibold ${
                  selectedRoute === "DSC to Uttara" ? "bg-primary-800" : "bg-white text-black"
                }`}
                onPress={() => setSelectedRoute("DSC to Uttara")}
              >
                <Text className="text-white">
                  {`${userData?.route?.startLocation} to ${userData?.route?.endLocation}`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`rounded-md px-8 py-3 w-[45%] font-semibold text-black ${
                  selectedRoute === "Uttara to DSC" ? "bg-primary-800" : "bg-gray-200"
                }`}
                onPress={() => setSelectedRoute("Uttara to DSC")}
              >
                <Text className="text-white">
                  {`${userData?.route?.endLocation} to ${userData?.route?.startLocation}`}
                </Text>
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
            </ScrollView>
          </View> */
}
{
  /* </View> */
}
