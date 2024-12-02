import {
    View,
    TextInput,
    useColorScheme,
    TouchableOpacity,
    Text,
    Image,
    ScrollView,
  } from "react-native";
  import React, { useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { ThemedView } from "@/components/ThemedView";
  import { ThemedText } from "@/components/ThemedText";
  import { Ionicons } from "@expo/vector-icons";
  import { Colors } from "@/constants/Colors";
  import { Link, router } from "expo-router";
  import * as DocumentPicker from "expo-document-picker";
  import { StatusBar } from "expo-status-bar";
  import { request, setToken } from "@/lib/apiService";
  import {uploadImage} from "@/lib/uploadImage"
import { MyUserContext } from "@/components/userContext";
import { useContext } from "react";

  const Register = () => {
    const theme = useColorScheme();
    const {user,setUser}=useContext(MyUserContext)
    const [image, setImage] = useState({
      mimeType:"image/jpeg",
      uri: user.profileImage,
    });
  
    const [formData, setFormData] = useState({
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
      profileImage:user.profileImage|| image.uri,
      cnic: user.cnic,
      contact:user.contact,
      isAdmin: false,
      isVarified: user.isVerified,
    });
  
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
    const selectImage = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "image/jpeg",
        });
        if (!result.canceled) {
          setImage(result.assets[0]);
          console.log(result.assets);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    
  
    const handleSubmit = async () => {
      const profileImage = await  uploadImage(image.uri,image.mimeType)
  
      // Check if all fields are filled and passwords match
      if(profileImage){

        try {
          const res = await request("users/profile", "put", {...formData,profileImage});
          
          if(res.status === 200) {
            setUser({...formData,profileImage})
            router.push("/profile")
          }
        } catch (error) {
          alert("Cannot update your profile info at the moment try again later")
          console.log(error);
        }
      }else{
        try {
          const res = await request("users/profile", "put", formData);
          
          if(res.status === 200) {
            setUser(formData)
            router.push("/profile")
          }
        } catch (error) {
          alert("Cannot update your profile info at the moment try again leter")
          console.log(error);
        }
      }
      
    };
  
    return (
      <SafeAreaView
        className={`w-full h-full bg-[${
          theme === "light" ? Colors.light.background : Colors.dark.background
        }]`}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ThemedView className={"min-h-screen px-5"}>
            <ThemedText className="mt-10 text-2xl font-bold">
              | Update Profile
            </ThemedText>
            <View className="flex flex-row justify-center items-center mb-10">
              <View className="h-[200px] w-[200px] rounded-full overflow-hidden border">
                <Image
                  source={{ uri: image.uri }}
                  className=" h-[200px] w-[200px]"
                  resizeMode="cover"
                />
              </View>
              <View className="bg-black absolute p-2 rounded-full bottom-0 right-24 shadow-black shadow-xl border">
                <Ionicons
                  size={24}
                  color={Colors.dark.icon}
                  name="image"
                  onPress={selectImage}
                />
              </View>
            </View>
            <View className="flex flex-row mb-5 gap-2 items-center border rounded-3xl p-2 pt-0 border-black">
              <Ionicons
                name="person"
                color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
                size={24}
              />
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                className="p-0 m-0"
                placeholder="Full Name here"
                placeholderTextColor={"#808080"}
                caretHidden
                keyboardType="default"
              />
            </View>
            <View className="flex flex-row mb-5 gap-2 items-center border rounded-3xl p-2 pt-0 border-black">
              <Ionicons
                name="mail"
                color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
                size={24}
              />
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                className="p-0 m-0"
                placeholder="Email here"
                placeholderTextColor={"#808080"}
                caretHidden
                keyboardType="email-address"
              />
            </View>
            <View className="flex flex-row mb-5 gap-2 items-center border rounded-3xl p-2 pt-0 border-black">
              <Ionicons
                name="card"
                color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
                size={24}
              />
              <TextInput
                className="p-0 m-0"
                placeholder="CNIC here"
                value={formData.cnic}
                onChangeText={(text) => setFormData({ ...formData, cnic: text })}
                placeholderTextColor={"#808080"}
                caretHidden
                keyboardType="numeric"
              />
            </View>
            <View className="flex flex-row mb-5 gap-2 items-center border rounded-3xl p-2 pt-0 border-black">
              <Ionicons
                name="call"
                color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
                size={24}
              />
              <TextInput
                className="p-0 m-0"
                placeholder="contact here"
                value={formData.contact}
                onChangeText={(text) => setFormData({ ...formData, contact: text })}
                placeholderTextColor={"#808080"}
                caretHidden
                keyboardType="numeric"
              />
            </View>
            <View className="flex flex-row mb-5 gap-2 items-center border rounded-3xl p-2 pt-0 border-black">
              <Ionicons
                name="key"
                color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
                size={24}
              />
              <TextInput
                className="p-0 m-0 flex-1"
                placeholder="Password"
                placeholderTextColor={"#808080"}
                caretHidden
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                secureTextEntry={!passwordVisible}
                keyboardType="default"
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={24}
                  color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
                />
              </TouchableOpacity>
            </View>
            <View className="flex flex-row gap-2 items-center border rounded-3xl p-2 pt-0 border-black">
              <Ionicons
                name="key"
                color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
                size={24}
              />
              <TextInput
                className="p-0 m-0 flex-1"
                placeholder="Confirm password"
                placeholderTextColor={"#808080"}
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                secureTextEntry={!confirmPasswordVisible}
                caretHidden
                keyboardType="default"
              />
              <TouchableOpacity
                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                <Ionicons
                  name={confirmPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="py-4 rounded-3xl bg-black mt-10"
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text className="text-white text-center">Update</Text>
            </TouchableOpacity>
            
          </ThemedView>
          <StatusBar
            backgroundColor={
              theme == "light" ? Colors.light.background : Colors.dark.background
            }
          />
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default Register;
  