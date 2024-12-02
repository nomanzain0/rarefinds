import {
  View,
  useColorScheme,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import Step1 from "@/components/itemForm/step1";
import Step2 from "@/components/itemForm/step2";
import Step3 from "@/components/itemForm/step3";
import { request } from "@/lib/apiService";
import { uploadImage } from "@/lib/uploadImage";
const Add = () => {
  const theme = useColorScheme();
  const [images,setImages]=useState([])
  const [item,setItem]=useState({
    title:"",
    description:"",
    images:[],
    catagory:[],
    startingBid:0,
    auctionStartDate:"",
    auctionEndDate:"",
    isRequested:false
  })
  const [step, setStep] = useState(0);
  const steps = [<Step1 item={item} setItem={setItem}/>, <Step2 item={item} images={images} setImages={setImages} setItem={setItem}/>, <Step3 item={item} images={images} />];
  const uploadAllImages = async ()=>{
    let imageLinks=[]
    for(let image of images){
      let link = await uploadImage(image.uri,image.mimeType)
      imageLinks.push(link)
    }
    console.log(imageLinks)
    try {
      const res = await request("items/","POST",{...item,images:imageLinks})
      if(res.status===201){
        alert("Item has been saved as a draft")
        router.push("/sell")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong")      
    }  
    setItem({...item,images:imageLinks})
  }
  const saveDraft=async()=>{
    await uploadAllImages()
  }
  
  useEffect(()=>{
    console.log(item)
  },[item])
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView className="px-5 min-h-full">
          <View className="flex flex-row justify-between mt-5">
            <View className="w-[30px]">
              <Ionicons
                name="chevron-back"
                onPress={() => router.back()}
                size={24}
                color={theme === "light" ? Colors.light.text : Colors.dark.text}
              />
            </View>
            <ThemedText className="font-dm text-xl">Add Item</ThemedText>
            <View className="w-[30px]"></View>
          </View>
          <View className="flex flex-row mt-5 items-center">
            <ThemedView
              className={`${
                step === 0 ? "bg-black" : "bg-gray-500"
              } h-[10vw] w-[10vw] rounded-full flex justify-center items-center`}
            >
              <ThemedText className="text-white">1</ThemedText>
            </ThemedView>
            <View className="w-[30vw] h-1 bg-black-100"></View>
            <ThemedView
              className={`rounded-full h-[10vw] w-[10vw] flex justify-center items-center ${
                step === 1 ? "bg-black" : "bg-gray-500"
              }`}
            >
              <ThemedText className="text-white">2</ThemedText>
            </ThemedView>
            <View className="w-[30vw] h-1 bg-black-100"></View>
            <ThemedView
              className={`rounded-full h-[10vw] w-[10vw] flex justify-center items-center ${
                step === 2 ? "bg-black" : "bg-gray-500"
              }`}
            >
              <ThemedText className="text-white">3</ThemedText>
            </ThemedView>
          </View>
          <View className="min-h-[80%] flex justify-between">
            {steps[step]}
            <View className="flex flex-row justify-evenly">
              <TouchableOpacity
                className="bg-black-100 w-[150px] py-3 rounded-md"
                disabled={step === 0 && true}
                onPress={() => setStep(step - 1)}
                activeOpacity={0.3}
              >
                <Text className="text-center text-white">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-black w-[150px] py-3 rounded-md"
                activeOpacity={0.3}
                onPress={() => {
                      if(item.auctionEndDate===""||item.auctionStartDate===""||item.startingBid===""||item.title===""||item.catagory===""||item.description===""){
                        alert("All fields are mandatory please fill them")
                      }else{
                        step<2 ? setStep(step + 1) : saveDraft()
                      }
                
                }}
                disabled={step === steps.length && true}
              >
                <Text className="text-center text-white">{step===2 ?"Save Draft":"Next" }</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Add;
