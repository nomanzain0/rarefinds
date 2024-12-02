import { View, TextInput, useColorScheme, TouchableOpacity, Text, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Link, router } from 'expo-router';
import { request } from '@/lib/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Verfiy = () => {
  const theme = useColorScheme();
  const [token, setToken] = useState('');

  const Verfiy =async() => {
    // Check if both fields are filled
    const email = await AsyncStorage.getItem('email');
    const isReset = await AsyncStorage.getItem("isReset");
    if (token) {
      try {
        if(isReset) { 
          const res = await request("users/reset/verify","POST",{email,token})
          await AsyncStorage.setItem("token",token)
          router.push("/(auth)/reset-password")
        } else{
          const res = await request("users/verify","POST",{email,token})
          await AsyncStorage.clear()
          alert("Thank you for your verification you can now login")
          router.push("/(auth)/login")
        } 
      } catch (error) {
        console.log(error)
      }
    } else {
      // Alert user to fill all fields
      alert('Please fill in both token and password.');
    }
  };

  return (
    <SafeAreaView
      className={`w-full h-full bg-[${
        theme === 'light' ? Colors.light.background : Colors.dark.background
      }]`}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView className={'min-h-full px-5'}>
          <ThemedText className="mt-40 text-2xl font-bold">| Verfiy</ThemedText>
          <ThemedText className="mt-2 mb-20">Please enter verification code to continue</ThemedText>
          <View className="flex flex-row mb-5 gap-2 items-center border rounded-3xl p-2 pt-0 border-black">
            <Ionicons
              name="lock-open"
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              size={24}
            />
            <TextInput
              className="p-0 m-0 flex-1"
              placeholder="******"
              placeholderTextColor={'#808080'}
              caretHidden
              keyboardType="numeric"
              value={token}
              maxLength={6}
              onChangeText={(text)=>setToken(text)}
            />
          </View>
          
          <TouchableOpacity
            className="py-4 rounded-3xl bg-black mt-10"
            activeOpacity={0.8}
            onPress={Verfiy}
          >
            <Text className="text-white text-center">Verfiy</Text>
          </TouchableOpacity>
          <ThemedText className="text-center mt-5">
            Don't have an account?{' '}
            <Link href={'/(auth)/register'} className="font-bold">
              Sign Up
            </Link>
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Verfiy;
