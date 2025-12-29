import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Product } from "../types/Product";
import ProductCard from "./ProductCard";
import { ThemeContext } from "@/src/context/ThemeContext";

interface Props {
  products: Product[];
  onView: (product: Product) => void;
}

const RecentlyViewed: React.FC<Props> = ({ products, onView }) => {
  const { theme } = useContext(ThemeContext);

  if (!products || products.length === 0) {
    return (
      <Text style={[styles.emptyText, { color: theme.text }]}>
        No recently viewed products.
      </Text>
    );
  }

  return (
    <FlatList
      data={products}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard product={item} onPress={onView} small />}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: { paddingLeft: 5, paddingVertical: 10 },
  emptyText: { marginVertical: 10 },
});

export default RecentlyViewed;
