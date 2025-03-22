import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/config/axiosConfig";
import { findOngoingOrNextSchedule, processSchedules } from "@/utils/scheduleHelper";
import ScheduleCard from "@/components/ScheduleCard";

const BusSchedule = () => {
  const { userData } = useAuth();
  const [route, setRoute] = useState(userData?.route?._id);
  const [selectedRoute, setSelectedRoute] = useState("Route 1");
  const [selectedFilter, setSelectedFilter] = useState("Student");
  const [schedules, setSchedules] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const today = new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        console.log("Fetching schedules for routeId =", route, "today =", today);

        const { data } = await apiClient.get(`/schedules/get-single-route-schedule`, {
          params: { routeId: userData?.route?._id, day: today },
        });
        console.log("Fetched data:", data);
        setSchedules(data.data);
      } catch (err) {
        console.log("Error fetching schedules:", err);
      }
    };

    fetchSchedules();
  }, [userData]);

  if (!schedules) return <Text>Loading schedules...</Text>;
  //console.log("📆 Schedules:", JSON.stringify(schedules, null, 2));

  let toCampusStudent, fromCampusStudent, toCampusEmployee, fromCampusEmployee;
  if (schedules) {
    toCampusStudent = processSchedules(schedules?.to_campus.student);
    fromCampusStudent = processSchedules(schedules?.from_campus.student);
    toCampusEmployee = processSchedules(schedules?.to_campus.employee);
    fromCampusEmployee = processSchedules(schedules?.from_campus.employee);
  }
  return (
    <View className="flex-1 bg-white p-4">
      {/* View Stoppage Button */}
      <View className="mt-4">
        <TouchableOpacity className="bg-indigo-500 p-3 rounded-lg">
          <Text className="text-white text-center font-semibold">View Bus Stoppage Points</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-tertiary-900 rounded-3xl my-4 p-1">
        {/* Date & Route Selector */}
        <View className="mt-4 flex-row justify-between items-center px-4">
          <Text className="text-lg font-semibold text-white">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </Text>
          <View className="">
            {/* <Picker
          className="bg-white h-50 h-80 text-white"
          selectedValue={selectedRoute}
          style={{ height: 50, width: 150, color: "white", fontWeight: "semibold", borderBlockColor: "#ffff" }}
          onValueChange={(itemValue) => setSelectedRoute(itemValue)}
        >
          <Picker.Item label="Route 1" value="Route 1" />
          <Picker.Item label="Route 2" value="Route 2" />
        </Picker> */}
            <Text className="text-md bg-white px-2 py-1 rounded-md">{`${userData?.route?.endLocation} Route`}</Text>
          </View>
        </View>

        <View className="bg-white p-4 my-4 rounded-xl">
          {/* Student, Employee, All Filter */}
          <View className="flex-row justify-around rounded-md">
            {/* <TouchableOpacity
          className={`px-6 py-2 rounded-lg ${selectedFilter === "All" ? "bg-indigo-500" : "bg-gray-300"}`}
          onPress={() => setSelectedFilter("All")}
        >
          <Text className="text-white font-semibold">All</Text>
        </TouchableOpacity> */}
            <TouchableOpacity
              className={`px-6 py-2 rounded-lg ${selectedFilter === "Student" ? "bg-indigo-500" : "bg-gray-300"}`}
              onPress={() => setSelectedFilter("Student")}
            >
              <Text className="text-white font-semibold">Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-6 py-2 rounded-lg ${selectedFilter === "Employee" ? "bg-indigo-500" : "bg-gray-300"}`}
              onPress={() => setSelectedFilter("Employee")}
            >
              <Text className="text-white font-semibold">Employee</Text>
            </TouchableOpacity>
          </View>

          {/* Bus Schedule List */}
          <ScrollView className="mt-4">
            {selectedFilter == "Student" ? (
              <>
                <View className="">
                  <Text className="font-semibold px-4 py-2 bg-primary-200 text-primary-1000 rounded-md w-full my-2">
                    {`${userData?.route?.endLocation} to ${userData?.route?.startLocation}`}
                  </Text>
                  {toCampusStudent?.map((schedule) => (
                    <ScheduleCard key={schedule._id} schedule={schedule} />
                  ))}
                </View>
                <View className="">
                  <Text className="font-semibold px-4 py-2 bg-primary-200 text-primary-1000 rounded-md w-full my-2">
                    {`${userData?.route?.startLocation} to ${userData?.route?.endLocation}`}
                  </Text>
                  {fromCampusStudent?.map((schedule) => (
                    <ScheduleCard key={schedule._id} schedule={schedule} />
                  ))}
                </View>
              </>
            ) : (
              <>
                <View className="">
                  <Text className="font-semibold px-4 py-2 bg-primary-200 text-primary-1000 rounded-md w-full my-2">
                    {`${userData?.route?.endLocation} to ${userData?.route?.startLocation}`}
                  </Text>
                  {toCampusEmployee?.map((schedule) => (
                    <ScheduleCard key={schedule._id} schedule={schedule} />
                  ))}
                </View>
                <View className="">
                  <Text className="font-semibold px-4 py-2 bg-primary-200 text-primary-1000 rounded-md w-full my-2">
                    {`${userData?.route?.startLocation} to ${userData?.route?.endLocation}`}
                  </Text>
                  {fromCampusEmployee?.map((schedule) => (
                    <ScheduleCard key={schedule._id} schedule={schedule} />
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Bottom Navigation */}
      {/* <View className="absolute bottom-0 left-0 right-0 bg-white p-4 flex-row justify-around border-t">
    <Ionicons name="home-outline" size={24} color="gray" />
    <Ionicons name="bus-outline" size={24} color="black" />
    <Ionicons name="notifications-outline" size={24} color="gray" />
    <Ionicons name="person-outline" size={24} color="gray" />
  </View> */}
    </View>
  );
};
export default BusSchedule;
