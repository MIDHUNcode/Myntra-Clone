import React, { createContext, useState, ReactNode } from "react";

type ThemeMode = "light" | "dark";

export type Theme = {
  mode: ThemeMode;
  background: string;
  text: string;
  card: string;
  borderColor: string;
  tint: string;
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const lightTheme: Theme = {
  mode: "light",
  background: "#FFFFFF",
  text: "#000000",
  card: "#F5F5F5",
  borderColor: "#E0E0E0",
  tint: "#ff3f6c",
};

const darkTheme: Theme = {
  mode: "dark",
  background: "#121212",
  text: "#FFFFFF",
  card: "#1E1E1E",
  borderColor: "#333333",
  tint: "#ff3f6c",
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev.mode === "light" ? darkTheme : lightTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
