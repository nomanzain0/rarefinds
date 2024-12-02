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
  const [email, setemail] = useState('');

  const Verfiy =async() => {
    // Check if both fields are filled
    if (email) {
      try {
        const res = await request("users/reset/token","POST",{email})
        await AsyncStorage.setItem("email",email)
        await AsyncStorage.setItem("isReset","true")
        router.push("/(auth)/verify") 
      } catch (error) {
        console.log(error)
      }
    } else {
      // Alert user to fill all fields
      alert('Please fill in email');
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
          <ThemedText className="mt-40 text-2xl font-bold">| Reset Password</ThemedText>
          <ThemedText className="mt-2 mb-20">Please enter your email to continue</ThemedText>
          <View className="flex flex-row mb-5 gap-2 items-center border rounded-3xl p-2 pt-0 border-black">
            <Ionicons
              name="mail"
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              size={24}
            />
            <TextInput
              className="p-0 m-0 flex-1"
              placeholder="Enter your email"
              placeholderTextColor={'#808080'}
              caretHidden
              keyboardType="default"
              value={email}
              onChangeText={(text)=>setemail(text)}
            />
          </View>
          
          <TouchableOpacity
            className="py-4 rounded-3xl bg-black mt-10"
            activeOpacity={0.8}
            onPress={Verfiy}
          >
            <Text className="text-white text-center">Request Token</Text>
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
