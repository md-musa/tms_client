import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import useLocation from "@/hook/useLocation";
import RouteSelector from "@/components/RouteSelector";
import MapSection from "@/components/MapSection";
import socket from "@/config/socket";

export default function Index() {
  const { userData } = useAuth();
  const { location } = useLocation();

  const [activeBuses, setActiveBuses] = useState({});
  const [recenterMap, setRecenterMap] = useState(true);
  const [zoom, setZoom] = useState(12);
  const [currentlyConnectedUserCount, setCurrentlyConnectedUserCount] = useState(0);

  useEffect(() => {
    socket.on("bus-location-update", (data) => {
      console.log("🚌", JSON.stringify(data, null, 2));
      if (!data) return console.log("⚠ error", data);
      setRecenterMap(false);
      setActiveBuses((prevBuses) => ({ ...prevBuses, [data.trip.busName]: data }));
      setCurrentlyConnectedUserCount(data.currUserCnt || 0);
    });

    if (userData?.route?._id) {
      socket.emit("join-route", userData.route._id);
    }

    return () => {
      socket.off("bus-location-update");
    };
  }, [userData]);

  if (!location) return <Text>Loading...</Text>;

  return (
    <View className="bg-[#e9e9e9] flex-1">
      {/* --- Select route and show Next bus schedule */}
      <RouteSelector onRouteChange={(route) => setActiveBuses({})} />

      {/* --- Show live locations buses-- */}
      <MapSection
        location={location}
        zoom={zoom}
        recenterMap={recenterMap}
        userData={userData}
        activeBuses={activeBuses}
        setZoom={setZoom}
        currentlyConnectedUserCount={currentlyConnectedUserCount}
      />
    </View>
  );
}
