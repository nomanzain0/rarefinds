import {
  View,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { StatusBar } from "expo-status-bar";
import { request } from "@/lib/apiService";
import { uploadImage } from "@/lib/uploadImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get('window');

const Register = () => {
  const theme = useColorScheme();
  const [image, setImage] = useState({
    mimeType: "image/jpeg",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbGPyydDPMhpWhZDVtQiy24G4Jye6XIlrSJiVJWSmnatKNjxdVgSnYOO-H1pC41py9hvE&usqp=CAU",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: image.uri,
    cnic: "",
    contact: "",
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    const profileImage = await uploadImage(image.uri, image.mimeType);
    const { name, email, password, confirmPassword, cnic, contact } = formData;
  
    // Initialize a variable to track if there are any errors
    let hasError = false;
  
    // Validate each field and show toast messages as needed
    if (!name) {
      showToast("info", "Invalid Input", "Full Name is required.");
      hasError = true;
    }
    if (!email || !email.includes('@')) {
      showToast("info", "Invalid Input", "Email must include '@' symbol.");
      hasError = true;
    }
    // Update validation for contact number
    if (!contact || contact.length !== 11 || !contact.startsWith("03")) {
      showToast("info", "Invalid Input", "Contact number must start with '03' and be 11 digits long.");
      hasError = true;
    }
    if (!cnic || cnic.length !== 13) {
      showToast("info", "Invalid Input", "CNIC must be 13 digits long.");
      hasError = true;
    }
    if (!password) {
      showToast("info", "Invalid Input", "Password is required.");
      hasError = true;
    }
    if (password !== confirmPassword) {
      showToast("info", "Invalid Input", "Passwords do not match.");
      hasError = true;
    }
  
    // If there are validation errors, exit early
    if (hasError) return;
  
    try {
      const res = await request("users/register", "POST", {
        ...formData,
        profileImage,
      });
      await AsyncStorage.setItem("email", email);
      if (res.status === 201) {
        router.push("/(auth)/verify");
      } else {
        showToast("error", "Registration Failed", "Please try again.");
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Registration Failed", "Please try again.");
    }
  };
  
  

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme === "light" ? "#f9f9f9" : "#1c1c1c",
      }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View style={{ width: width - 40 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              color: theme === "light" ? "#000" : "#fff",
              marginBottom: 8,
            }}
          >
            Register
          </Text>
          <Text
            style={{
              marginBottom: 20,
              textAlign: "center",
              color: "#808080",
            }}
          >
            Please Register to continue
          </Text>

          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View
              style={{
                height: 120,
                width: 120,
                borderRadius: 60,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#ddd",
                shadowOpacity: 0.3,
                shadowOffset: { width: 1, height: 1 },
                shadowRadius: 3,
                shadowColor: "#000",
              }}
            >
              <Image
                source={{ uri: image.uri }}
                style={{ height: "100%", width: "100%" }}
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: -5,
                right: -5,
                backgroundColor: "#000",
                padding: 6,
                borderRadius: 18,
                shadowOpacity: 0.4,
                shadowRadius: 2,
                shadowColor: "#000",
              }}
              onPress={selectImage}
            >
              <Ionicons size={18} color="#fff" name="image" />
            </TouchableOpacity>
          </View>

          {[
            { label: "Full Name", placeholder: "Enter your full name", key: "name", icon: "person" },
            { label: "Email", placeholder: "Enter your email", key: "email", icon: "mail" },
            { label: "Contact", placeholder: "Enter your contact number", key: "contact", icon: "call", keyboardType: "numeric" },
            
            { label: "CNIC", placeholder: "Enter your CNIC (13 digits)", key: "cnic", icon: "card", keyboardType: "numeric" },
            { label: "Password", placeholder: "Enter password", key: "password", icon: "lock-closed", secureTextEntry: !passwordVisible },
            { label: "Confirm Password", placeholder: "Confirm password", key: "confirmPassword", icon: "lock-closed", secureTextEntry: !confirmPasswordVisible },
          ].map(({ label, placeholder, key, icon, secureTextEntry, keyboardType }, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 20,
                padding: 10,
                marginBottom: 15,
                backgroundColor: theme === "light" ? "#fff" : "#3e3e3e",
                shadowOpacity: 0.2,
                shadowRadius: 5,
                width: '100%',
              }}
            >
              <Ionicons
                name={icon}
                size={24}
                color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
              />
              <TextInput
                value={formData[key]}
                onChangeText={(text) => setFormData({ ...formData, [key]: text })}
                style={{ flex: 1, marginLeft: 10, color: theme === "light" ? "#000" : "#fff" }}
                placeholder={placeholder}
                placeholderTextColor={"#808080"}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                maxLength={key === "cnic" ? 13 : undefined}
              />
              {secureTextEntry && (
                <TouchableOpacity
                  onPress={() =>
                    key === "password"
                      ? setPasswordVisible(!passwordVisible)
                      : setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  <Ionicons
                    name={
                      secureTextEntry
                        ? key === "password"
                          ? passwordVisible
                            ? "eye-off"
                            : "eye"
                          : confirmPasswordVisible
                          ? "eye-off"
                          : "eye"
                        : ""
                    }
                    size={24}
                    color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={{
              paddingVertical: 12,
              borderRadius: 20,
              backgroundColor: "#000",
              marginTop: 20,
              shadowOpacity: 0.3,
              width: '100%',
            }}
            activeOpacity={0.8}
            onPress={handleSubmit}
          >
            <Text style={{ textAlign: "center", color: "#fff", fontSize: 18 }}>
              Register
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 15, alignItems: "center" }}>
            <Text style={{ color: "#808080", textAlign: "center" }}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={{ fontWeight: "bold", color: theme === "light" ? "#000" : "#fff" }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast />
      <StatusBar backgroundColor={theme === "light" ? "#f9f9f9" : "#1c1c1c"} />
    </SafeAreaView>
  );
};

export default Register;