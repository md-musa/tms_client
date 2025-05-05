import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as MapLibreGL from "@maplibre/maplibre-react-native";
import campusArea from "@/assets/routes/campus.json";
import { generateMarkers, selectRoutePolyline } from "@/utils/mappingHelper";
import busMarker from "@/assets/images/navigatorArrow3.png";

const MapComponent = ({ location, zoom, recenterMap, userData, activeBuses, setZoom }) => {
  return (
    <MapLibreGL.MapView
      attributionEnabled={true}
      style={styles.map}
      onRegionDidChange={(event) => setZoom(event.properties.zoom)}
    >
      {recenterMap && location && (
        <MapLibreGL.Camera zoomLevel={zoom} centerCoordinate={[location.longitude, location.latitude]} />
      )}

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

      {/* Show buses location */}
      <MapLibreGL.Animated.ShapeSource
        id="busMarkers"
        shape={{ type: "FeatureCollection", features: generateMarkers(activeBuses) }}
      >
        <MapLibreGL.CircleLayer id="userShadow3" style={styles.busShadow1} />
        <MapLibreGL.CircleLayer id="userShadow2" style={styles.busShadow2} />
        <MapLibreGL.Animated.SymbolLayer id="busMarkerLayer" style={styles.busMarker} />
      </MapLibreGL.Animated.ShapeSource>

      {/* Show user location */}
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
          <MapLibreGL.CircleLayer id="userShadow" style={styles.userShadow} />
          <MapLibreGL.CircleLayer id="userDot" style={styles.userDot} />
        </MapLibreGL.ShapeSource>
      )}

      {/* <View style={styles.attributionContainer}>
        <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
      </View> */}
    </MapLibreGL.MapView>
  );
};

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
    iconRotate: ["get", "heading"],
    textField: ["get", "title"],
    textSize: 11,
    textColor: "rgba(229, 129, 52, 1)",
    textAnchor: "bottom",
    textOffset: [0, 4.5],
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

export default MapComponent;
