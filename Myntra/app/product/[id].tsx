import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import categoriesData from "../categorydata";

type Product = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
};

type Category = {
  name: string;
  subcategory: string[];
  image: string;
  productId: Product[];
};

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const product = useMemo<Product | null>(() => {
    for (const category of categoriesData as Category[]) {
      const found = category.productId.find((p) => p._id === id);
      if (found) return found;
    }
    return null;
  }, [id]);

  const addToWishlist = async () => {
    if (!product) return;
    try {
      const stored = await AsyncStorage.getItem("wishlist");
      const wishlist = stored ? JSON.parse(stored) : [];
      if (wishlist.find((p: Product) => p._id === product._id)) {
        Alert.alert("Already in wishlist");
        return;
      }
      wishlist.push(product);
      await AsyncStorage.setItem("wishlist", JSON.stringify(wishlist));
      Alert.alert("Wishlist", "Added to wishlist ❤️");
      router.push("/(tabs)/wishlist" as any);
    } catch {
      Alert.alert("Error", "Wishlist failed");
    }
  };

  const addToBag = async () => {
    if (!product) return;
    if (!selectedSize) {
      Alert.alert("Select size");
      return;
    }
    try {
      const stored = await AsyncStorage.getItem("bag");
      const bag = stored ? JSON.parse(stored) : [];
      bag.push({ ...product, size: selectedSize, quantity: 1 });
      await AsyncStorage.setItem("bag", JSON.stringify(bag));
      Alert.alert("Bag", "Added to bag 👜");
      router.push("/(tabs)/bag" as any);
    } catch {
      Alert.alert("Error", "Bag failed");
    }
  };

  const saveForLater = async () => {
    if (!product) return;
    try {
      const stored = await AsyncStorage.getItem("saved");
      const saved = stored ? JSON.parse(stored) : [];
      if (saved.find((p: Product) => p._id === product._id)) {
        Alert.alert("Already saved for later");
        return;
      }
      saved.push({ ...product, size: selectedSize || "N/A", quantity: 1 });
      await AsyncStorage.setItem("saved", JSON.stringify(saved));
      Alert.alert("Saved Items", "Added to Saved for Later ⭐");
      router.push("/SavedScreen");
    } catch {
      Alert.alert("Error", "Failed to save item");
    }
  };

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />

      <Image source={{ uri: product.images[0] }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>₹{product.price}</Text>

        <Text style={styles.section}>Select Size</Text>
        <View style={styles.sizes}>
          {sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeBtn,
                selectedSize === size && styles.sizeSelected,
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[
                  styles.sizeText,
                  selectedSize === size && styles.sizeTextSelected,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveBtn} onPress={saveForLater}>
            <Text style={styles.saveText}>Save for Later</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.wishlistBtn} onPress={addToWishlist}>
            <Text style={styles.wishlistText}>Wishlist</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bagBtn} onPress={addToBag}>
            <Text style={styles.bagText}>Add to Bag</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: "100%", height: 420, resizeMode: "cover" },

  info: { padding: 16 },

  brand: { color: "#666", fontSize: 14 },
  name: { fontSize: 20, fontWeight: "bold", marginVertical: 4 },
  price: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },

  section: { fontWeight: "bold", marginBottom: 8 },

  sizes: { flexDirection: "row", flexWrap: "wrap" },
  sizeBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  sizeSelected: {
    borderColor: "#FF3F6C",
    backgroundColor: "#FFE6EC",
  },
  sizeText: { fontSize: 14 },
  sizeTextSelected: { color: "#FF3F6C", fontWeight: "bold" },

  actions: { flexDirection: "row", marginTop: 16 },

  saveBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FFB800",
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  saveText: { color: "#FFB800", fontWeight: "bold" },

  wishlistBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF3F6C",
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  wishlistText: { color: "#FF3F6C", fontWeight: "bold" },

  bagBtn: {
    flex: 1,
    backgroundColor: "#FF3F6C",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  bagText: { color: "#fff", fontWeight: "bold" },
});
