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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "@/src/context/ThemeContext";

export default function Orders() {
  const { theme } = useContext(ThemeContext);

  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const stored = await AsyncStorage.getItem("orders");
      const data = stored ? JSON.parse(stored) : [];
      setOrders(data.reverse());
    } catch (error) {
      console.log("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (id: number) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const cancelOrder = async (id: number) => {
    try {
      const updatedOrders = orders.filter((order) => order.id !== id);
      setOrders(updatedOrders);
      await AsyncStorage.setItem("orders", JSON.stringify(updatedOrders));
    } catch (error) {
      console.log("Cancel order error:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.text }]}>No Orders Found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Orders</Text>
      </View>

      <ScrollView style={styles.content}>
        {orders.map((order) => (
          <View
            key={order.id}
            style={[
              styles.orderCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.borderColor || "#eee",
                borderWidth: 1,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.orderHeader}
              onPress={() => toggleOrder(order.id)}
            >
              <View>
                <Text style={[styles.orderId, { color: theme.text }]}>
                  Order #{order.id}
                </Text>
                <Text style={[styles.orderDate, { color: theme.text }]}>
                  {new Date(order.date).toDateString()}
                </Text>
              </View>
              <Text style={[styles.orderStatus, { color: "#00b852" }]}>{order.status}</Text>
            </TouchableOpacity>

            {order.items.map((item: any, index: number) => (
              <View key={index} style={styles.orderItem}>
                <Image
                  source={{ uri: item.images?.[0] }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={[styles.brand, { color: theme.text }]}>{item.brand}</Text>
                  <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.price, { color: theme.text }]}>
                    ₹{item.price} × {item.quantity}
                  </Text>
                </View>
              </View>
            ))}

            {expandedOrder === order.id && (
              <View style={[styles.details, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>📦 Status: {order.status}</Text>
                <Text style={{ color: theme.text }}>🚚 Delivery in 3–5 days</Text>
              </View>
            )}

            <View style={styles.footer}>
              <Text style={[styles.total, { color: theme.text }]}>
                Total: ₹{order.total}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => toggleOrder(order.id)}>
                  <Text style={[styles.detailsBtn, { color: "#ff3f6c" }]}>
                    {expandedOrder === order.id ? "Hide" : "View"} Details
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => cancelOrder(order.id)}
                  style={{ marginLeft: 15 }}
                >
                  <Text style={[styles.detailsBtn, { color: "#ff0000" }]}>
                    Cancel Order
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 15, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  content: { padding: 15 },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 18 },
  orderCard: {
    borderRadius: 10,
    marginBottom: 15,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
  },
  orderId: { fontWeight: "bold", fontSize: 16 },
  orderDate: { color: "#777" },
  orderStatus: { fontWeight: "bold" },
  orderItem: { flexDirection: "row", padding: 15 },
  itemImage: { width: 80, height: 100, borderRadius: 5 },
  itemInfo: { marginLeft: 15 },
  brand: { color: "#666" },
  name: { fontSize: 16 },
  price: { fontWeight: "bold", marginTop: 5 },
  details: { padding: 15 },
  footer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: { fontSize: 16, fontWeight: "bold" },
  detailsBtn: { fontWeight: "bold" },
});
