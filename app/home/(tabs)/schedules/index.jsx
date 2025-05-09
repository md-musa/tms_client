import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/config/axiosConfig";
import { processSchedules } from "@/utils/scheduleHelper";
import ScheduleCard from "@/components/ScheduleCard";
import { Feather } from "@expo/vector-icons";

const BusSchedule = () => {
  const { userData } = useAuth();

  const [selectedFilter, setSelectedFilter] = useState(userData?.role == "student" ? "Student" : "Employee");
  const [schedules, setSchedules] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const today = new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase();

        const { data } = await apiClient.get(`/schedules/get-single-route-schedule`, {
          params: { routeId: userData?.route?._id, day: today },
        });

        setSchedules(data.data);
      } catch (err) {
        console.log("Error fetching schedules:", err);
      }
    };

    fetchSchedules();
  }, [userData]);

  let toCampusStudent, fromCampusStudent, toCampusEmployee, fromCampusEmployee;
  if (schedules) {
    toCampusStudent = processSchedules(schedules?.to_campus.student);
    fromCampusStudent = processSchedules(schedules?.from_campus.student);
    toCampusEmployee = processSchedules(schedules?.to_campus.employee);
    fromCampusEmployee = processSchedules(schedules?.from_campus.employee);
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* View Stoppage Button */}
      <View className="mt-4">
        {schedules && (
          <View className="flex-row">
            <Text className="mx- px-4 capitalize py-2 border bg-indigo-500 rounded-full text-white border-gray-300">
              {/* {schedules?.to_campus?.student[0].mode} Routine */}
              Regular Routine
            </Text>
            <Text className="text-3xl font-light text-gray-400"> | </Text>
            <Text className="mx-1 px-4 capitalize py-2 border bg-indigo-500 rounded-full text-white border-gray-300">
              {/* {schedules?.to_campus.student[0].operatingDays} */}
              Weekdays
            </Text>
          </View>
        )}
      </View>

      <View className="bg-tertiary-900 rounded-3xl my-4 p-1">
        {/*----- Date & Route Selector --------- */}
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
            <Text className="text-md bg-white px-2 py-1 rounded-md">{`${userData?.route?.endLocation} Route`}</Text>
          </View>
        </View>

        <View className="bg-white p-4 my-4 rounded-xl">
          {/* ------Student, Employee, All Filter------- */}
          <View className="flex-row justify-around rounded-md">
            {/* Student Button */}
            <TouchableOpacity
              className={`px-6 py-2 rounded-lg border w-[45%] mx-2
                        ${
                          selectedFilter === "Student" ? "bg-indigo-500 border-indigo-600" : "bg-white border-gray-300"
                        }`}
              onPress={() => setSelectedFilter("Student")}
            >
              <Text
                className={`text-center font-semibold 
                          ${selectedFilter === "Student" ? "text-white" : "text-gray-700"}`}
              >
                Student Sche.
              </Text>
            </TouchableOpacity>

            {/* Employee Button */}
            <TouchableOpacity
              className={`px-6 py-2 rounded-lg border w-[45%] mx-2
                        ${
                          selectedFilter === "Employee" ? "bg-indigo-500 border-indigo-600" : "bg-white border-gray-300"
                        }`}
              onPress={() => setSelectedFilter("Employee")}
            >
              <Text
                className={`text-center font-semibold 
                          ${selectedFilter === "Employee" ? "text-white" : "text-gray-700"}`}
              >
                Employee Sche.
              </Text>
            </TouchableOpacity>
          </View>

          {/* -----Bus Schedule--------- */}
          {schedules ? (
            <View className="mt-4">
              {selectedFilter == "Student" ? (
                <>
                  <View className="">
                    <View className="flex-row items-center justify-center bg-white px-4 py-1 rounded-2xl my-2  border-gray-300">
                      <Text className="text-gray-600 font-semibold text-md">{userData?.route?.endLocation}</Text>
                      <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                      <Text className="text-gray-600 font-semibold text-md">{userData?.route?.startLocation}</Text>
                    </View>

                    {toCampusStudent?.length > 0 &&
                      toCampusStudent?.map((schedule) => <ScheduleCard key={schedule._id} schedule={schedule} />)}
                    {toCampusStudent?.length == 0 && (
                      <Text className="text-gray-600 bg-white shadow-sm font-semibold text-sm text-center my-3 border py-3 rounded-lg border-gray-300">
                        No schedule found
                      </Text>
                    )}
                  </View>
                  <View className="">
                    <View className="flex-row items-center justify-center bg-white px-4 py-1 rounded-2xl my-2 mt-5  border-gray-300">
                      <Text className="text-gray-600 font-semibold text-md">{userData?.route?.startLocation}</Text>
                      <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                      <Text className="text-gray-600 font-semibold text-md">{userData?.route?.endLocation}</Text>
                    </View>

                    {fromCampusStudent?.length > 0 &&
                      fromCampusStudent?.map((schedule) => <ScheduleCard key={schedule._id} schedule={schedule} />)}
                    {fromCampusStudent?.length == 0 && (
                      <Text className="text-gray-600 bg-white shadow-sm font-semibold text-sm text-center my-3 border py-3 rounded-lg border-gray-300">
                        No schedule found
                      </Text>
                    )}
                  </View>
                </>
              ) : (
                <>
                  <View className="">
                    <View className="flex-row items-center justify-center bg-white px-4 py-1 rounded-2xl my-2  border-gray-300">
                      <Text className="text-gray-600 font-semibold text-md">{userData?.route?.endLocation}</Text>
                      <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                      <Text className="text-gray-600 font-semibold text-md">{userData?.route?.startLocation}</Text>
                    </View>

                    {toCampusEmployee?.length > 0 &&
                      toCampusEmployee?.map((schedule) => <ScheduleCard key={schedule._id} schedule={schedule} />)}
                    {toCampusEmployee?.length == 0 && (
                      <Text className="text-gray-600 bg-white shadow-sm font-semibold text-sm text-center my-3 border py-3 rounded-lg border-gray-300">
                        No schedule found
                      </Text>
                    )}
                  </View>
                  <View className="">
                    <View className="flex-row items-center justify-center bg-white px-4 py-1 rounded-2xl my-2 mt-5  border-gray-300">
                      <Text className="text-gray-600 font-semibold text-md">{userData?.route?.startLocation}</Text>
                      <Feather name="arrow-right-circle" size={20} color="#2563EB" className="mx-2" />
                      <Text className="text-gray-600 font-semibold text-md">{userData?.route?.endLocation}</Text>
                    </View>

                    {fromCampusEmployee?.length > 0 &&
                      fromCampusEmployee?.map((schedule) => <ScheduleCard key={schedule._id} schedule={schedule} />)}
                    {fromCampusEmployee?.length == 0 && (
                      <Text className="text-gray-600 bg-white shadow-sm font-semibold text-sm text-center my-3 border py-3 rounded-lg border-gray-300">
                        No schedule found
                      </Text>
                    )}
                  </View>
                </>
              )}
            </View>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
          )}
        </View>
      </View>
    </ScrollView>
  );
};
export default BusSchedule;
