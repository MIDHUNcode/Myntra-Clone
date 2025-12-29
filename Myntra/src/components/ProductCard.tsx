import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Product } from "../types/Product";
import { ThemeContext } from "@/src/context/ThemeContext";

interface Props {
  product: Product;
  onPress: (product: Product) => void;
  small?: boolean;
}

const ProductCard: React.FC<Props> = ({ product, onPress, small = false }) => {
  const { theme } = useContext(ThemeContext);

  const imageSource = product.images && product.images.length > 0 ? product.images[0] : product.image;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={() => onPress(product)}
    >
      {imageSource ? (
        <Image
          source={imageSource} 
          style={[styles.image, small && { height: 120, width: 120 }]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.image,
            small && { height: 120, width: 120 },
            { backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: "#666" }}>No Image</Text>
        </View>
      )}

      {product.brand && <Text style={[styles.brand, { color: theme.text }]}>{product.brand}</Text>}

      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {product.title}
      </Text>

      <Text style={[styles.price, { color: theme.text }]}>₹{product.price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140, 
    height: 180,         
    marginRight: 10,     
    borderRadius: 10,
    padding: 7,          
    elevation: 3,
  },
  image: {
    width: 120,         
    height: 120,         
    borderRadius: 8,
    marginBottom: 6,     
  },
  brand: { fontSize: 11, color: "#666" },
  name: { fontSize: 13, fontWeight: "bold" },
  price: { fontSize: 13, fontWeight: "bold", marginTop: 3 },
});
export default ProductCard;
