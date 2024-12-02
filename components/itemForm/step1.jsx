import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import DatePicker from "@react-native-community/datetimepicker";

const Step1 = ({ item, setItem }) => {
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState("");
  const [mode, setMode] = useState("date");

  // Separate state for selected dates and times
  const [selectedStartDate, setSelectedStartDate] = useState("Starting Date and Time");
  const [selectedEndDate, setSelectedEndDate] = useState("Ending Date and Time");

  const formatDate = (date) => {
    return `${date?.getDate()}/${date?.getMonth() + 1}/${date?.getFullYear()} - ${date?.getHours()}:${date?.getMinutes()}`;
  };

  return (
    <ThemedView className="mt-5">
      <ThemedText className="font-dm text-xl">Details </ThemedText>
      <TextInput
        className="w-full border border-black px-2 py-3 rounded-lg mt-5"
        placeholder="Item Name"
        value={item.title}
        onChangeText={(text) => setItem({ ...item, title: text })}
        placeholderTextColor={"#808080"}
      />
      <TextInput
        className="w-full border border-black px-2 py-3 rounded-lg mt-5"
        placeholder="Item Starting Bid"
        value={item.startingBid}
        keyboardType="numeric"
        onChangeText={(text) => setItem({ ...item, startingBid: text })}
        placeholderTextColor={"#808080"}
      />
      <TextInput
        className="w-full border border-black px-2 py-3 rounded-lg mt-5"
        placeholder="Item Category separated by comma"
        value={() => item.catagory.join(", ")}
        onChangeText={(text) => {
          const catagory = text.split(",");
          setItem({ ...item, catagory });
        }}
        placeholderTextColor={"#808080"}
      />

      {/* Starting Date and Time */}
      <Text
        className="w-full border border-black px-2 py-3 rounded-lg mt-5 text-[#808080]"
        onPress={() => {
          setOpenDate(true);
          setType("start");
          setMode("date");
        }}
      >
        {selectedStartDate}
      </Text>

      {/* Ending Date and Time */}
      <Text
        className="w-full border border-black px-2 py-3 rounded-lg mt-5 text-[#808080]"
        onPress={() => {
          setOpenDate(true);
          setType("end");
          setMode("date");
        }}
      >
        {selectedEndDate}
      </Text>

      <TextInput
        className="w-full border border-black px-2 py-3 rounded-lg mt-5"
        placeholder="Item Description"
        numberOfLines={4}
        style={{ textAlignVertical: "top" }}
        multiline={true}
        value={item.description}
        onChangeText={(text) => setItem({ ...item, description: text })}
        placeholderTextColor={"#808080"}
      />

      {openDate && (
        <DatePicker
          is24Hour
          value={date}
          mode={mode}
          onChange={(e, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);

              // Handle start or end selection
              if (type === "start") {
                if (mode === "date") {
                  setSelectedStartDate(formatDate(selectedDate));
                  setMode("time");
                } else {
                  setSelectedStartDate(formatDate(selectedDate));
                  setItem({ ...item, auctionStartDate: selectedDate });
                  setOpenDate(false); // Close picker after time selection
                }
              } else if (type === "end") {
                if (mode === "date") {
                  setSelectedEndDate(formatDate(selectedDate));
                  setMode("time");
                } else {
                  setSelectedEndDate(formatDate(selectedDate));
                  setItem({ ...item, auctionEndDate: selectedDate });
                  setOpenDate(false); // Close picker after time selection
                }
              }
            }
          }}
        />
      )}
    </ThemedView>
  );
};

export default Step1;
