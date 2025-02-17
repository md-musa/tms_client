import React, { useRef, useState, useEffect } from "react";
import { View, Text, StatusBar, StyleSheet, Alert } from "react-native";
import * as MapLibreGL from "@maplibre/maplibre-react-native";
import { Ionicons } from "@expo/vector-icons";
import { socket } from "@/app/home/(tabs)";
import { useAuth } from "@/contexts/AuthContext";
import campusArea from "@/assets/routes/campus.json";
import { generateMarkers, selectRoutePolyline } from "@/utils/mappingHelper";
import busMarker from "@/assets/images/navigatorArrow3.png";
import BottomSheetComponent from "../../components/UI/BottomSheetComponent";
import useLocation from "@/hook/useLocation";

const WatchBusLocation = () => {
  const bottomSheetRef = useRef(null);
  const { userData } = useAuth();
  const { location, errorMsg } = useLocation();
  if (location)
    console.log(`
          📍 Latitude: ${location.latitude}{"\n"}
          📍 Longitude: ${location.longitude}{"\n"}
          🚀 Speed: ${location.speed ? location.speed.toFixed(2) : 0} m/s{"\n"}
          🏔 Altitude: ${location.altitude ? location.altitude.toFixed(2) : 0} m{"\n"}
          🧭 Heading: ${location.heading ? location.heading.toFixed(2) : 0}°
        `);
  const [activeBuses, setActiveBuses] = useState({});
  const [currentlyConnectedUserCount, setCurrentlyConnectedUserCount] = useState(0);
  const [recenterMap, setRecenterMap] = useState(true);
  const [zoom, setZoom] = useState(12); // Initial zoom level
  console.log(zoom);
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

    return () => {
      socket.off("bus-location-update");
    };
  }, []);

  const busesMarkers = generateMarkers(activeBuses);
  // send speed from user device

  if (!location) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden={true} />
      <View className="relative flex-1">
        <MapLibreGL.MapView
          style={styles.map}
          onRegionDidChange={(event) => {
            setZoom(event.properties.zoom);
          }}
        >
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

          {/* Campus marker */}
          <MapLibreGL.ShapeSource id="polygonSource" shape={campusArea}>
            <MapLibreGL.FillLayer id="polygonLayer" style={{ fillColor: "rgba(255, 0, 100, 0.4)" }} />
          </MapLibreGL.ShapeSource>

          {/* Route polyline */}
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

          {/*--------------- Buses markers-------------------- */}
          <MapLibreGL.ShapeSource
            id="busMarkers"
            shape={{
              type: "FeatureCollection",
              features: busesMarkers,
            }}
          >
            <MapLibreGL.CircleLayer
              id="userShadow3"
              style={{
                circleRadius: 17,
                circleColor: "rgba(229, 129, 52, 0.4)", //"rgba(229, 129, 52, 0.3)", //"rgba(127, 185, 255, 0.4)",
                circleBlur: 0,
              }}
            />
            <MapLibreGL.CircleLayer
              id="userShadow2"
              style={{
                circleRadius: 10,
                circleColor: "black",
                circleBlur: 0,
              }}
            />
            <MapLibreGL.SymbolLayer
              id="busMarkerLayer"
              style={{
                iconImage: "marker",
                iconSize: 0.025,
                iconAnchor: "center",
                iconRotate: ["get", "heading"], // Ensure you set heading in your data
                textField: ["concat", ["get", "title"], "\n", ["get", "direction"]], // Multi-line text
                textSize: 14,
                textColor: "#ffffff",
                textHaloColor: "#000000",
                textHaloWidth: 2,
                textOffset: [0, 2.5], // Moves text above the marker
                // textBackgroundColor: "blue", // Background color
                // textBackgroundPadding: 4, // Adds padding
              }}
            />
          </MapLibreGL.ShapeSource>

          {/*-----------User Location: Blue Dot with Shadow-----------------*/}
          {location && (
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
              {/* Shadow (Larger Circle) */}
              <MapLibreGL.CircleLayer
                id="userShadow"
                style={{
                  circleRadius: 20,
                  circleColor: "rgba(0, 50, 255, 0.3)",
                  circleBlur: 0,
                }}
              />

              {/* Main Blue Dot */}
              <MapLibreGL.CircleLayer
                id="userDot"
                style={{
                  circleRadius: 5,
                  circleColor: "blue",
                  circleStrokeColor: "white",
                  circleStrokeWidth: 2,
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
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

      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        activeBuses={activeBuses}
        closeBottomSheet={() => bottomSheetRef.current?.close()}
      />
    </View>
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

// <MapLibreGL.SymbolLayer
//               id="busMarkerLayer"
//               style={{
//                 iconImage: "marker",
//                 iconSize: 0.05,
//                 textField: ["get", "title"],
//                 textSize: 14,
//                 textColor: "#000000",
//                 textHaloColor: "#FFFFFF",
//                 textHaloWidth: 1,
//                 textOffset: [0, 1.5],
//               }}
//             />
//           </MapLibreGL.ShapeSource> */}
