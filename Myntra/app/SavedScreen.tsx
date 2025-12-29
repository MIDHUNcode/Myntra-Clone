
import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../src/context/ThemeContext";

type SavedItem = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
  size: string;
  quantity: number;
};

export default function SavedScreen() {
  const { theme } = useContext(ThemeContext);

  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = async () => {
    const stored = await AsyncStorage.getItem("saved");
    const saved = stored ? JSON.parse(stored) : [];
    setSavedItems(saved);
  };

  const moveToBag = async (itemId: string) => {
    const item = savedItems.find((i) => i._id === itemId);
    if (!item) return;

    const updatedSaved = savedItems.filter((i) => i._id !== itemId);
    setSavedItems(updatedSaved);
    await AsyncStorage.setItem("saved", JSON.stringify(updatedSaved));

    const storedBag = await AsyncStorage.getItem("bag");
    const bag = storedBag ? JSON.parse(storedBag) : [];
    bag.push(item);
    await AsyncStorage.setItem("bag", JSON.stringify(bag));

    Alert.alert("Moved", "Item moved to Bag 👜");
  };

  if (savedItems.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.center, { color: theme.text }]}>No saved items yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {savedItems.map((item) => (
        <View key={item._id} style={[styles.itemCard, { backgroundColor: theme.card }]}>
          <Image source={{ uri: item.images[0] }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.size}>Size: {item.size}</Text>
            <Text style={styles.quantity}>Qty: {item.quantity}</Text>

            <TouchableOpacity style={styles.moveBtn} onPress={() => moveToBag(item._id)}>
              <Text style={styles.moveText}>Move to Bag</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  itemCard: { flexDirection: "row", marginBottom: 16, borderRadius: 10, overflow: "hidden" },
  image: { width: 100, height: 120 },
  info: { flex: 1, padding: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  brand: { fontSize: 14, color: "#666" },
  price: { fontSize: 16, fontWeight: "bold", marginVertical: 4 },
  size: { fontSize: 14, color: "#333" },
  quantity: { fontSize: 14, color: "#333" },
  moveBtn: { marginTop: 10, padding: 10, backgroundColor: "#FF3F6C", borderRadius: 6, alignItems: "center" },
  moveText: { color: "#fff", fontWeight: "bold" },
});
