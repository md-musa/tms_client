import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AvailableBusListCard from "./AvailableBusListCard";

const BottomSheetComponent = ({ bottomSheetRef, activeBuses, closeBottomSheet, centerMapAndHighLightBus }) => {
  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={["30%", "50%", "60%", "75%", "90%"]}>
      <BottomSheetView className="px-5">
        <Text className="text-xl font-bold text-center my-2">Available buses</Text>

        {!activeBuses && <Text className="text-center">No buses available</Text>}
        <FlatList
          data={Object.values(activeBuses)}
          renderItem={({ item }) => (
            <AvailableBusListCard item={item} centerMapAndHighLightBus={centerMapAndHighLightBus} />
          )}
          keyExtractor={(item) => item.bus.id.toString()}
          className="w-full"
        />

        {/* <TouchableOpacity onPress={closeBottomSheet} className="bg-red-500 p-4 rounded-lg mt-4">
          <Text className="text-white">Close</Text>
        </TouchableOpacity> */}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheetComponent;
