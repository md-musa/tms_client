import { View, Text } from "react-native";
import React from "react";

const ScheduleCard = (props) => {
  const { _id, status, formattedTime, userType, note } = props.schedule;
  return (
    <View
      key={_id}
      className={`p-3 my-1 rounded-lg border ${
        status == "Ongoing" ? "bg-indigo-100 border-indigo-500" : "border-gray-300"
      }`}
    >
      <View className="flex-row justify-between">
        <Text className={`text-lg ${status =="Ongoing" ? "font-bold text-indigo-600" : "text-gray-700"}`}>
          {formattedTime} 
        </Text>

        <Text className={`text-sm ${status ? "font-bold text-indigo-600" : "text-gray-700"}`}>{note}</Text>
        {status && (
          <Text className={`text-sm ${status == "Next" ? "text-primary-900 bg-primary-100 border border-primary-400" : "text-purple-900 bg-purple-100 border border-purple-400 "} shadow-md px-4 rounded-full py-1`}>
            {status}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ScheduleCard;
