import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { request } from '../../lib/apiService';
import { useFocusEffect } from '@react-navigation/native';
import CardMini from '@/components/CardMini';

const Payment = () => {
    const [wonItems, setWonItems] = useState([]);
    const [soldItems, setSoldItems] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    const getWonItems = async () => {
        try {
            const res = await request("items/wonItems", "GET");
            setWonItems(res.data.items);
        } catch (error) {
            console.log(error);
        }
    };

    const getSoldItems = async () => {
        try {
            const res = await request("items/soldItems", "GET");
            setSoldItems(res.data.items);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Set loading to false once data is fetched
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true); // Set loading to true when the component focuses
            getWonItems();
            getSoldItems();
        }, [])
    );

    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView>
                <View className="p-5">
                    <Text className="text-2xl font-bold text-center text-gray-800 mb-5">Won Bids</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#007AFF" />
                    ) : (
                        <View className="flex flex-row flex-wrap justify-center">
                            {wonItems.length ? (
                                wonItems.map((item, index) => (
                                    <CardMini
                                        isPayment={true}
                                        paymentText={"Make Payment"}
                                        id={item.itemId._id}
                                        key={index}
                                        img={item.itemId.images[0]}
                                        title={item.itemId.title}
                                        bid={item.currentHighestBid}
                                    />
                                ))
                            ) : (
                                <Text className="text-center text-xl text-gray-600 mt-5">You haven't won a bid yet</Text>
                            )}
                        </View>
                    )}

                    <Text className="text-2xl font-bold text-center text-gray-800 mt-10 mb-5">Sold Items</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#007AFF" />
                    ) : (
                        <View className="flex flex-row flex-wrap justify-center">
                            {soldItems.length ? (
                                soldItems.map((item, index) => (
                                    <CardMini
                                        isPayment={true}
                                        paymentText={"Appeal Payment"}
                                        id={item.itemId._id}
                                        key={index}
                                        img={item.itemId.images[0]}
                                        title={item.itemId.title}
                                        bid={item.currentHighestBid}
                                    />
                                ))
                            ) : (
                                <Text className="text-center text-xl text-gray-600">You haven't sold an item yet</Text>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Payment;
