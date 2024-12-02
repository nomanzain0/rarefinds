import { View, Text, TextInput, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { request } from '@/lib/apiService';
import CardMini from '@/components/CardMini';

const Search = () => {
    const theme = useColorScheme();
    const { search } = useLocalSearchParams();
    const [searchKey, setSearchKey] = useState(search);
    const [isSearchComplete, setIsSearchComplete] = useState(false);
    const [items, setItems] = useState([]);

    const searchNow = async () => {
        try {
            const res = await request(`items/search/${searchKey}`, 'GET');
            console.log(res);
            setItems(res.data);
            setIsSearchComplete(true);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (search) {
            searchNow();
        }
    }, [search]);

    return (
        <SafeAreaView className="h-full bg-white">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <ThemedView className="min-h-full">
                    {/* Added a marginTop for positioning */}
                    <View className="flex flex-row justify-between items-center p-3 mt-10">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color={theme === 'light' ? Colors.light.text : Colors.dark.text}
                            />
                        </TouchableOpacity>
                        <View style={styles.searchContainer}>
                            <TextInput
                                value={searchKey}
                                onChangeText={text => setSearchKey(text)}
                                style={[
                                    styles.searchInput,
                                    { borderColor: theme === 'light' ? Colors.light.border : Colors.dark.border },
                                ]}
                                placeholderTextColor="#808080"
                                onSubmitEditing={searchNow} // Trigger search on submit
                                // Removed placeholder
                            />
                        </View>
                        <TouchableOpacity onPress={searchNow} style={styles.searchButton}>
                            <Ionicons
                                name="search"
                                size={24}
                                color={theme === 'light' ? Colors.light.text : Colors.dark.text}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        {isSearchComplete && items.length === 0 && (
                            <Text className="text-center text-md mt-5 px-4">Items for this keyword not found</Text>
                        )}
                        {items.map((item, index) => (
                            <CardMini
                                id={item.itemId._id}
                                key={index}
                                img={item.itemId.images[0]}
                                title={item.itemId.title}
                                bid={item.currentHighestBid}
                            />
                        ))}
                    </View>
                </ThemedView>
            </ScrollView>
            <StatusBar
                backgroundColor={theme === 'light' ? Colors.light.background : Colors.dark.background}
            />
        </SafeAreaView>
    );
};

const styles = {
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        flex: 1,
        marginLeft: 10,
        backgroundColor: '#f0f0f0', // Light gray background for the search input
        height: 40, // Ensure the container height matches the input height
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        fontSize: 16,
        color: 'black', // Change this based on theme
    },
    searchButton: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default Search;
