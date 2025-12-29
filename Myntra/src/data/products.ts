import type { Product } from "../types/Product";

export const products: Product[] = [
  { id: "1", title: "White T-Shirt", price: 499, image: require("../assets/white-shirt.png") },
  { id: "2", title: "Black T-Shirt", price: 699, image: require("../assets/black-shirt.png") },
  { id: "3", title: "Graphic Oversized Tee", price: 899, image: require("../assets/Grey-shirt.png") },
  { id: "4", title: "Blue T-Shirt", price: 999, image: require("../assets/blue-shirt.png") },
  { id: "5", title: "Red T-Shirt", price: 799, image: require("../assets/red-shirt.png") },
];
