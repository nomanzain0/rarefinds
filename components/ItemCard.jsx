import React, { useEffect, useState } from 'react';
import { View, Image, useColorScheme, TouchableOpacity, Animated } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { request } from '@/lib/apiService';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const ItemCard = ({ id, name, bid, image, status, refresh, statusText }) => {
  const [itemStatus, setItemStatus] = useState(status);
  const [animation] = useState(new Animated.Value(0));
  const theme = useColorScheme();

  useEffect(() => {
    setItemStatus(status);
  }, [status]);

  useEffect(() => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const requestApproval = async () => {
    try {
      const res = await request(`items/${id}`, "PUT", { isRequested: true });
      if (res.status === 200) {
        setItemStatus("Requested");
        refresh();
      }
    } catch (error) {
      alert("Something went wrong while requesting");
      refresh();
      console.log(error);
    }
  };

  const startAuction = async () => {
    try {
      const res = await request("auctions/start", "POST", { itemId: id });
      if (res.status === 200) {
        setItemStatus("Item listed");
        refresh();
      }
    } catch (error) {
      refresh();
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await request(`items/${id}`, "delete");
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const scaleAndOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAndOpacity }],
        opacity: scaleAndOpacity,
      }}
      className={`${
        theme === "light" ? "bg-white" : "bg-gray-900"
      } rounded-3xl p-4 w-[92%] mx-auto mb-8 shadow-2xl`}
    >
      <ThemedView className="rounded-3xl overflow-hidden">
        <Image
          source={{ uri: image }}
          className={"w-full h-[250px]"}
          resizeMode='cover'
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '50%',
          }}
        />
        <View className="absolute bottom-4 left-4 right-4">
          <ThemedText
            className="text-white text-2xl font-bold mb-2"
            onPress={() => router.push({ pathname: `/(product)/[product]`, params: { product: id } })}
          >
            {name}
          </ThemedText>
          <ThemedText className="text-white font-semibold text-lg">
            Rs. {bid} /-
          </ThemedText>
        </View>
      </ThemedView>
      
      <View className="mt-4">
        <View className="flex flex-row justify-between items-center mb-3">
          <ThemedText
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              itemStatus === "Request Approval"
                ? "bg-gray-200 text-gray-800"
                : itemStatus === "Approved"
                ? "bg-gray-800 text-white"
                : "bg-gray-400 text-gray-900"
            }`}
            onPress={() => {
              itemStatus === "Request Approval" && requestApproval();
            }}
          >
            {itemStatus}
          </ThemedText>
          <ThemedText className={`text-sm font-medium ${statusText === "Rejected" ? "text-gray-500" : "text-gray-400"}`}>
            {statusText}
          </ThemedText>
        </View>
        
        {itemStatus === "Approved" && (
          <TouchableOpacity onPress={startAuction} className="mb-4">
            <LinearGradient
              colors={['#333', '#000']}
              style={{ padding: 12, borderRadius: 25 }}
            >
              <Animated.View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [
                    {
                      scale: animation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1.05, 1],
                      }),
                    },
                  ],
                }}
              >
                <ThemedText className="text-white font-bold text-base">
                  Start Auction
                </ThemedText>
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={handleDelete} className="bg-gray-200 py-3 rounded-xl">
          <ThemedText className="text-gray-800 text-center font-bold">Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ItemCard;