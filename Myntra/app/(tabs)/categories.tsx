import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

export default function CategoriesScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCategories(categoriesData);
    setIsLoading(false);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedSubcategory(null);
    setSearchQuery("");
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setSearchQuery("");
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.subcategory.some((sub) =>
        sub.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const selectedCategoryData = selectedCategory
    ? categories.find((cat) => cat.name === selectedCategory)
    : null;

  const renderProducts = (products: Product[]) =>
    products.map((product) => (
      <TouchableOpacity
        key={product._id}
        style={styles.productCard}
        onPress={() =>
          router.push({
            pathname: "../product/[id]",
            params: { id: product._id },
          })
        }
      >
        <Image source={{ uri: product.images[0] }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.brandName}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>₹{product.price}</Text>
        </View>
      </TouchableOpacity>
    ));

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff3f6c" />
      </View>
    );
  }

  if (!categories.length) {
    return (
      <View style={styles.container}>
        <Text>Categories not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for categories"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {!selectedCategory && (
          <View style={styles.categoriesGrid}>
            {filteredCategories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={styles.categoryCard}
                onPress={() => handleCategorySelect(category.name)}
              >
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedCategoryData && (
          <View style={styles.categoryDetail}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.backButtonText}>← Back to Categories</Text>
            </TouchableOpacity>

            <Text style={styles.categoryTitle}>{selectedCategoryData.name}</Text>

            <View style={styles.productsGrid}>
              {renderProducts(selectedCategoryData.productId)}
            </View>
          </View>
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
    backgroundColor: "#fff",
  },

  header: {
    padding: 15,
    paddingTop: 50,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  searchContainer: {
    padding: 15,
  },

  searchInputContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  categoriesGrid: {
    padding: 15,
  },

  categoryCard: {
    borderRadius: 10,
    marginBottom: 15,
  },

  categoryImage: {
    width: "100%",
    height: 150,
  },

  categoryInfo: {
    padding: 15,
  },

  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
  },

  backButton: {
    marginBottom: 10,
  },

  backButtonText: {
    color: "#ff3f6c",
    fontSize: 16,
  },

  categoryDetail: {
    padding: 15,
  },

  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  productCard: {
    width: "48%",
    marginBottom: 15,
  },

  productImage: {
    width: "100%",
    height: 200,
  },

  productInfo: {
    padding: 10,
  },

  brandName: {
    color: "#666",
  },

  productName: {
    fontSize: 16,
  },

  price: {
    fontWeight: "bold",
  },
});

