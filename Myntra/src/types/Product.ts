import { ImageSourcePropType } from "react-native";

export interface Product {
  id: string;
  title: string;
  price: number;
  image: any;
  brand?: string; 
  images?: any[]; 
}


