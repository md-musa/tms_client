import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useLocation from "@/hook/useLocation";
import { useAuth } from "@/contexts/AuthContext";
import { useBroadcast } from "@/contexts/BroadcastContext";
import socket from "@/config/socket";
import * as MapLibreGL from "@maplibre/maplibre-react-native";
import campusArea from "@/assets/routes/campus.json";
import { generateMarkers, selectRoutePolyline } from "@/utils/mappingHelper";
import busMarker from "@/assets/images/navigatorArrow3.png";

const Loading = () => <Text>Loading...</Text>;

export default function LiveLocationSharing() {
  const { location } = useLocation();
  const { userData } = useAuth();
  const { broadcastData } = useBroadcast();
  const [watchingCount, setWatchingCount] = useState(25); // Example count
  const [routeName, setRouteName] = useState("Campus to Uttara");
  const [busName, setBusName] = useState("Bus 1");
  const [isSharing, setIsSharing] = useState(true); // Track if sharing is active
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const [activeBuses, setActiveBuses] = useState({});
  const [currentlyConnectedUserCount, setCurrentlyConnectedUserCount] = useState(0);
  const [recenterMap, setRecenterMap] = useState(true);
  const [zoom, setZoom] = useState(12);
  const [showCallout, setShowCallout] = useState(false);

  // Check if data is loaded
  useEffect(() => {
    if (userData && location && broadcastData) {
      setIsLoading(false); // Data is ready
    }
  }, [userData, location, broadcastData]);

  console.log("👤", JSON.stringify(userData, null, 2));
  console.log("📍", JSON.stringify(location, null, 2));

  // Join the room when userData is available
  useEffect(() => {
    if (userData?.route?._id) {
      const roomId = userData.route._id;
      socket.emit("join-room", roomId);
      console.log(`Joined room: ${roomId}`);

      return () => {
        socket.emit("leave-room", roomId); // Leave the room
        console.log(`Left room: ${roomId}`);
      };
    }
  }, [userData?.route?._id]);

  // Broadcast location updates whenever location changes
  useEffect(() => {
    if (isSharing && location && userData?.route?._id && broadcastData) {
      socket.emit("broadcast-bus-location", {
        ...location,
        routeId: userData.route._id,
        hostId: "", // Add hostId if available
        busId: broadcastData?.busId,
        busType: broadcastData?.busType,
      });

      console.log("📡 Broadcasted location data:", {
        ...location,
        routeId: userData.route._id,
        busId: broadcastData?.busId,
        busType: broadcastData?.busType,
      });
    }
  }, [location, isSharing, userData?.route?._id, broadcastData]);

  // Handle stopping location sharing
  const handleStopSharing = () => {
    if (userData?.route?._id) {
      socket.emit("stop-broadcast", userData.route._id); // Notify server to stop broadcasting
      setIsSharing(false); // Update sharing state
      Alert.alert("Sharing Stopped", "Location sharing has been stopped.");
    }
  };

  // Show loading state if data is not ready
  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-gray-100">
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

        {/* <MapLibreGL.MarkerView
          coordinate={[location.longitude, location.latitude]}
        >
          
          <View style={styles.marker}>
            <Text style={styles.markerText}>📍</Text>
          </View>
          <MapLibreGL.Callout>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutDescription}>Speed: {Math.ceil(location.speed)} kmph</Text>
            </View>
          </MapLibreGL.Callout>
        </MapLibreGL.MarkerView> */}

        <MapLibreGL.Animated.ShapeSource
          id="busMarkers"
          shape={{
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [location.longitude, location.latitude],
                },
                properties: {
                  icon: "marker",
                  title: broadcastData.busId, // `${data.bus.name}-${data.bus.serialNumber}`,
                  speed: `${Math.ceil(location.speed)} m/s`, // add speed for animation,
                  heading: location.heading, // add heading for rotation,   // send speed from user device
                },
              },
            ],
          }}
        >
          <MapLibreGL.CircleLayer id="userShadow3" style={styles.busShadow1} />
          <MapLibreGL.CircleLayer id="userShadow2" style={styles.busShadow2} />
          <MapLibreGL.Animated.SymbolLayer id="busMarkerLayer" style={styles.busMarker} />
        </MapLibreGL.Animated.ShapeSource>
      </MapLibreGL.MapView>

      {/* <View className="relative h-2/3 rounded-lg overflow-hidden shadow-lg"> */}
      {/* Watching Count Label */}
      {/* <View className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-lg">
          <Text className="text-white text-sm">Watching: {watchingCount}</Text>
        </View> */}

      {/* Route Name Label */}
      {/* <View className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-lg">
          <Text className="text-white text-sm">{routeName}</Text>
        </View> */}

      {/* Fullscreen Icon */}
      {/* <TouchableOpacity className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg">
          <Ionicons name="expand" size={24} color="black" />
        </TouchableOpacity>
      </View> */}

      {/* Route Details */}
      <View className="px-4 mb-4">
        <View className="bg-white p-4 mt-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-gray-800">Route: {routeName}</Text>
        <Text className="text-md text-gray-600 mt-1">Bus: {busName}</Text>
      </View>

      {/* Stop Location Sharing Button */}
      <TouchableOpacity className="bg-red-600 py-3 rounded-xl shadow-lg mt-6" onPress={handleStopSharing}>
        <Text className="text-white text-center font-semibold text-lg">Stop Location Sharing</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    iconRotate: ["+", ["get", "heading"], 45], // Add -90 degrees to the heading
    textField: ["get", "title"],
    textField: ["get", "speed"],
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
  calloutContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    width: 150,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  calloutDescription: {
    fontSize: 12,
  },
  marker: {
    width: 40, // Ensure the marker has a valid size
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: {
    fontSize: 20,
  },
});
