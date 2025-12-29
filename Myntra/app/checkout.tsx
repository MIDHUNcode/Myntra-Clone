import { useAuth } from "../src/myntra/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../src/context/ThemeContext";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);

  const [fullName, setFullName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push("/(auth)/login" as any);
      return;
    }

    if (!fullName || !address1 || !city || !stateName || !postalCode || !country) {
      Alert.alert("Incomplete Address", "Please fill all shipping address fields.");
      return;
    }

    if (!cardNumber || !expiryDate || !cvv) {
      Alert.alert("Incomplete Payment", "Please fill all payment details.");
      return;
    }

    setLoading(true);

    try {
      const bagData = await AsyncStorage.getItem("bag");
      const bag = bagData ? JSON.parse(bagData) : [];

      if (bag.length === 0) {
        Alert.alert("Bag Empty", "Please add items to bag");
        return;
      }

      const total = bag.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );

      const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: "Placed",
        items: bag,
        total,
        shippingAddress: { fullName, address1, address2, city, stateName, postalCode, country },
        payment: { cardNumber, expiryDate, cvv },
      };

      const storedOrders = await AsyncStorage.getItem("orders");
      const orders = storedOrders ? JSON.parse(storedOrders) : [];
      orders.push(newOrder);

      await AsyncStorage.setItem("orders", JSON.stringify(orders));
      await AsyncStorage.removeItem("bag");

      Alert.alert("Order Placed", "Your order has been placed successfully!");
      router.replace("/orders");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong while placing the order.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    placeholder: string,
    value: string,
    setter: any,
    keyboardType: any = "default",
    secureTextEntry = false
  ) => (
    <TextInput
      style={[styles.input, { backgroundColor: "#f5f5f5", color: "#000" }]} // Text typed is always dark
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={setter}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Checkout</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.icon}>📍</Text>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Shipping Address</Text>
          </View>
          <View style={styles.form}>
            {renderInput("Full Name", fullName, setFullName)}
            {renderInput("Address Line 1", address1, setAddress1)}
            {renderInput("Address Line 2", address2, setAddress2)}
            <View style={styles.row}>
              {renderInput("City", city, setCity)}
              {renderInput("State", stateName, setStateName)}
            </View>
            <View style={styles.row}>
              {renderInput("Postal Code", postalCode, setPostalCode)}
              {renderInput("Country", country, setCountry)}
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.icon}>💳</Text>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Payment Method</Text>
          </View>
          <View style={styles.form}>
            {renderInput("Card Number", cardNumber, setCardNumber, "number-pad")}
            <View style={styles.row}>
              {renderInput("Expiry Date", expiryDate, setExpiryDate)}
              {renderInput("CVV", cvv, setCvv, "number-pad", true)}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && { opacity: 0.6 }]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderButtonText}>
            {loading ? "Placing..." : "PLACE ORDER"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 15, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  content: { flex: 1, padding: 15 },
  section: { marginBottom: 20, borderRadius: 10, padding: 15, elevation: 5 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  icon: { fontSize: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  form: { gap: 10 },
  input: { padding: 15, borderRadius: 10, fontSize: 16, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
  footer: { padding: 15, borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  placeOrderButton: { backgroundColor: "#ff3f6c", padding: 15, borderRadius: 10, alignItems: "center" },
  placeOrderButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
