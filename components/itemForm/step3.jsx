import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { router } from 'expo-router'
import { request } from '@/lib/apiService'
import { uploadImage } from '@/lib/uploadImage'
const Step3 = ({item,images}) => {
    const requestApproval=async ()=>{
      console.log("request approval")
      let imageLinks=[]
      for(let image of images){
        let link = await uploadImage(image.uri,image.mimeType)
        imageLinks.push(link)
      }
      try {
        const data = {...item,isRequested:true,images:imageLinks}
        const res = await request("items/","POST",data)
        console.log("requested",res)
        if(res.status===201){
          alert("request for approval has been sent successfully")
          router.push("/sell")
        }
      } catch (error) {
        console.log(error)
        alert("something went wrong")
      }
    }
  return (
    <ThemedView>
      <ThemedText className="text-xl font-dm mt-5">All set !</ThemedText>
      <ThemedText>
        Your Item is Ready now. would u like to request listing approval.
      </ThemedText>
      <TouchableOpacity className="py-5 w-full bg-black rounded-lg mt-5" activeOpacity={1} onPress={requestApproval}>
        <Text className="text-center text-white">Request for Approval</Text>
      </TouchableOpacity>
    </ThemedView>
  )
}

export default Step3