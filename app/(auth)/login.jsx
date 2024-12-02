import { View, TextInput, useColorScheme, TouchableOpacity, Text, ScrollView, Animated } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Link, router } from 'expo-router';
import { getUser, request, setToken } from '@/lib/apiService';
import { MyUserContext } from '@/components/userContext';
import Toast from 'react-native-toast-message'; // Import the toast component

const Login = () => {
  const { setUser } = useContext(MyUserContext);
  const theme = useColorScheme();
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const login = async () => {
    if (cnic && password) {
      try {
        const res = await request("users/login", "POST", { cnic, password }); 
        await setToken(res.data.token);
        const userData = await getUser();
        setUser(userData);
        router.push("/");

        // Show success toast
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
        });
      } catch (error) {
        console.clear();

        // Show error toast
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Invalid CNIC or password. Please try again.',
        });
      }
    } else {
      // Show warning toast
      Toast.show({
        type: 'info',
        text1: 'Incomplete Fields',
        text2: 'Please fill in both CNIC and password.',
      });
    }
  };

  return (
    <SafeAreaView className={`w-full h-full bg-[${theme === 'light' ? Colors.light.background : Colors.dark.background}]`}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Animated.View className="min-h-full px-5 justify-center">
          <Text className="text-4xl font-bold text-center mb-10" style={{ color: theme === 'light' ? '#000' : '#fff' }}>
            Welcome Back
          </Text>

          {/* CNIC Input */}
          <View className="flex flex-row mb-5 gap-2 items-center border rounded-3xl p-4 bg-white shadow-lg">
            <Ionicons name="card" size={24} color={theme === 'light' ? Colors.light.icon : Colors.dark.icon} />
            <TextInput
              className="p-0 m-0 flex-1 text-black"
              placeholder="Enter CNIC"
              placeholderTextColor="#808080"
              maxLength={13}
              keyboardType="numeric"
              value={cnic}
              onChangeText={setCnic}
            />
          </View>

          {/* Password Input */}
          <View className="flex flex-row gap-2 items-center border rounded-3xl p-4 bg-white shadow-lg">
            <Ionicons name="key" size={24} color={theme === 'light' ? Colors.light.icon : Colors.dark.icon} />
            <TextInput
              className="p-0 m-0 flex-1 text-black"
              placeholder="Enter Password"
              placeholderTextColor="#808080"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color={theme === 'light' ? Colors.light.icon : Colors.dark.icon} />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <Text className="mt-5 text-right text-gray-500" onPress={() => router.push("/(auth)/reset")}>
            Forgot your password?
          </Text>

          {/* Login Button */}
          <TouchableOpacity
            className="py-4 rounded-3xl bg-black mt-10 shadow-lg"
            activeOpacity={0.9}
            onPress={login}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <Text className="text-white text-center text-lg">Login</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <Text className="text-center mt-10 text-gray-500">
            Don't have an account?{' '}
            <Link href={'/(auth)/register'} className="font-bold text-black">
              Sign Up
            </Link>
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Toast Notification */}
      <Toast />
    </SafeAreaView>
  );
};

export default Login;
