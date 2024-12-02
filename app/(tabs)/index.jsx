import { Image, StyleSheet, Platform, View, FlatList } from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react"; // Added useCallback
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CatagoryButton from "@/components/buttons/CatagoryButton";
import Card from "@/components/card";
import CardMini from "@/components/CardMini";
import DemandCard from "@/components/DemandCard";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser, request } from "@/lib/apiService";
import { MyUserContext } from "@/components/userContext";
import { useFocusEffect } from "expo-router";

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const { setUser } = useContext(MyUserContext);
  const { setFav } = useContext(MyUserContext);
  const [exploreAll, setExploreAll] = useState(false);
  const [isRecent, setIsRecent] = useState(false);
  const [demandedItems, setDemandedItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [catagory, setCatagory] = useState("hotitem");

  const getDemandedItems = async () => {
    try {
      const res = await request("items/demanded", "GET");
      setDemandedItems(res.data);
    } catch (error) {
      console.log("Error fetching demanded items:", error);
    }
  };

  const getRecentItems = async () => {
    try {
      if (isRecent) {
        const recentItemIds = await AsyncStorage.getItem('recentItemIds');
        if (recentItemIds) {
          const parsedIds = JSON.parse(recentItemIds);
          const res = await request("items/recent", "POST", { ids: parsedIds });
          setRecentItems(res.data);
        } else {
          console.log("No recent items found in AsyncStorage");
          setRecentItems([]);
        }
      } else {
        const res = await request("items", "GET");
        setRecentItems(res.data);
      }
    } catch (error) {
      console.log("Error fetching recent items:", error);
    }
  };

  const getFav = async () => {
    try {
      const res = await request("favorite/ids", "GET");
      setFav(res.data.favorites.itemIds);
    } catch (error) {
      console.log("Error fetching favorite items:", error);
    }
  };

  const getItems = async () => {
    try {
      let res;
      if (catagory === "favorite") {
        res = await request("favorite", "GET");
        setItems(res.data.items);
      } else {
        res = await request("items", "GET");
        setItems(res.data);
      }
    } catch (error) {
      console.log("Error fetching items:", error);
    }
  };

  // Use useCallback to memoize the viewableItemsChanged function
  const viewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const theme = useColorScheme() ?? "light";
  const getData = async () => {
    const userData = await getUser();
    if (userData) {
      setUser(userData);
    } else {
      router.push("/(auth)/login");
    }
    getItems();
  };

  const checkToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.push("/onBoarding");
    } else {
      getFav();
      getData();
      getDemandedItems();
      getRecentItems();
    }
  };

  useEffect(() => {
    getItems();
  }, [catagory]);

  useEffect(() => {
    getRecentItems();
  }, [isRecent]);

  useFocusEffect(
    React.useCallback(() => {
      checkToken();
    }, [])
  );

  return (
    <SafeAreaView
      className={`w-full h-full bg-[${
        theme === "light" ? Colors.light.background : Colors.dark.background
      }]`}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {!exploreAll ? (
          <ThemedView className="min-h-full pt-16">
            <ThemedView className="px-5">
              <ThemedView className="flex flex-row justify-between gap-5">
                <ThemedText className="text-3xl w-8/12 font-dm">
                  Unearth Treasure, Bid for Rarities
                </ThemedText>
                <Ionicons
                  name="search"
                  onPress={() => router.push("/search/search")}
                  size={28}
                  color={theme === "light" ? Colors.light.text : Colors.dark.text}
                />
              </ThemedView>
              <ThemedView>
                <ScrollView horizontal={true} className="mt-6">
                  <CatagoryButton
                    isActive={catagory === "hotitem"}
                    text="Hot Items"
                    handlePress={() => setCatagory("hotitem")}
                  />
                  <CatagoryButton
                    isActive={catagory === "favorite"}
                    text="Favourites"
                    handlePress={() => setCatagory("favorite")}
                  />
                  <CatagoryButton
                    text="Category"
                    handlePress={() => router.push("/search/catagory")}
                  />
                </ScrollView>
              </ThemedView>

              <ThemedView className="mt-5 overflow-visible">
                <FlatList
                  data={items}
                  renderItem={({ item }) =>
                    item.itemId &&
                    item.itemId.images &&
                    item.itemId.images.length > 0 ? (
                      <Card
                        key={item.itemId._id}
                        id={item.itemId._id}
                        currentHighestBid={item.currentHighestBid}
                        img={item.itemId.images[0]} // Safe access
                        title={item.itemId.title}
                        lotClosing={new Date(item.itemId.auctionEndDate).toLocaleString()}
                      />
                    ) : null
                  }
                  horizontal
                  bounces={false}
                />
              </ThemedView>

              <ThemedText className="font-dm my-3 text-xl">
                Auction lots for your
              </ThemedText>
            </ThemedView>

            <ThemedView className="flex flex-row justify-evenly">
              <ThemedText
                className={!isRecent && "font-bold"}
                onPress={() => setIsRecent(false)}
              >
                New Arrival
              </ThemedText>
              <ThemedText
                className={isRecent && "font-bold"}
                onPress={() => setIsRecent(true)}
              >
                Recent Items
              </ThemedText>
            </ThemedView>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex flex-row flex-wrap">
                {recentItems.slice(0, 6).map((item, index) =>
                  item.itemId &&
                  item.itemId.images &&
                  item.itemId.images.length > 0 ? (
                    <CardMini
                      img={item.itemId.images[0]} // Safe access
                      key={index}
                      id={item.itemId._id}
                      title={item.itemId.title}
                      bid={item.currentHighestBid}
                    />
                  ) : null
                )}
              </View>
            </ScrollView>

            <View className="px-3">
              <TouchableOpacity
                className="bg-black flex flex-row justify-center items-start rounded-3xl my-3 py-5"
                activeOpacity={1}
                onPress={() => setExploreAll(true)}
              >
                <ThemedText className="text-white text-center mr-3">
                  Explore More
                </ThemedText>
                <Ionicons size={24} color={"#fff"} name="arrow-forward" />
              </TouchableOpacity>
            </View>

            <ThemedView>
              <ThemedText className="text-3xl px-5 mt-5 font-dm">
                Highly Demanded Items
              </ThemedText>
              <FlatList
                data={demandedItems}
                renderItem={({ item }) => (
                  <DemandCard
                    id={item._id}
                    img={item.image}
                    title={item.title}
                  />
                )}
                horizontal
                bounces={false}
                pagingEnabled
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                showsHorizontalScrollIndicator={false}
              />
              <ThemedView className="flex flex-row justify-center gap-3">
                {demandedItems.map((_, i) => (
                  <View
                    className={`w-2 h-2 border border-black rounded-full ${
                      i === currentIndex && "bg-black"
                    }`}
                    key={i}
                  />
                ))}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        ) : (
          <ThemedView className="min-h-full">
            <View>
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
                onPress={() => setExploreAll(false)}
              />
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex flex-row flex-wrap">
                {recentItems.slice(0, 6).map((item, index) =>
                  item.itemId &&
                  item.itemId.images &&
                  item.itemId.images.length > 0 ? (
                    <CardMini
                      img={item.itemId.images[0]} // Safe access
                      key={index}
                      id={item.itemId._id}
                      title={item.itemId.title}
                      bid={item.currentHighestBid}
                    />
                  ) : null
                )}
              </View>
            </ScrollView>
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
