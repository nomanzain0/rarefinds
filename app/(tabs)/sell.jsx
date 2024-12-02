import React, { useState, useContext } from "react";
import {
  View,
  Text,
  useColorScheme,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, router } from "expo-router";
import { request } from "../../lib/apiService";
import { MyUserContext } from "../../components/userContext";
import ItemCard from "../../components/ItemCard";
import illustration from "../../assets/images/20945144.jpg";

const { width } = Dimensions.get('window');

const Sell = () => {
  const theme = useColorScheme();
  const [items, setItems] = useState([]);
  const { user } = useContext(MyUserContext);

  const getItems = async () => {
    try {
      const res = await request("items/seller/", "GET");
      setItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getItems();
    }, [])
  );

  const pendingApprovalCount = items.filter(item => !item.isApproved && item.isRequested).length;

  const renderStatCard = (title, value, icon) => (
    <View style={styles.statCard}>
      <MaterialCommunityIcons name={icon} size={24} color={theme === "light" ? "#333" : "#fff"} />
      <Text style={[styles.statValue, { color: theme === "light" ? "#333" : "#fff" }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme === "light" ? "#666" : "#ccc" }]}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === "light" ? "#f7f7f7" : "#121212" }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
        colors={theme === "light" ? ['#000000', '#000000'] : ['#2c3e50', '#34495e']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seller Dashboard</Text>
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        </LinearGradient>

        <View style={styles.profileInfoContainer}>
          <Text style={[styles.profileName, { color: theme === "light" ? "#333" : "#fff" }]}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          {renderStatCard("Total Items", items.length, "cube-outline")}
          {renderStatCard("Active Auctions", items.filter(item => item.isAuctionStarted).length, "gavel")}
          {renderStatCard("Pending Approval", pendingApprovalCount, "clock-outline")}
        </View>

        <Text style={[styles.sectionTitle, { color: theme === "light" ? "#333" : "#fff" }]}>
          My Collection
        </Text>

        <View style={styles.collectionContainer}>
          {items.length ? (
            items.map((item) => (
              <ItemCard
                refresh={getItems}
                key={item._id}
                id={item._id}
                name={item.title}
                image={item.images[0]}
                bid={item.startingBid}
                status={
                  item.isAuctionStarted
                    ? "Auction Started"
                    : item.isApproved
                    ? "Approved"
                    : item.isRequested
                    ? "Requested"
                    : "Request Approval"
                }
                statusText={item.statusText}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Image source={illustration} resizeMode="contain" style={styles.illustration} />
              <Text style={[styles.emptyStateTitle, { color: theme === "light" ? "#333" : "#fff" }]}>
                Start Your Collection
              </Text>
              <Text style={[styles.emptyStateSubtitle, { color: theme === "light" ? "#666" : "#ccc" }]}>
                Add items to your collection and get insights on market trends
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/add")}
                style={styles.createButton}
              >
                <Text style={styles.createButtonText}>Create New Collection</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      {items.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/add")}
          style={styles.floatingButton}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    padding: 5,
  },
  // Updated to change text color from black to white
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',  // Changed to white
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    width: width / 3.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statTitle: {
    fontSize: 12,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  collectionContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 50,
  },
  illustration: {
    height: 200,
    width: 200,
    marginBottom: 30,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  createButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#000',
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default Sell;
