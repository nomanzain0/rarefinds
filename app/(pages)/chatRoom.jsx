import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SOCKET_URL = 'http://192.168.0.103:5001' || 'http://localhost:5001';

const ChatRoomPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const router = useRouter();
  const params = useLocalSearchParams();
  const otherUserId = params.otherUserId;
  const productName = params.productName;
  const currentUserId = params.currentUserId;
  const productId = params.productId;

  useEffect(() => {
    // console.log('Received params:', {
    //   currentUserId,
    //   otherUserId,
    //   productId,
    //   productName
    // });
    
    if (!currentUserId || !otherUserId || !productId || !productName) {
      console.error('Missing required parameters:', { params });
      alert('Missing required chat information');
      return;
    }

    fetchChatRooms();
    // Start periodic updates
    const interval = setInterval(() => {
      fetchUnreadCounts();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [currentUserId, otherUserId, productId, productName]);

  const fetchUnreadCounts = async () => {
    try {
      const url = `${SOCKET_URL}/api/chats/notifications/${currentUserId}`;
      // console.log('Fetching unread counts:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      // console.log('Unread counts response:', data);
      
      // Convert array to object with roomId as key
      const countsObject = {};
      data.data.forEach(notification => {
        if (!countsObject[notification.roomId]) {
          countsObject[notification.roomId] = 0;
        }
        countsObject[notification.roomId]++;
      });
      
      setUnreadCounts(countsObject);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      if (!productName) {
        throw new Error('Product name is required');
      }

      const url = `${SOCKET_URL}/api/chats/room/${encodeURIComponent(productName)}`;
      // console.log('Fetching URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch chat rooms: ${response.status}`);
      }

      // console.log('Fetched chat rooms:', data);
      setChatRooms(Array.isArray(data) ? data : []);
      
      // Fetch initial unread counts after getting chat rooms
      await fetchUnreadCounts();
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      alert(error.message || 'Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  };

  const openChatRoom = async (roomData) => {
    // console.log('Opening chat room with data:', roomData);
      
    // Optional: Mark messages as read when opening the chat room
    try {
      await fetch(`${SOCKET_URL}/api/chats/notifications/mark-read-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomData.roomId,
          userId: currentUserId
          
        })
      });
      
      // Update unread counts after marking as read
      await fetchUnreadCounts();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }

    router.push({
      pathname: '/chatScreen',
      params: {
        roomId: roomData.roomId,
        currentUserId: currentUserId,
        otherUserId: otherUserId,
        productName: productName,
        lastMessage: roomData.lastMessage,
        timestamp: roomData.updatedAt
      }
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading chat rooms...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false,
        title: '' 
      }} />
      <View style={styles.header}>
          <Text style={styles.title}>Chat Rooms</Text>
        <Text style={styles.subtitle}>Product: {productName}</Text>
      </View>

      {chatRooms.length === 0 ? (
        <View style={styles.emptyState}>
          <Text>No chat rooms available</Text>
        </View>
      ) : (
        // <FlatList
        //   data={chatRooms}
        //   keyExtractor={(item) => item.roomId}
        //   renderItem={({ item }) => (
        //     <TouchableOpacity
        //       style={styles.chatRoomItem}
        //       onPress={() => openChatRoom(item)}
        //     >
        //       <View style={styles.roomInfo}>
        //         <Text style={styles.roomName}>Room</Text>
        //         <Text style={styles.lastMessage} numberOfLines={1}>
        //           {item.lastMessage || 'No messages yet'}
        //         </Text>
        //         <Text style={styles.timestamp}>
        //           {formatDate(item.updatedAt)}
        //         </Text>
        //       </View>
              
        //       {/* Unread count badge */}
        //       {unreadCounts[item.roomId] > 0 && (
        //         <View style={styles.unreadBadge}>
        //           <Text style={styles.unreadCount}>
        //             {unreadCounts[item.roomId]}
        //           </Text>
        //         </View>
        //       )}
        //     </TouchableOpacity>
        //   )}
        // />
        <FlatList
  data={chatRooms}
  keyExtractor={(item) => item.roomId}
  renderItem={({ item, index }) => (
    <TouchableOpacity
      style={styles.chatRoomItem}
      onPress={() => openChatRoom(item)}
    >
      <View style={styles.roomInfo}>
        {/* Dynamically display Room 1, Room 2, etc., based on the index */}
        <Text style={styles.roomName}>{`Room ${index + 1}`}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage || 'No messages yet'}
        </Text>
        <Text style={styles.timestamp}>
          {formatDate(item.updatedAt)}
        </Text>
      </View>

      {/* Unread count badge */}
      {unreadCounts[item.roomId] > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>
            {unreadCounts[item.roomId]}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )}
/>

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  chatRoomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default ChatRoomPage;