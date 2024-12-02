import { View, Text, TouchableOpacity, Image, Animated, StyleSheet, Easing } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import img from '../assets/images/splash.png';

const OnBoarding = () => {
  const logoAnimation = useRef(new Animated.Value(0)).current; // Animation value for position
  const bounceAnimation = useRef(new Animated.Value(1)).current; // Animation value for bounce effect
  const contentAnimation = useRef(new Animated.Value(0)).current; // Animation value for content position
  const [showContent, setShowContent] = useState(false); // State to control visibility of the content

  useEffect(() => {
    // Start the drop animation when the component mounts
    Animated.timing(logoAnimation, {
      toValue: 1,
      duration: 1000, // Duration of the drop
      easing: Easing.ease,
      useNativeDriver: true, // Use native driver for performance
    }).start(() => {
      // Start the bounce animation after the drop animation completes
      Animated.sequence([
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnimation, {
              toValue: 1.1, // Scale up
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnimation, {
              toValue: 0.9, // Scale down
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 } // Bounce 3 times
        ),
        Animated.timing(bounceAnimation, {
          toValue: 1, // Return to original scale
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Show content after the bounce animation completes
        setShowContent(true);
      });
    });
  }, [logoAnimation, bounceAnimation]);

  // Interpolating the logo's position
  const logoTranslateY = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 0], // From above the view to the center
  });

  // Interpolating the content's position for upward movement
  const contentTranslateY = contentAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100], // Move upward by 100 pixels
  });

  // Function to handle button press and navigate to the appropriate screen
  const handleButtonPress = (screen) => {
    Animated.timing(contentAnimation, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      // Navigate to the appropriate screen after animation completes
      if (screen === 'login') {
        router.push("/(auth)/login");
      } else if (screen === 'register') {
        router.push("/(auth)/register"); // Navigate to the register page
      }
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateY: logoTranslateY }, { scale: bounceAnimation }],
        }}
      >
        <Image source={img} style={styles.logo} resizeMode='contain' />
      </Animated.View>

      {showContent && (
        <Animated.View
          style={{
            ...styles.contentContainer,
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          <Text style={styles.title}>Welcome To Rarefinds</Text>
          <Text style={styles.description}>
            RareFinds is a user-friendly auction app that connects buyers and sellers to bid on unique, valuable items in real time. With easy listing, live bidding, and secure transactions, RareFinds makes discovering and winning rare treasures exciting and seamless.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('login')}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('register')}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Light background color
    paddingBottom: 40,
    position: 'relative', // Allow absolute positioning for the logo
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 15, // Rounded corners for the logo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5, // Android shadow
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20, // Added space above content
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#343a40', // Darker text color for better contrast
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#495057', // Subtle text color
    marginBottom: 30, // Add some space before the buttons
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 15,
    borderRadius: 25,
    marginHorizontal: 5,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'white', // White border for contrast
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default OnBoarding;
