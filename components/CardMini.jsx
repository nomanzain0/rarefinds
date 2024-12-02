import {TouchableOpacity, View, Text, useColorScheme ,Modal} from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from './ThemedView'
import { ThemedText } from './ThemedText'
import { Image } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
const CardMini  = ({img,title,bid,id,isPayment,paymentText}) => {
  const [imageModalVisible,setImageModalVisible]=useState(false)
    const theme = useColorScheme()
    const handlePress=()=>{
      if(isPayment){
        setImageModalVisible(true)
      }else{
        router.push({pathname:"/(product)/[product]",params:{product:id}})
      }
    }
  return (
    <>
    <Modal
          transparent
          statusBarTranslucent
          animationType="fade"
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-90">
            <TouchableOpacity
              className="absolute top-10 right-5 z-10"
              onPress={() => setImageModalVisible(false)}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
           <View className="w-[70%] rounded-lg h-fit  bg-white">
            <Text className="text-xl p-5 text-center">Please proceed to payment</Text>
            <TouchableOpacity className="mb-5" onPress={()=>{setImageModalVisible(false)}}><Text className="bg-black text-white text-center rounded-full text-xl p-5 w-[70%] mx-auto">{paymentText}</Text></TouchableOpacity>
           </View>
          </View>
        </Modal>
    <ThemedView className={  `w-[200px] h-[250px] rounded p-4  mt-3`}>
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>

      <View className={`${theme==="light" ?'bg-gray-50':'bg-black-100'}`}>
      <Image source={{uri:img}} className="w-full h-[150px]" resizeMode='cover'></Image>
      <View className="flex justify-start items-start p-2">
      <ThemedText className="text-left text-xl font-bold ">{title}</ThemedText>
      <ThemedText className="text-teal-500">RS. {bid}/-</ThemedText>
      </View>

      </View>
      </TouchableOpacity>
    </ThemedView>
    </>
  )
}

export default CardMini