import React, { useEffect, useState, useContext } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../src/context/ThemeContext";
import { useAuth } from "../../src/myntra/context/AuthContext";
import { useRouter } from "expo-router";

const getImage = (product: any) => {
  if (product?.images && product.images.length > 0) return product.images[0];
  if (product?.image) return product.image;
  return "https://via.placeholder.com/300x400.png?text=No+Image";
};

const deals = [
  {
    id: 1,
    title: "Under ₹599",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "40-70% Off",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop",
  },
];

const shirtProducts = [
  {
    _id: "shirt1",
    name: "Black Shirt",
    brand: "Brand A",
    price: 499,
    image: require("../../src/assets/black-shirt.png"),
  },
  {
    _id: "shirt2",
    name: "Red Shirt",
    brand: "Brand B",
    price: 599,
    image: require("../../src/assets/red-shirt.png"),
  },
  {
    _id: "shirt3",
    name: "Grey Shirt",
    brand: "Brand C",
    price: 549,
    image: require("../../src/assets/Grey-shirt.png"),
  },
  {
    _id: "shirt4",
    name: "Blue Shirt",
    brand: "Brand D",
    price: 629,
    image: require("../../src/assets/blue-shirt.png"),
  },
  {
    _id: "shirt5",
    name: "White Shirt",
    brand: "Brand E",
    price: 499,
    image: require("../../src/assets/white-shirt.png"),
  },
];

const categories = [
  {
    _id: "cat1",
    name: "Men",
    image: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=500",
  },
  {
    _id: "cat2",
    name: "Women",
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500",
  },
  {
    _id: "cat3",
    name: "Kids",
    image: "https://images.unsplash.com/photo-1582738418462-7be2b32a87a0?w=500",
  },
];

const youMayAlsoLike = [
  {
    _id: "rec1",
    name: "Casual Denim Shirt",
    brand: "Roadster",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
  },
  {
    _id: "rec2",
    name: "Slim Fit Shirt",
    brand: "H&M",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?w=500",
  },
  {
    _id: "rec3",
    name: "Checked Shirt",
    brand: "Levis",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=500",
  },
];

export default function Home() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    loadRecentlyViewed();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const catRes = await fetch(
        "https://myntra-clone-xj36.onrender.com/category"
      );
      const prodRes = await fetch(
        "https://myntra-clone-xj36.onrender.com/product"
      );

      const catData = await catRes.json();
      const prodData = await prodRes.json();

      setCategories(catData || []);
      setProducts(prodData || []);
    } catch (err) {
      console.log("Home fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentlyViewed = async () => {
    const stored = await AsyncStorage.getItem("recentlyViewed");
    if (stored) setRecentlyViewed(JSON.parse(stored));
  };

  const addToRecentlyViewed = async (product: any) => {
    const updated = [
      product,
      ...recentlyViewed.filter((p) => p._id !== product._id),
    ].slice(0, 5);
    setRecentlyViewed(updated);
    await AsyncStorage.setItem("recentlyViewed", JSON.stringify(updated));
  };

  const handleRecentlyViewedClick = async (product: any) => {
    await addToRecentlyViewed(product);
  };

  const handleProductPress = (id: string) => {
    if (!user) {
      router.push({ pathname: "/(auth)/login" } as any);
      return;
    }
    router.push(`/product/${id}` as any);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: theme.text }]}>MYNTRA</Text>
        <Ionicons name="search-outline" size={24} color={theme.text} />
      </View>
      
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
        }}
        style={styles.banner}
        resizeMode="cover"
      />

      <Section title="SHOP BY CATEGORY" theme={theme}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading ? (
      <ActivityIndicator color="#ff3f6c" />
    ) : (
      [
        {
          _id: "cat1",
          name: "Men",
          image: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=500",
        },
        {
          _id: "cat2",
          name: "Women",
          image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500",
        },
        {
          _id: "cat3",
          name: "Kids",
          image: "https://images.unsplash.com/photo-1582738418462-7be2b32a87a0?w=500",
        },
      ].map((cat) => (
        <View key={cat._id} style={styles.categoryCard}>
          <Image source={{ uri: cat.image }} style={styles.categoryImage} />
          <Text style={[styles.categoryText, { color: theme.text }]}>
            {cat.name}
          </Text>
        </View>
      ))
    )}
  </ScrollView>
</Section>

      <Section title="TRENDING NOW" theme={theme}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {deals.map((deal) => (
            <TouchableOpacity
              key={deal.id}
              style={[styles.featuredCard, { backgroundColor: theme.card, borderColor: theme.borderColor }]}
              onPress={() => console.log("Deal clicked:", deal.title)}
            >
              <Image source={{ uri: deal.image }} style={styles.featuredImage} />
              <View style={styles.featuredInfo}>
                <Text style={[styles.featuredName, { color: theme.text }]} numberOfLines={1}>{deal.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Section>

      <Section title="FEATURED PRODUCTS" theme={theme}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {shirtProducts.map((product) => (
            <TouchableOpacity
              key={product._id}
              style={[
                styles.featuredCard,
                { backgroundColor: theme.card, borderColor: theme.borderColor },
              ]}
              onPress={() => addToRecentlyViewed(product)}
            >
              <Image source={product.image} style={styles.featuredImage} />
              <View style={styles.featuredInfo}>
                <Text style={[styles.featuredBrand, { color: theme.text }]}>
                  {product.brand}
                </Text>
                <Text
                  style={[styles.featuredName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
                <Text style={[styles.featuredPrice, { color: theme.text }]}>
                  ₹{product.price}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Section>

      <Section title="YOU MAY ALSO LIKE" theme={theme}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {youMayAlsoLike.map((item) => (
            <View
              key={item._id}
              style={[
                styles.recommendCard,
                { backgroundColor: theme.card, borderColor: theme.borderColor },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.recommendImage} />
              <Text style={[styles.recommendBrand, { color: theme.text }]}>
                {item.brand}
              </Text>
              <Text style={[styles.recommendName, { color: theme.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.recommendPrice, { color: theme.text }]}>
                ₹{item.price}
              </Text>
            </View>
          ))}
        </ScrollView>
      </Section>

      {recentlyViewed.length > 0 && (
        <Section title="RECENTLY VIEWED" theme={theme}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentlyViewed.map((p) => (
              <TouchableOpacity
                key={p._id}
                style={[
                  styles.recentCard,
                  { backgroundColor: theme.card, borderColor: theme.borderColor },
                ]}
                onPress={() => handleRecentlyViewedClick(p)}
              >
                <Image
                  source={p.image ? p.image : { uri: getImage(p) }}
                  style={styles.recentImageMedium}
                />
                <Text style={[styles.recentText, { color: theme.text }]}>
                  {p.name}
                </Text>
                <Text style={[styles.recentPrice, { color: theme.text }]}>
                  ₹{p.price}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Section>
      )}
    </ScrollView>
  );
}

const Section = ({ title, children, theme }: any) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: { flexDirection: "row", justifyContent: "space-between", padding: 15, paddingTop: 50 },
  logo: { fontSize: 24, fontWeight: "bold" },

  banner: { width: "100%", height: 180 },

  section: { padding: 15 },
  sectionTitle: { fontSize: 17, fontWeight: "bold", marginBottom: 8 },

  categoryCard: { marginRight: 10, alignItems: "center" },
  categoryImage: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#eee" },
  categoryText: { marginTop: 5, fontSize: 11 },

  featuredCard: { width: 160, marginRight: 10, borderRadius: 10, elevation: 3, overflow: "hidden", borderWidth: 1 },
  featuredImage: { width: "100%", height: 190, backgroundColor: "#eee" },
  featuredInfo: { padding: 8 },
  featuredBrand: { fontSize: 11, color: "#777" },
  featuredName: { fontSize: 13, fontWeight: "500" },
  featuredPrice: { fontWeight: "bold", marginTop: 3, fontSize: 13 },

  recentCard: { width: 120, marginRight: 10, borderRadius: 10, borderWidth: 1, padding: 4 },
  recentImageMedium: { width: 120, height: 140, borderRadius: 10, backgroundColor: "#eee" },
  recentText: { fontSize: 11, marginTop: 3 },
  recentPrice: { fontSize: 11, fontWeight: "bold", marginTop: 2 },

  dealCard: { width: 220, marginRight: 10, borderRadius: 10, borderWidth: 1 },
  dealImage: { width: "100%", height: 130, borderRadius: 10, backgroundColor: "#eee" },
  dealTitle: { fontWeight: "bold", marginTop: 4, fontSize: 13 },

  productsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  productCard: { width: "48%", marginBottom: 15, backgroundColor: "#fff", borderRadius: 10, elevation: 3 },
  productImage: { width: "100%", height: 180, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  productInfo: { padding: 10 },
  brandName: { color: "#666", fontSize: 12 },
  productName: { fontSize: 14 },
  productPrice: { fontWeight: "bold", marginTop: 4 },

  /* ===== ADDITIONAL STYLES (APPENDED ONLY) ===== */
  recommendCard: {
    width: 150,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 6,
  },
  recommendImage: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  recommendBrand: { fontSize: 11, marginTop: 4 },
  recommendName: { fontSize: 12 },
  recommendPrice: { fontSize: 12, fontWeight: "bold", marginTop: 2 },
});
