import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/myntra/context/AuthContext";
import { ThemeContext } from "@/src/context/ThemeContext";

const menuItems = [
  { icon: "cube-outline", label: "Orders", route: "/orders" },
  { icon: "heart-outline", label: "Wishlist", route: "/wishlist" },
  { icon: "bookmark-outline", label: "Saved Items", route: "/SavedScreen" },
  { icon: "settings-outline", label: "Settings", route: "/settings" },
] as const;

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme } = useContext(ThemeContext as React.Context<any>);

  const handleLogout = () => {
    logout();
    router.replace({ pathname: "/" } as any);
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Profile
          </Text>
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="person-circle-outline" size={80} color="#ff3f6c" />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Please login to view your profile
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/(auth)/login" as any)}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Profile
        </Text>
      </View>

      <ScrollView>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>

          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user.fullName}
            </Text>
            <Text style={[styles.userEmail, { color: theme.text }]}>
              {user.email}
            </Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color={theme.text} />
                <Text style={[styles.menuItemLabel, { color: theme.text }]}>
                  {item.label}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={22} color={theme.text} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ff3f6c" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    marginVertical: 20,
  },
  loginButton: {
    backgroundColor: "#ff3f6c",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ff3f6c",
    justifyContent: "center",
    alignItems: "center",
  },
  userDetails: { marginLeft: 15 },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userEmail: { marginTop: 4 },
  menuSection: { marginTop: 10 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemLabel: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff3f6c",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#ff3f6c",
    fontWeight: "bold",
  },
});
