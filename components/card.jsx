import { View, Text,useColorScheme,TouchableOpacity } from "react-native";
import React,{useContext, useState} from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { request } from "@/lib/apiService";
import { MyUserContext } from "./userContext";

const Card= ({ img, title, id,currentHighestBid,lotClosing }) => {
    const theme = useColorScheme()
    const {fav,setFav}=useContext(MyUserContext)
  const addFavorite= async ()=>{
    try {
      const res = await request(`favorite/${id}`,"POST")
      const newFav= fav
      newFav.push(id)
      setFav(pre=>([...pre,...newFav]))
    } catch (error) {
      console.log(error)
    }
  }
  const removeFavorite= async ()=>{
    try {
      const res = await request(`favorite/${id}`,"delete")
      let newFav= [...fav]
      newFav=newFav.filter(fav => fav!=id)
      console.log(newFav)
      setFav(newFav)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <TouchableOpacity activeOpacity={1} onPress={()=> router.push({pathname:`/(product)/[product]`,params:{product:id}})}>
    <ThemedView className="w-[250px] h-[350px] mr-5 rounded-3xl p-3 bg-gray-50">
      <View className="flex flex-row justify-center bg-none">
        <Image
          source={{uri:img}}
          className={"w-full h-[200px] rounded-xl"}
          resizeMode="cover"
        ></Image>
      </View>
      <ThemedView className={`flex justify-end w-full ${theme==="light" ?'bg-gray-50':'bg-black-100'} `}>
        <View className="flex flex-row justify-between w-full mt-2">
          <ThemedText className="font-dm text-xl w-2/3">{title}</ThemedText>
          {fav.includes(id)?<Ionicons size={24} name="heart" color={"#ff0000"} onPress={removeFavorite}/>:
          <Ionicons size={24} name="heart-outline" color={"#ff0000"} onPress={addFavorite}/>}
        </View>
        <ThemedText className="text-teal-800">Current : RS. {currentHighestBid}/-</ThemedText>
        <ThemedText className="">Closes: {lotClosing}</ThemedText>
      </ThemedView>
    </ThemedView>
    </TouchableOpacity>
  );
};

export default Card;
