import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
const categories =['Jewellery','Painting','Bike','Coin','Gadgets','Documents','Sculptures','Furnitures',]
const Catagory = () => {
  return (
    <SafeAreaView>
        <View className="bg-white h-full px-4"
        >

      <Text className="text-2xl text-center mt-5 font-bold">Search from our huge catalogue</Text>
      <View className="flex flex-row gap-4 flex-wrap mt-4 justify-center">

        {categories.map((category,index)=><Text key={index} className=" px-8 py-4 border-2 rounded-full text-lg w-[40%] text-white bg-black-100 text-center" onPress={()=>{
            router.push({pathname:"/search/[search]",params:{search:category}})
        }}>{category}</Text>)}
        </View>
        </View>
    </SafeAreaView>
  )
}

export default Catagory