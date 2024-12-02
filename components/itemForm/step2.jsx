import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import * as DocumentPicker from "expo-document-picker";

const Step2 = ({ images, setImages }) => {
  const selectImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });
      if (!result.canceled) {
        const image = [...images, ...result.assets]
        console.log(image)
        setImages(image);
        console.log(result.assets);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const removeImage = (index) => {
    const updatedImages = [...images]
    updatedImages.splice(index,1)
    setImages(updatedImages)
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      <ThemedView className="mt-5">
        <ThemedText className="font-dm text-xl">Add Images</ThemedText>
        <View className="flex flex-row flex-wrap justify-evenly gap-5 mt-5">
          {images.map((image, index) => <View className="relative flex items-center justify-center border-2 w-[40%]" key={index}>
            <TouchableOpacity activeOpacity={0} onPress={() => removeImage(index)} className="absolute -top-3 z-50 -right-3"><Text className="text-white bg-black rounded-3xl py-2 px-3  flex justify-center items-center">X</Text></TouchableOpacity>
            <Image  index={index} source={{ uri: image.uri }} className="h-[120px] w-full border border-black" resizeMode="cover" />
          </View>)}
          <View className="h-[120px] w-[120px] border border-black rounded-2xl flex justify-center items-center">
            <View className="p-2 rounded-full bg-black-100">
              <Ionicons
                onPress={selectImage}
                name="share-outline"
                size={36}
                color={"#fff"}
              />
            </View>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
};

export default Step2;
