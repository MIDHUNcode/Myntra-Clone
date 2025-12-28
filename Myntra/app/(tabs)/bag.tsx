import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "@/src/context/ThemeContext";

export default function Bag() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);
  const [bag, setBag] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem("bag");
      const data = stored ? JSON.parse(stored) : [];
      setBag(data);
    } catch (error) {
      console.log("Fetch bag error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    try {
      const updated = bag.filter((_, i) => i !== index);
      setBag(updated);
      await AsyncStorage.setItem("bag", JSON.stringify(updated));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }

  if (bag.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Shopping Bag
          </Text>
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={64} color="#ff3f6c" />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Your bag is empty
          </Text>
        </View>
      </View>
    );
  }

  const total = bag.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Shopping Bag
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {bag.map((item, index) => (
          <View
            key={index}
            style={[
              styles.bagItem,
              {
                backgroundColor: theme.card,
                borderColor: theme.borderColor,
                borderWidth: 1,
              },
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
                <Text style={{ color: theme.text }}>{item.brand}</Text>
                <Text style={[styles.itemName, { color: theme.text }]}>
                  {item.name}
                </Text>
                <Text style={{ color: theme.text }}>
                  Size: {item.size}
                </Text>
                <Text style={[styles.itemPrice, { color: theme.text }]}>
                  ₹{item.price}
                </Text>

                <View style={styles.quantityContainer}>
                  <Text style={{ marginHorizontal: 15, color: theme.text }}>
                    {item.quantity}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleDelete(index)}
            >
              <Ionicons name="trash-outline" size={20} color="#ff3f6c" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: theme.borderColor,
            backgroundColor: theme.card,
          },
        ]}
      >
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>
            Total Amount
          </Text>
          <Text style={[styles.totalAmount, { color: theme.text }]}>
            ₹{total}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: "#ff3f6c" }]}
          onPress={() => router.push("/checkout" as any)}
        >
          <Text style={styles.checkoutButtonText}>PLACE ORDER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1 },
  header: {
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  content: { padding: 15 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 18, marginVertical: 20 },
  bagItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
    overflow: "hidden",
  },
  itemImage: { width: 100, height: 120 },
  itemInfo: { flex: 1, padding: 15 },
  itemName: { fontSize: 16, fontWeight: "500" },
  itemPrice: { fontWeight: "bold", marginVertical: 5 },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  removeButton: { padding: 15, justifyContent: "center" },
  footer: { padding: 15, borderTopWidth: 1 },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalLabel: { fontSize: 16 },
  totalAmount: { fontSize: 18, fontWeight: "bold" },
  checkoutButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutButtonText: { color: "#fff", fontWeight: "bold" },
});
