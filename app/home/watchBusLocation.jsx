import React, { useCallback, useRef, useState, useEffect } from "react";
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as MapLibreGL from "@maplibre/maplibre-react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons"; // Correct import
import { socket } from "@/app/home/(tabs)";
import { useAuth } from "@/contexts/AuthContext";
import campusArea from "@/assets/routes/campus.json";
import { generateMarkers, selectRoutePolyline } from "@/utils/mappingHelper";
import busImage from "@/assets/images/bug_front.png";
import busMarker from "@/assets/images/bus-marker.png";

// const busData = Array.from({ length: 10 }, (_, index) => ({
//   id: index + 1,
//   busName: `Bus ${index + 1}`,
//   direction: index % 2 === 0 ? "To Campus" : "From Campus",
//   status: index % 2 === 0 ? "Ongoing" : "Scheduled",
//   time: index % 2 === 0 ? "10:30 AM" : "11:00 AM",
// }));

const WatchBusLocation = () => {
  const bottomSheetRef = useRef(null);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const { userData } = useAuth();
  const [activeBuses, setActiveBuses] = useState({});
  const [currentlyConnectedUserCount, setCurrentlyConnectedUserCount] = useState(0);
  const [recenterMap, setRecenterMap] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [userZoomed, setUserZoomed] = useState(false);
  useEffect(() => {
    socket.on("bus-location-update", (data) => {
      setRecenterMap(false);
      if (!data) {
        console.log("⚠ error", data);
        return;
      }
      setActiveBuses((prevBuses) => ({
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
    if (!userZoomed) {
      setZoomLevel(12);
    }

    return () => {
      socket.off("bus-location-update");
    };
  }, [userZoomed]);

  const busesMarkers = generateMarkers(activeBuses);

  const renderBusItem = ({ item }) => {
    if (!item) return <Text>Not available</Text>;
    const { bus, trip } = item;

    return (
      <View className="px-2 py-1" style={styles.busItemContainer}>
        <Image source={busImage} style={{ height: 30, width: 30, marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text className="text-md font-bold">{bus.name + "-" + bus.serialNumber}</Text>
          <View className="flex-row">
            <Text className="text-sm capitalize">{trip.direction} | </Text>
            <Text className="text-sm bg-primary-800 px-2 text-white rounded-full capitalize">{bus.type} bus</Text>
          </View>
          <View
            className={`flex-row rounded-full px-2 my-1 ${
              trip.status == "ongoing" ? "bg-yellow-100 text-yellow-600" : "bg-secondary-100 text-secondary-600"
            }`}
          >
            <Text className="text-sm">{trip.status}</Text>

            {item.status === "Scheduled" && (
              <Text className="text-sm">
                {" | "}Departure: {trip.departureTime || "TBD"}
              </Text>
            )}
          </View>
        </View>
        <View style={{ marginLeft: 4 }}>
          <TouchableOpacity className="bg-green-500 px-2 py-1 rounded-full flex-row items-center">
            <Icon name="location-on" size={16} color="white" style={{ marginRight: 4 }} />
            <Text className="text-white">Track Bus</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const handleZoomChange = (newZoom) => {
    console.log(newZoom);
    setZoomLevel(newZoom);
    setUserZoomed(true);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      <View className="relative flex-1">
        <MapLibreGL.MapView style={styles.map}>
          <MapLibreGL.Camera
            zoomLevel={zoomLevel}
            onDidChange={() => handleZoomChange(zoomLevel)}
            centerCoordinate={recenterMap ? [90.34984171243167, 23.859482749844815] : undefined}
          />

          <MapLibreGL.RasterSource
            id="osm"
            tileUrlTemplates={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]}
            tileSize={256}
          >
            <MapLibreGL.RasterLayer id="osmLayer" sourceID="osm" />
          </MapLibreGL.RasterSource>

          <MapLibreGL.ShapeSource id="polygonSource" shape={campusArea}>
            <MapLibreGL.FillLayer id="polygonLayer" style={{ fillColor: "rgba(255, 0, 100, 0.4)" }} />
          </MapLibreGL.ShapeSource>

          <MapLibreGL.ShapeSource id="routeSource" shape={selectRoutePolyline(userData?.route || "")}>
            <MapLibreGL.LineLayer
              id="routeLayer"
              style={{
                lineColor: "black",
                lineWidth: 2,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </MapLibreGL.ShapeSource>
          <MapLibreGL.Images images={{ marker: busMarker }} />

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

        <View className="absolute top-5 right-3 bg-black/50 px-3 rounded-lg">
          <Text className="text-white text-sm">Watching: {currentlyConnectedUserCount}</Text>
        </View>

        {/* Route Name Label */}
        <View className="absolute top-12 right-3 bg-black/50 px-1 rounded-lg flex-row items-center">
          <Ionicons name="bus" size={16} color="white" style={{ marginRight: 4 }} />
          <Text className="text-white text-sm">{busesMarkers.length} Buses available</Text>
        </View>
      </View>

      <BottomSheet ref={bottomSheetRef} snapPoints={["30%", "50%", "60%", "75%", "90%"]} onChange={handleSheetChanges}>
        <BottomSheetView className="px-5">
          <Text className="text-xl font-bold text-center my-2">Available buses</Text>

          {/* Scrollable List of Buses */}
          <FlatList
            data={Object.values(activeBuses)}
            renderItem={renderBusItem}
            keyExtractor={(item) => item.bus.id.toString()}
            className="w-full"
          />

          <TouchableOpacity onPress={closeBottomSheet} className="bg-red-500 p-4 rounded-lg mt-4">
            <Text className="text-white">Close</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  busItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.84,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  map: {
    flex: 1,
  },
});

export default WatchBusLocation;
