import React, { useContext } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ParallaxScrollView from "@/src/myntra/components/ParallaxScrollView";
import { ThemedText } from "@/src/myntra/components/ThemedText";
import { ThemedView } from "@/src/myntra/components/ThemedView";

import { ThemeContext } from "@/src/context/ThemeContext";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme.mode === "dark";

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ParallaxScrollView
        headerBackgroundColor={{
          light: theme.background,
          dark: theme.background,
        }}
        headerImage={
          <Ionicons
            name="settings"
            size={140}
            color={theme.tint}
            style={styles.headerIcon}
          />
        }
      >
        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <ThemedText type="title" style={{ color: theme.text }}>
            Appearance
          </ThemedText>

          <ThemedText style={{ color: theme.text, opacity: 0.7, marginTop: 6 }}>
            Customize how the app looks
          </ThemedText>

          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.button,
              {
                backgroundColor: theme.background,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={20}
              color={theme.text}
              style={{ marginRight: 8 }}
            />
            <ThemedText style={{ color: theme.text, fontWeight: "600" }}>
              {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    alignSelf: "center",
    marginTop: 40,
  },
  card: {
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
