import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import metaImg from "../../assets/images/meta.png";
import { request } from '@/lib/apiService';
import { Ionicons } from '@expo/vector-icons';

const Account = () => {
  const [metamask, setMetaMask] = useState("");
  const [residenceAddress, setResidenceAddress] = useState("");
  const [hasExistingInfo, setHasExistingInfo] = useState(false);

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const fetchBillingInfo = async () => {
    try {
      const res = await request("billing", "GET");
      if (res) {
        setMetaMask(res.data.metamask);
        setResidenceAddress(res.data.residenceAddress);
        setHasExistingInfo(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    // Validation checks
    if (metamask.length !== 42) {
      Alert.alert("Invalid MetaMask Address", "Please enter a valid 42-character MetaMask address.");
      return;
    }
    if (residenceAddress.trim() === "") {
      Alert.alert("Missing Address", "Please enter your billing/residential address.");
      return;
    }

    try {
      await request("billing", "POST", { metamask, residenceAddress });
      Alert.alert("Success", "Your info added successfully");
      setHasExistingInfo(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await request("billing", {}, "DELETE");
      Alert.alert("Success", "Your info deleted successfully");
      setMetaMask("");
      setResidenceAddress("");
      setHasExistingInfo(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        {hasExistingInfo ? "Your" : "Add"} Billing Info
      </Text>
      <View style={styles.imageContainer}>
        <Image source={metaImg} style={styles.image} resizeMode='contain' />
      </View>
      {hasExistingInfo ? (
        <>
          <Text style={styles.label}>MetaMask Address</Text>
          <Text style={styles.infoText}>{metamask}</Text>
          <View style={styles.iconContainer}>
            <Ionicons name='home' color={"red"} size={50} />
          </View>
          <Text style={styles.label}>Billing/Residential Address</Text>
          <Text style={styles.infoText}>{residenceAddress}</Text>
          <TouchableOpacity style={styles.removeButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>MetaMask Address</Text>
          <TextInput
            placeholder='Enter Your MetaMask address'
            value={metamask}
            onChangeText={setMetaMask}
            maxLength={42}
            style={styles.input}
          />
          <View style={styles.iconContainer}>
            <Ionicons name='home' color={"red"} size={50} />
          </View>
          <Text style={styles.label}>Billing/Residential Address</Text>
          <TextInput
            placeholder='Your address here'
            value={residenceAddress}
            onChangeText={setResidenceAddress}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background color for a modern look
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333', // Darker color for better readability
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,  // Smaller width for the logo
    height: 100, // Smaller height for the logo
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#555',
  },
  infoText: {
    padding: 15,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    textAlign: 'center',
    backgroundColor: '#fff', // White background for contrast
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    padding: 15,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#fff', // White background for input fields
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#000', // Black button
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButton: {
    backgroundColor: 'red', // Red button for removal
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff', // White text on buttons
    fontWeight: 'bold',
  },
});

export default Account;
