import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import sculpture from "../../assets/images/sculpture.png";
import sculpture1 from "../../assets/images/sculpture1.png";
import sculpture2 from "../../assets/images/sculpture2.png";
import sculpture3 from "../../assets/images/sculpture3.png";
import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { request } from "../../lib/apiService";
import { resolveDate } from "../../lib/resolveDate";
import { MyUserContext } from "@/components/userContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios
import io from 'socket.io-client';
const SOCKET_URL = 'http://192.168.0.103:5001' || 'http://localhost:5001';



const data = [
  { img: sculpture },
  { img: sculpture1 },
  { img: sculpture2 },
  { img: sculpture3 },
];


const Product = () => {
  const theme = useColorScheme();
  const { product } = useLocalSearchParams();
  const [btnText,setBtnText] = useState("");
  const {user,fav,setFav}=useContext(MyUserContext)
  const [feedBacks,setFeedBacks]=useState([])
  const [bid, setBid] = useState({
    auctionId: "",
    bidAmount: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [comment,setComment]=useState("")
  const [agrementModal, setIsAgreementModal] = useState(false);
  const [item, setITem] = useState(null);
  const [isActive,setisActive]=useState(true)
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);  
  const router = useRouter();
  const roomId = item ? `${user._id}-${item.itemId.sellerId}` : null;
  const [currentUser, setCurrentUser] = useState(null);
  const [itemData, setItemData] = useState(null);



  const getFeedBacks=async ()=>{
    try {
      const res= await request(`feedback/${product}`,"get")
      // console.log(res.data,"feedbacks")
      setFeedBacks(res.data)
    } catch (error) {
      // console.log(error)
    }
  }
  const saveFeedBack= async()=>{
    try {
      const res = await request(`feedback/${product}`,"post",{comment})
      alert("Thank you for your feedback we appriciate it")
      setComment("")
      getFeedBacks()
    } catch (error) {
      // console.log(error)
    }
  }
  const getProduct = async () => {
    try {
      const res = await request(`items/${product}`, "get");
      setITem(res.data);
      setBtnText(res.data.status==="active"?"Place Bid":"Auction Closed")
      setisActive(res.data.status==="active"?true:false)
      setBid({
        auctionId: res.data._id,
        bidAmount: res.data.currentHighestBid + 1,
      });
    } catch (error) {
      // console.log(error);
    }
  };
  const placeBid = async () => {
    try {
      // console.log(bid);
      if(isActive){

        const res = await request("auctions/bid", "POST", bid);
        alert("Successfully placed bid");
        await getProduct();
        setIsVisible(false);
      }
    } catch (error) {
      error.response.status === 400 &&
        alert("Bid amount must be heihger then current bid");
      // console.log(error);
    }
  };

  
  const handleAgreementAcceptCase = () => {
    setIsAgreementModal(false);
    setIsVisible(true);
  };
  const addFavorite= async ()=>{
    try {
      const res = await request(`favorite/${product}`,"POST")
      const newFav= fav
      newFav.push(product)
      setFav(pre=>([...pre,...newFav]))
    } catch (error) {
      // console.log(error)
    }
  }
  const removeFavorite= async ()=>{
    try {
      const res = await request(`favorite/${product}`,"delete")
      let newFav= [...fav]
      newFav=newFav.filter(fav => fav!=product)
      setFav(newFav)
    } catch (error) {
      // console.log(error)
    }
  }
  const [imageModalVisible,setImageModalVisible]=useState(false)
  const [selectedImage, setSelectedImage]=useState("")
  useFocusEffect(
   useCallback(()=>{
     getProduct();
    getFeedBacks()
   },[])
  );
  useEffect(() => {
    const saveRecentItem = async () => {
      try {
        // Get existing recent items
        const existingRecentItems = await AsyncStorage.getItem('recentItemIds');
        let recentItemIds = existingRecentItems ? JSON.parse(existingRecentItems) : [];
        recentItemIds.unshift(product);
        recentItemIds = recentItemIds.slice(0, 10);
        recentItemIds = [...new Set(recentItemIds)];
        await AsyncStorage.setItem('recentItemIds', JSON.stringify(recentItemIds));
      } catch (error) {
        console.error('Error saving recent item:', error);
      }
    };

    saveRecentItem();
  }, [product]);


  const fetchUnreadNotifications = async (userId) => {
    // console.log("------------------------------",userId)
    try {
      const url = `${SOCKET_URL}/api/chats/notifications/${userId}`;
      // console.log('Fetching URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      // console.log('Notifications response:', data);
  
      return data.data || [];
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  };
  
    

  useEffect(() => {
    if (!user._id) return; 
    const updateNotifications = async () => {
      const unreadNotifications = await fetchUnreadNotifications(user._id);
      setUnreadCount(unreadNotifications.length);
      setNotifications(unreadNotifications);
    };
    updateNotifications();
    const interval = setInterval(updateNotifications, 5000); 
      return () => clearInterval(interval);
  }, [user._id]);
  


  const handleChatPress = async () => {
    try {
      // Validate user authentication
      if (!user?._id) {
        alert('Please log in to start a chat');
        return;
      }
  
      // Validate item data
      if (!item?._id || !item?.itemId?.sellerId || !item?.itemId?.title) {
        console.error('Invalid item data:', item);
        alert('Cannot start chat: Invalid item data');
        return;
      }
  
      // Determine if current user is seller or buyer
      const isSeller = user._id === item.itemId.sellerId;
      
      // Set otherUserId based on user role
      const otherUserId = isSeller
        ? item.bids?.[item.bids.length - 1]?.bidderId?._id // Latest bidder for seller
        : item.itemId.sellerId; // Seller ID for buyer
  
      if (!otherUserId) {
        alert(isSeller ? 'No bidders available' : 'Seller information not available');
        return;
      }
  
      // Create unique room ID combining product, seller, and buyer IDs
      const roomId = `${item._id}_${item.itemId.sellerId}_${isSeller ? otherUserId : user._id}`;
  
      // Prepare navigation parameters
      const params = {
        roomId,
        currentUserId: user._id,
        otherUserId: otherUserId,
        productId: item._id,
        productName: item.itemId.title,
        isSeller: isSeller
      };
  
      // Log navigation attempt
      // console.log('Navigation params:', params);
      if (!isSeller) {

      try {
        const url = `${SOCKET_URL}/api/chats/notifications/mark-read`;
        // console.log('Marking notifications as read:', url);
  
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user._id, roomId: roomId }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to mark notifications as read. Status: ${response.status}`);
        }
  
        // console.log('Notifications marked as read successfully');
      } catch (markReadError) {
        // console.log('Error marking notifications as read:', markReadError.message);
      }
    } 
      // Use correct pathname for navigation
      const pathname = isSeller ? '/(pages)/chatRoom' : '/(pages)/chatScreen';
  
      // Navigate using params object
      await router.push({
        pathname,
        params: params // Use params instead of query for expo-router
      });
  
    } catch (error) {
      console.error('Chat navigation error:', error);
      alert('Failed to open chat. Please try again.');
    }
  };

  


  return (
    <SafeAreaView
      className={`w-full  h-full bg-[${
        theme === "light" ? Colors.light.background : Colors.dark.background
      }]`}
    >
      <ScrollView contentContainerStyle={{ flexGrow:1 }}>
        <Modal
          transparent
          statusBarTranslucent
          animationType="fade"
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-90">
            <TouchableOpacity
              className="absolute top-10 right-5 z-10"
              onPress={() => setImageModalVisible(false)}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-[80%]"
              resizeMode="contain"
            />
          </View>
        </Modal>
        <Modal
          transparent
          statusBarTranslucent
          animationType="slide"
          onRequestClose={() => {
            setIsVisible(false);
          }}
          visible={isVisible}
        >
          <View className="bg-[#00000066] flex justify-center  items-center sw-[100vw] h-full">
            <View
              className={`bg-white rounded-2xl p-5 w-[80vw] shadow-xl shadow-black-100 ${
                theme === "light" ? "bg-white" : "bg-gray-900 border-white"
              }`}
            >
              <TextInput
                value={String(bid.bidAmount)}
                onChangeText={(text) => setBid({ ...bid, bidAmount: text })}
                className={`py-3 rounded-2xl  my-2 border px-2 ${
                  theme === "light" ? "text-black" : "text-white border-white"
                }`}
                caretHidden
                placeholderTextColor={theme === "light" ? "#808080" : "#808080"}
                keyboardType="numeric"
                placeholder="Bid Amount here"
              />
              <TouchableOpacity
                className="bg-black rounded-3xl py-5"
                onPress={placeBid}
                activeOpacity={0.8}
              >
                <Text className="text-white text-center">Place Your Bid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          transparent
          statusBarTranslucent
          animationType="slide"
          onRequestClose={() => {
            setIsAgreementModal(false);
          }}
          visible={agrementModal}
        >
          <View className="bg-[#00000066] flex justify-end items-center w-[100vw] h-full">
            <View
              className={`bg-white rounded-2xl p-5 w-[100vw] shadow-xl shadow-black-100 ${
                theme === "light" ? "bg-white" : "bg-gray-900 border-white"
              }`}
            >
              <Text>
                Welcome to Rare finds, an online platform for conducting
                auctions. By accessing or using the App, you agree to be bound
                by these Terms and Conditions. Please read this Agreement
                carefully before using our services. If you do not agree to any
                part of this Agreement, you should not use the App.
              </Text>
              <View className="flex flex-row justify-center gap-3">
                <TouchableOpacity
                  className="bg-black w-[100px] rounded-3xl flex justify-center px-5"
                  onPress={handleAgreementAcceptCase}
                  activeOpacity={0.8}
                >
                  <Text className="text-white text-center">I Agree</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-white w-[100px] border-2 border-black rounded-3xl py-2 px-5"
                  onPress={() => {
                    setIsAgreementModal(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text className="text-black text-center">I Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <ThemedView>
          <View className="w-screen h-[40vh] bg-white">
            <View className="justify-between px-5">
              <Ionicons
                size={24}
                color={"#000"}
                name="chevron-back"
                onPress={() => router.back()}
              />
            </View>
            <FlatList
              data={item && item.itemId.images}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={1} onPress={()=>{
                  setSelectedImage(item)
                  setImageModalVisible(true)
                }}>

                <Image
                source={{ uri: item }}
                resizeMode="cover"
                className={"w-screen h-[300px] "}
                />
                </TouchableOpacity>
              )}
              pagingEnabled
              horizontal
            />
          </View>
          <View className={`h-[60vh] bg-white`}>
            <ThemedView className="w-full h-full bg-gray-50 rounded-t-[30px] pt-8 px-2">
              <View className="flex flex-row items-center justify-between px-5">
                <ThemedText className="text-3xl font-dm">
                  {item && item.itemId.title}
                </ThemedText>
                {fav.includes(product)?<Ionicons name="heart" size={24} color={"#ff0000"} onPress={removeFavorite}/>:<Ionicons name="heart-outline" size={24} color={"#ff0000"} onPress={addFavorite} />}
              </View>
              <View className={`bg-gray-50 w-full px-5 py-5 rounded-xl mt-5`}>
                <View className="flex flex-row justify-between mb-2">
                  <View>
                    <Text className="text-teal-700">Current Bid</Text>
                    <Text
                      className={`text-xl font-bold ${
                        theme === "light" ? "text-black" : "text-white"
                      }`}
                    >
                      RS. {item && item.currentHighestBid}/-
                    </Text>
                  </View>
                </View>
                <View>
                  <Text className="text-teal-700">Lot Close</Text>
                  <View className="flex flex-row gap-2">
                    <Text
                      className={`font-bold ${
                        theme === "light" ? "text-black" : "text-white"
                      }`}
                    >
                      {item && resolveDate(item.itemId.auctionEndDate)}
                    </Text>
                  </View>
                </View>
              </View>

              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Text className="px-5">
                    {item && item.itemId.description}
                  </Text>
                <View
                  className={`h-[300px] w-full flex justify-between rounded-xl py-2 pt-5 px-3 bg-gray-50 mt-5 `}
                >
                  
                  <View>
                    <View className="flex flex-row items-center gap-3">
                      <View className="rounded-full p-2 bg-secondary">
                        <Ionicons
                          size={24}
                          color={Colors.light.icon}
                          name="hammer"
                        />
                      </View>
                      <ThemedText>
                        warning 1 at RS. {item && item.currentHighestBid}/-
                      </ThemedText>
                    </View>
                      <View className="flex flex-col-reverse">
                    {item &&
                      item.bids.map((bid) => (
                        <View
                          key={bid.bidAmount}
                          className="flex flex-row items-center justify-between mt-4"
                        >
                          <View className="flex flex-row gap-2 items-center">
                            <Image
                              source={{ uri: bid.bidderId.profileImage }}
                              resizeMode="cover"
                              className="w-[40px] h-[40px] rounded-full"
                            />
                            <ThemedText className="font-dm text-sm">
                              {bid.bidderId.name}
                            </ThemedText>
                          </View>
                          <ThemedText className="font-bold text-sm">
                            RS. {bid.bidAmount}/-
                          </ThemedText>
                        </View>
                      ))}
                      </View>

                  </View>
                </View>
              </ScrollView>
              {/* {item && user._id !== item.itemId.sellerId && (
  <View className="w-full flex-row items-center space-x-3 mb-2">
    <TouchableOpacity
      className="flex-1 h-[62px] bg-black rounded-3xl justify-center items-center"
      activeOpacity={0.8}
      onPress={() => {
        isActive ? setIsAgreementModal(true) : alert("Auction Closed");
      }}
    >
      <ThemedText className="text-white text-center">{btnText}</ThemedText>
    </TouchableOpacity>
    <TouchableOpacity
      className="w-[62px] h-[62px] bg-black rounded-full justify-center items-center"
      activeOpacity={0.8}
      onPress={handleChatPress} // Call the function on press

    >
      <Text style={{ color: "white", fontSize: 20 }}>💬</Text>
    </TouchableOpacity>
  </View>
)} */}

{item && (
      <View className="w-full flex-row items-center space-x-3 mb-2">
        {/* Show Place Bid button only for buyers */}
        {user._id !== item.itemId.sellerId && (
          <TouchableOpacity
            className="flex-1 h-[62px] bg-black rounded-3xl justify-center items-center"
            activeOpacity={0.8}
            onPress={() => {
              isActive ? setIsAgreementModal(true) : alert("Auction Closed");
            }}
          >
            <ThemedText className="text-white text-center">{btnText}</ThemedText>
          </TouchableOpacity>
        )}
 <TouchableOpacity
  className={`${user._id !== item.itemId.sellerId ? 'w-[62px]' : 'w-full'} h-[62px] bg-black rounded-3xl justify-center items-center relative`}
  activeOpacity={0.8}
  onPress={handleChatPress}
>
  <Text style={{ color: "white", fontSize: 20 }}>💬</Text>

  {/* Unread count badge */}
  {unreadCount > 0 && (
    <View
      style={{
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
      }}
    >
      <Text style={{ color: 'white', fontSize: 12 }}>
        {unreadCount}
      </Text>
    </View>
  )}
</TouchableOpacity>

      </View>
    )}


              <View className="p-4">
                <Text className="text-xl font-bold">Product Review</Text>
                <View className="border p-0 w-full flex flex-row justify-between items-center">
                  <TextInput className="w-[90%] border border-gray-100 p-1" value={comment} onChangeText={text=>setComment(text)} placeholder="Write your review"/>
                  <Ionicons name="send" size={20} color={"black"} onPress={saveFeedBack}/>
                </View>
                {feedBacks.map((feedback,index)=><View key={index} className="bg-gray-200 rounded-2xl p-2 mt-2">
                  <Text className="text-md font-bold">{feedback.userId.name}</Text>
                  <Text className="text-sm">{feedback.message}</Text>
                </View>)}
              </View>
            </ThemedView>
          </View>
        </ThemedView>
      </ScrollView>
      <StatusBar backgroundColor={"#fff"} />
    </SafeAreaView>
  );
};

export default Product;
