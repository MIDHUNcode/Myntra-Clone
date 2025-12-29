
import React from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";


const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
} as const;

export type IconSymbolName = keyof typeof MAPPING;

type IconSymbolProps = {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
};


export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  const materialName = MAPPING[name];

  if (!materialName) {
    console.warn(`IconSymbol: No mapping found for "${name}"`);
    return null;
  }

  return <MaterialIcons name={materialName} size={size} color={color} style={style} />;
}
