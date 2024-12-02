import React, { useContext, useState, useRef, useEffect } from "react";
import { 
  Image, 
  ScrollView, 
  StyleSheet, 
  View, 
  useColorScheme, 
  Animated, 
  TouchableOpacity, 
  Linking, 
  Alert, 
  Platform 
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "@/components/userContext";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";

const Profile = () => {
  const theme = useColorScheme();
  const { user, setUser } = useContext(MyUserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Wallet connection handler
  const handleWalletConnection = async () => {
    try {
      if (walletAddress) {
        // Disconnect wallet
        await disconnectWallet();
      } else {
        // Connect wallet
        await connectWallet();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      Alert.alert("Error", "Unable to connect wallet");
    }
  };

  // Connect wallet function with cross-platform support
  const connectWallet = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web browser connection logic
        if (window.ethereum) {
          try {
            // Request account access
            const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            });
            
            if (accounts.length > 0) {
              const address = accounts[0];
              setWalletAddress(address);
              await AsyncStorage.setItem('walletAddress', address);
              Alert.alert("Success", `Wallet Connected: ${address}`);
            }
          } catch (error) {
            if (error.code === 4001) {
              // User rejected the request
              Alert.alert("Connection Cancelled", "You cancelled the wallet connection");
            } else {
              console.error("Web3 Connection Error:", error);
              Alert.alert("Connection Error", error.message || "Failed to connect wallet");
            }
          }
        } else {
          // No Web3 provider detected
          Alert.alert(
            "MetaMask Required",
            "Please install MetaMask extension or use a Web3-compatible browser",
            [
              {
                text: "Install MetaMask",
                onPress: () => Linking.openURL('https://metamask.io/download/')
              },
              {
                text: "Cancel",
                style: "cancel"
              }
            ]
          );
        }
      } else {
        // Mobile app connection logic
        const metamaskUrl = 'https://metamask.app.link/dapp/your-app-domain.com';
        
        // Check if MetaMask is installed
        const supported = await Linking.canOpenURL(metamaskUrl);

        if (supported) {
          // Open MetaMask for connection
          await Linking.openURL(metamaskUrl);
          
          // Prompt user to copy wallet address
          Alert.alert(
            "Wallet Connection",
            "After connecting in MetaMask, please copy and paste your wallet address",
            [
              {
                text: "Paste Address",
                onPress: () => {
                  promptForWalletAddress();
                }
              },
              {
                text: "Cancel",
                style: "cancel"
              }
            ]
          );
        } else {
          // If MetaMask is not installed, guide user to install
          Alert.alert(
            "MetaMask Required",
            "Please install MetaMask to connect your wallet",
            [
              {
                text: "Install MetaMask",
                onPress: () => Linking.openURL('https://metamask.io/download/')
              },
              {
                text: "Cancel",
                style: "cancel"
              }
            ]
          );
        }
      }
    } catch (error) {
      console.error("Connection error:", error);
      Alert.alert("Error", "Failed to connect wallet");
    }
  };

  // Prompt for wallet address input
  const promptForWalletAddress = () => {
    Alert.prompt(
      "Enter Wallet Address",
      "Paste your wallet address from MetaMask",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Connect",
          onPress: async (address) => {
            // Basic wallet address validation
            if (address && address.startsWith('0x') && address.length === 42) {
              setWalletAddress(address);
              await AsyncStorage.setItem('walletAddress', address);
              Alert.alert("Success", `Wallet Connected: ${address}`);
            } else {
              Alert.alert("Invalid Address", "Please enter a valid Ethereum wallet address");
            }
          }
        }
      ]
    );
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      setWalletAddress(null);
      await AsyncStorage.removeItem('walletAddress');
      
      // Additional web-specific disconnection for Metamask
      if (Platform.OS === 'web' && window.ethereum) {
        try {
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }]
          });
        } catch (error) {
          console.log("Wallet disconnect attempt:", error);
        }
      }
      
      Alert.alert("Disconnected", "Wallet has been disconnected");
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  // Check for existing wallet connection on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      const savedAddress = await AsyncStorage.getItem('walletAddress');
      if (savedAddress) {
        setWalletAddress(savedAddress);
      }
    };
    checkWalletConnection();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkToken = async () => {
        setIsLoggedIn(false);
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.push("/onBoarding");
        } else {
          setIsLoggedIn(true);
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
              toValue: 0,
              friction: 4,
              useNativeDriver: true,
            }),
          ]).start();
        }
      };
      checkToken();
    }, [])
  );

  const MetaMaskCard = () => (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={[styles.cardContent, { backgroundColor: theme === 'light' ? '#ffffff' : '#222222' }]}>
        <View style={styles.metamaskContainer}>
          <Image 
            source={require('@/assets/images/metamask-logo.png')} 
            style={styles.metamaskLogo}
          />
          <TouchableOpacity
            style={[
              styles.metamaskButton, 
              walletAddress ? styles.disconnectButton : styles.connectButton
            ]}
            onPress={handleWalletConnection}
          >
            <ThemedText style={styles.buttonText}>
              {walletAddress ? 'Disconnect MetaMask' : 'Connect MetaMask'}
            </ThemedText>
          </TouchableOpacity>
          {walletAddress && (
            <ThemedText style={styles.accountText}>
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </ThemedText>
          )}
        </View>
      </View>
    </Animated.View>
  );

  const MenuCard = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={[styles.cardContent, { backgroundColor: theme === 'light' ? '#ffffff' : '#222222' }]}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} color={theme === 'light' ? '#000000' : '#ffffff'} size={24} />
          </View>
          <View style={styles.cardTextContainer}>
            <ThemedText style={styles.cardTitle}>{title}</ThemedText>
            <ThemedText style={styles.cardSubtitle}>{subtitle}</ThemedText>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === "light" ? "#f0f0f0" : "#1a1a1a" }]}>
      {isLoggedIn && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.profileHeader, { backgroundColor: theme === "light" ? "#ffffff" : "#222222" }]}>
            <Animated.View style={[styles.profileContent, { opacity: fadeAnim }]}>
              <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />
              <View style={styles.profileInfo}>
                <ThemedText style={styles.profileName}>{user?.name}</ThemedText>
                <ThemedText style={styles.profileCNIC}>{user?.cnic}</ThemedText>
                <ThemedText style={styles.profileEmail}>{user?.email}</ThemedText>
              </View>
            </Animated.View>
          </View>

          <View style={styles.cardsContainer}>
            {/* MetaMask Card */}
            <MetaMaskCard />
            
            {/* Menu Cards */}
            <MenuCard 
              icon="card-outline" 
              title="Billing Info" 
              subtitle="Manage your payment methods" 
              onPress={() => router.push("/(pages)/account")} 
            />
            <MenuCard 
              icon="ticket-outline" 
              title="Your Products" 
              subtitle="View and manage your listings" 
              onPress={() => router.push("/sell")} 
            />
            <MenuCard 
              icon="settings-outline" 
              title="Update Profile " 
              subtitle="Update your profile details" 
              onPress={() => router.push("/update-profile")} 
            />
            <MenuCard 
              icon="power-outline" 
              title="Logout" 
              subtitle="Sign out of your account" 
              onPress={() => {
                AsyncStorage.clear();
                router.push("/(auth)/login");
              }} 
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (previous styles remain the same)
  metamaskContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 15,
  },
  metamaskLogo: {
    width: 40,
    height: 40,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  metamaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  connectButton: {
    backgroundColor: '#F6851B', // MetaMask orange
  },
  disconnectButton: {
    backgroundColor: '#FF3333',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Profile;