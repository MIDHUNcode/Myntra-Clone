import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "@/src/context/ThemeContext";

export default function Wishlist() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext as React.Context<any>);

  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, []);


  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem("wishlist");
      const data = stored ? JSON.parse(stored) : [];
      setWishlist(data);
    } catch (error) {
      console.log("Wishlist fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDelete = async (index: number) => {
    try {
      const updated = wishlist.filter((_, i) => i !== index);
      setWishlist(updated);
      await AsyncStorage.setItem("wishlist", JSON.stringify(updated));
    } catch (error) {
      console.log("Wishlist delete error:", error);
    }
  };


  if (isLoading) {
    return (
      <View
        style={[
          styles.loaderContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Wishlist
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {wishlist.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={80} color="#ff3f6c" />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Your wishlist is empty
            </Text>
          </View>
        ) : (
          wishlist.map((item, index) => (
            <View
              key={index}
              style={[
                styles.wishlistItem,
                { backgroundColor: theme.background },
              ]}
            >

              <TouchableOpacity
                style={{ flexDirection: "row", flex: 1 }}
                onPress={() =>
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: item._id },
                  })
                }
              >
                <Image
                  source={{ uri: item.images?.[0] }}
                  style={styles.itemImage}
                />

                <View style={styles.itemInfo}>
                  <Text style={[styles.brandName, { color: theme.text }]}>
                    {item.brand}
                  </Text>
                  <Text style={[styles.itemName, { color: theme.text }]}>
                    {item.name}
                  </Text>

                  <View style={styles.priceContainer}>
                    <Text style={[styles.price, { color: theme.text }]}>
                      ₹{item.price}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleDelete(index)}
              >
                <Ionicons name="trash-outline" size={24} color="#ff3f6c" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    padding: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    marginVertical: 20,
  },
  wishlistItem: {
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
    overflow: "hidden",
  },
  itemImage: {
    width: 100,
    height: 120,
  },
  itemInfo: {
    flex: 1,
    padding: 15,
  },
  brandName: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    padding: 15,
    justifyContent: "center",
  },
});
