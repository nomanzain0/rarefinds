import { View, TextInput, useColorScheme, TouchableOpacity, Text, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Link, router } from 'expo-router';
import { request } from '../../lib/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResetPassword = () => {
  const theme = useColorScheme();
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const updatePassword = async () => {
    const email = await AsyncStorage.getItem("email");
    const token = await AsyncStorage.getItem("token");
    if (email && password) {
      try {
        const res = await request("users/reset/set-password", "POST", { email, password, token });
        console.log(res.data);
        await AsyncStorage.clear();
        alert("Your password updated successfully. You can now login.");
        router.push("/(auth)/login");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Please fill in the password.');
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
          <ThemedText className="mt-40 text-2xl font-bold">| Update password</ThemedText>
          <ThemedText className="mt-2 mb-20">Please enter new password to continue</ThemedText>
          <View className="flex flex-row gap-2 items-center border rounded-3xl p-2 pt-0 border-black">
            <Text style={{ fontSize: 24, color: theme === 'light' ? Colors.light.icon : Colors.dark.icon }}>🔑</Text>
            <TextInput
              className="p-0 m-0 flex-1"
              placeholder="Password here"
              placeholderTextColor={'#808080'}
              caretHidden
              keyboardType="default"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Text style={{ fontSize: 24, color: theme === 'light' ? Colors.light.icon : Colors.dark.icon }}>
                {passwordVisible ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="py-4 rounded-3xl bg-black mt-10"
            activeOpacity={0.8}
            onPress={updatePassword}
          >
            <Text className="text-white text-center">Update Password</Text>
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

export default ResetPassword;