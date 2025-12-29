export const lightTheme = {
  mode: "light",
  background: "#FFFFFF",
  card: "#F5F5F5",
  text: "#000000",
  buttonBackground: "#1e40af",
  buttonTextColor: "#FFFFFF",
  borderColor: "#E0E0E0",
  tint: "#007AFF",
};

export const darkTheme = {
  mode: "dark",
  background: "#1C1C1C",
  card: "#2A2A2A",
  text: "#FFFFFF",
  buttonBackground: "#FFFFFF",
  buttonTextColor: "#000000",
  borderColor: "#333333",
  tint: "#1E90FF",
};

export type ThemeType = typeof lightTheme;

export const Colors = {
  light: lightTheme,
  dark: darkTheme,
};

export const Fonts = {
  rounded: "NunitoSans_700Bold",
  regular: "NunitoSans_400Regular",
};
