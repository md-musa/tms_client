import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import useLocation from "@/hook/useLocation";
import socket from "@/config/socket"; // Import the socket instance

export default function Index() {
  const { location } = useLocation();
  const [watchingCount, setWatchingCount] = useState(0);
  const [routeName, setRouteName] = useState("Campus to Uttara");
  const [busName, setBusName] = useState("Bus 1");
  const [isModalVisible, setIsModalVisible] = useState(true); // Show modal initially
  const [busType, setBusType] = useState(""); // "student", "faculty", or "bus"
  const [direction, setDirection] = useState(""); // "to_campus" or "from_campus"

  // Emit location updates whenever location changes
  useEffect(() => {
    if (!isModalVisible && busType && direction && location) {
      const { latitude, longitude } = location;

      // Emit the bus location update
      socket.emit("broadcast-bus-location", {
        routeId: "your-route-id", // Replace with actual route ID
        busId: "your-bus-id", // Replace with actual bus ID
        hostId: "your-host-id", // Replace with actual host ID
        busType,
        latitude,
        longitude,
        heading: 0, // Replace with actual heading if available
        direction,
      });

      console.log("📍 Broadcasted bus location:", { latitude, longitude, busType, direction });
    }
  }, [location, isModalVisible, busType, direction]);

  // Handle modal submission
  const handleStartSharing = () => {
    if (!busType || !direction) {
      alert("Please select bus type and direction.");
      return;
    }
    setIsModalVisible(false); // Close the modal
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Google Map Section */}
      <View className="relative h-2/3 rounded-lg overflow-hidden shadow-lg">
        <MapLibreGL.MapView style={styles.map} onRegionDidChange={(event) => setZoom(event.properties.zoom)}>
          <MapLibreGL.Camera
            zoomLevel={zoom}
            centerCoordinate={recenterMap ? [location.longitude, location.latitude] : undefined}
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
              style={{ lineColor: "black", lineWidth: 2, lineCap: "round", lineJoin: "round" }}
            />
          </MapLibreGL.ShapeSource>

          <MapLibreGL.Images images={{ marker: busMarker }} />

          {/* <MapLibreGL.Animated.ShapeSource
            id="busMarkers"
            shape={{ type: "FeatureCollection", features: generateMarkers(activeBuses) }}
          >
            <MapLibreGL.CircleLayer id="userShadow3" style={styles.busShadow1} />
            <MapLibreGL.CircleLayer id="userShadow2" style={styles.busShadow2} />
            <MapLibreGL.Animated.SymbolLayer id="busMarkerLayer" style={styles.busMarker} />
          </MapLibreGL.Animated.ShapeSource> */}

          <MapLibreGL.ShapeSource
            id="userLocation"
            shape={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [location.longitude, location.latitude],
                  },
                },
              ],
            }}
          >
            <MapLibreGL.CircleLayer id="userShadow" style={styles.userShadow} />
            <MapLibreGL.CircleLayer id="userDot" style={styles.userDot} />
          </MapLibreGL.ShapeSource>
        </MapLibreGL.MapView>




        {/* Watching Count Label */}
        <View className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-lg">
          <Text className="text-white text-sm">Watching: {watchingCount}</Text>
        </View>

        {/* Route Name Label */}
        <View className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-lg">
          <Text className="text-white text-sm">{routeName}</Text>
        </View>

        {/* Fullscreen Icon */}
        <TouchableOpacity className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg">
          <Ionicons name="expand" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Route Details */}
      <View className="bg-white p-4 mt-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-gray-800">Route: {routeName}</Text>
        <Text className="text-md text-gray-600 mt-1">Bus: {busName}</Text>
      </View>

      {/* Stop Location Sharing Button */}
      <TouchableOpacity className="bg-red-600 py-3 rounded-xl shadow-lg mt-6">
        <Text className="text-white text-center font-semibold text-lg">Stop Location Sharing</Text>
      </TouchableOpacity>

      {/* Modal for Bus Type and Direction */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Start Location Sharing</Text>

            <TextInput
              style={styles.input}
              placeholder="Bus Type (student, faculty, bus)"
              value={busType}
              onChangeText={setBusType}
            />

            <TextInput
              style={styles.input}
              placeholder="Direction (to_campus, from_campus)"
              value={direction}
              onChangeText={setDirection}
            />

            <Button title="Start Sharing" onPress={handleStartSharing} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  busShadow1: {
    circleRadius: 17,
    circleColor: "rgba(229, 129, 52, 0.4)",
    circleBlur: 0,
  },
  busShadow2: {
    circleRadius: 10,
    circleColor: "black",
    circleBlur: 0,
  },
  busMarker: {
    iconImage: "marker",
    iconSize: 0.025,
    iconAnchor: "center",
    iconRotate: ["get", "heading"],
    textField: ["get", "title"],
    textSize: 11,
    textColor: "rgba(229, 129, 52, 1)",
    textAnchor: "bottom",
    textOffset: [0, 2.5],
    textHaloColor: "black",
    textHaloWidth: 0.2,
  },
  userShadow: {
    circleRadius: 20,
    circleColor: "rgba(0, 50, 255, 0.3)",
    circleBlur: 0,
  },
  userDot: {
    circleRadius: 5,
    circleColor: "blue",
    circleStrokeColor: "white",
    circleStrokeWidth: 2,
  },
});
