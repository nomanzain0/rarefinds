import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import React from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Image } from "react-native";
import { router } from "expo-router";


const DemandCard  = ({
    img,
    title,
    id
}) => {
    const theme = useColorScheme()
    return (
    <ThemedView className="w-screen">
      <TouchableOpacity onPress={()=>{router.push({pathname:"/(product)/[product]",params:{product:id}})}}>

    <ThemedView className={`relative  w-full h-[250px] flex flex-row items-end my-2 p-5 py-8`}>
      <View className="w-full border h-full top-0 mt-8 rounded-xl overflow-hidden ml-5 z-50 bg-[#00000041] flex justify-end p-5 absolute">
        <ThemedText className=" font-spaceMono text-sm text-teal-900 font-bold">
          Ending soon
        </ThemedText>
        <ThemedText className="font-dm text-2xl text-white">{title}</ThemedText>
        <ThemedText className="text-xl font-pinyon text-white">
          Imported from Persia
        </ThemedText>
      </View>
      <Image
        source={{uri:img}}
        className="w-full h-full"
        resizeMode="cover"
        ></Image>
    </ThemedView>
        </TouchableOpacity>
        </ThemedView>
  );
};

export default DemandCard;
