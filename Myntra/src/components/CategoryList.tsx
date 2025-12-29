
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, ListRenderItem } from "react-native";

type Category = {
  name: string;
  subcategory: string[];
  image: string;
  productId: string;
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/category") 
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  const renderItem: ListRenderItem<Category> = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.sub}>{item.subcategory.join(", ")}</Text>
    </View>
  );

  if (loading) return <Text style={styles.loadingText}>Loading categories...</Text>;

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.productId}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: { paddingVertical: 10, alignItems: "center" },
  card: { margin: 10, alignItems: "center" },
  image: { width: 200, height: 150, borderRadius: 10 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 5 },
  sub: { color: "gray", textAlign: "center" },
  loadingText: { textAlign: "center", marginTop: 20, fontSize: 16 },
});

export default CategoryList;
