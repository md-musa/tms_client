import React, { useRef, useState, useEffect } from "react";
import { View, Text, StatusBar, StyleSheet, Alert } from "react-native";
import * as MapLibreGL from "@maplibre/maplibre-react-native";
import { Ionicons } from "@expo/vector-icons";
import { socket } from "@/app/home/(tabs)";
import { useAuth } from "@/contexts/AuthContext"
import campusArea from "@/assets/routes/campus.json";
import { generateMarkers, selectRoutePolyline } from "@/utils/mappingHelper";
import busMarker from "@/assets/images/navigatorArrow3.png";
import BottomSheetComponent from "../../components/UI/BottomSheetComponent";
import useLocation from "@/hook/useLocation";

const WatchBusLocation = () => {
  const bottomSheetRef = useRef(null);
  const { userData } = useAuth();
  const { location } = useLocation();

  const [activeBuses, setActiveBuses] = useState({});
  const [currentlyConnectedUserCount, setCurrentlyConnectedUserCount] = useState(0);
  const [recenterMap, setRecenterMap] = useState(true);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    socket.on("bus-location-update", (data) => {
      if (!data) return console.log("⚠ error", data);
      
      setRecenterMap(false);
      setActiveBuses((prevBuses) => ({ ...prevBuses, [data.bus.id]: data }));
      setCurrentlyConnectedUserCount(data.currentlyConnectedUserCount || 0);
    });

    if (userData) {
      const routeId = userData?.route?._id;
      if (routeId) {
        socket.emit("join-route", routeId);
        console.log(`Joined route: ${routeId}`);
      } else {
        Alert.alert("Route ID is null");
      }
    }

    return () => {
      socket.off("bus-location-update");
    };
  }, [userData]);

  if (!location) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      <View className="relative flex-1">
        <MapLibreGL.MapView style={styles.map} onRegionDidChange={(event) => setZoom(event.properties.zoom)}>
          <MapLibreGL.Camera
            zoomLevel={zoom}
            centerCoordinate={recenterMap ? [location.longitude, location.latitude] : undefined}
          />

          <MapLibreGL.RasterSource id="osm" tileUrlTemplates={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]} tileSize={256}>
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

          <MapLibreGL.Animated.ShapeSource id="busMarkers" shape={{ type: "FeatureCollection", features: generateMarkers(activeBuses) }}>
            <MapLibreGL.CircleLayer id="userShadow3" style={styles.busShadow1} />
            <MapLibreGL.CircleLayer id="userShadow2" style={styles.busShadow2} />
            <MapLibreGL.Animated.SymbolLayer id="busMarkerLayer" style={styles.busMarker} />
          </MapLibreGL.Animated.ShapeSource>

          <MapLibreGL.ShapeSource id="userLocation" shape={{
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [location.longitude, location.latitude],
              },
            }],
          }}>
            <MapLibreGL.CircleLayer id="userShadow" style={styles.userShadow} />
            <MapLibreGL.CircleLayer id="userDot" style={styles.userDot} />
          </MapLibreGL.ShapeSource>
        </MapLibreGL.MapView>

        <View style={styles.connectedUsersContainer}>
          <Text style={styles.connectedUsersText}>Watching: {currentlyConnectedUserCount}</Text>
        </View>

        <View style={styles.routeInfoContainer}>
          <Ionicons name="bus" size={16} color="white" style={{ marginRight: 4 }} />
          <Text style={styles.routeInfoText}>{Object.keys(activeBuses).length} Buses available</Text>
        </View>
      </View>

      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        activeBuses={activeBuses}
        closeBottomSheet={() => bottomSheetRef.current?.close()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  map: {
    flex: 1,
  },
  connectedUsersContainer: {
    position: "absolute",
    top: 5,
    right: 3,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  connectedUsersText: {
    color: "white",
    fontSize: 12,
  },
  routeInfoContainer: {
    position: "absolute",
    top: 40,
    right: 3,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  routeInfoText: {
    color: "white",
    fontSize: 12,
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

export default WatchBusLocation;
