import React, { useState, useEffect } from "react";
import { View, Text, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import busImage from "@/assets/images/bug_front.png";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/config/axiosConfig";
import { findOngoingOrNextSchedule } from "@/utils/scheduleHelper";
import { Link } from "expo-router";

const RouteSelector = ({ onRouteChange }) => {
  const { userData, updateRoute } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(userData?.route);
  const [availRoutes, setAvailRoutes] = useState([]);
  const [schedules, setSchedules] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await apiClient.get("/routes");
        setAvailRoutes(res.data.data);
      } catch (err) {
        console.error("API Error:", err.message);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const today = new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        const { data } = await apiClient.get(`/schedules/get-single-route-schedule`, {
          params: { routeId: currentRoute, day: today },
        });
        setSchedules(data.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (currentRoute) fetchSchedules();
  }, [currentRoute]);

  const handleRouteChange = (selectedRouteId) => {
    const selectedRouteData = availRoutes.find((r) => r._id === selectedRouteId);
    setCurrentRoute(selectedRouteData);
    updateRoute(selectedRouteData);
    onRouteChange(selectedRouteData);
  };

  let toCampusStudent, fromCampusStudent, toCampusFaculty, fromCampusFaculty;
  if (schedules) {
    toCampusStudent = findOngoingOrNextSchedule(schedules.to_campus.student);
    fromCampusStudent = findOngoingOrNextSchedule(schedules.from_campus.student);
    toCampusFaculty = findOngoingOrNextSchedule(schedules.to_campus.faculty);
    fromCampusFaculty = findOngoingOrNextSchedule(schedules.from_campus.faculty);
  }

  return (
    <View className="bg-primary-1000 p-4 mx-2 rounded-md">
      <View className="flex flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-1">
        <Image source={busImage} resizeMode="contain" style={{ width: 30, height: 30 }} />
        <Picker
          selectedValue={currentRoute?._id}
          onValueChange={handleRouteChange}
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

        <View className="flex-row border-b border-white/70 pb-2 mb-2">
          <Text className="text-white text-md font-semibold flex-1">Route</Text>
          <Text className="text-white text-md font-semibold flex-1 text-center">Student</Text>
          <Text className="text-white text-md font-semibold flex-1 text-right">Faculty</Text>
        </View>

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
          <Text className="text-white text-md flex-1">{`${currentRoute?.endLocation} to ${currentRoute?.startLocation}`}</Text>
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
  );
};

export default RouteSelector;