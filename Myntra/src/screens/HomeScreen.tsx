import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ThemeContext } from "@/src/context/ThemeContext";
import ProductList from "@/src/components/ProductList";
import RecentlyViewed from "@/src/components/RecentlyViewed";
import type { Product } from "@/src/types/Product";
import { products } from "@/src/data/products";

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  const handleViewProduct = (product: Product) => {
    setRecentlyViewed((prev) =>
      [product, ...prev.filter((p) => p.id !== product.id)].slice(0, 5)
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Featured Products</Text>
      <ProductList products={products} onView={handleViewProduct} />

      <Text style={[styles.heading, { color: theme.text }]}>Recently Viewed</Text>
      <RecentlyViewed products={recentlyViewed} onView={handleViewProduct} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 30 },
  heading: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
});
