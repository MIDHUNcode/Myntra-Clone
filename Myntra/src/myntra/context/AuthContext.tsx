import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ================= TYPES ================= */

type User = {
  _id: string;
  fullName: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};


const AuthContext = createContext<AuthContextType | null>(null);


const API_URL = "http://Ipconfig:5000/auth";



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken);
      } catch (err) {
        console.log("Auth load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  const saveAuthData = async (token: string | null, user: User) => {
    if (!user) throw new Error("Invalid server response: missing user");

    if (token) {
      await AsyncStorage.setItem("token", token);
      setToken(token);
    } else {
      setToken(null);
    }

    await AsyncStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON from server:", text);
        throw new Error("Server returned invalid response");
      }

      if (!res.ok) throw new Error(data.message || "Signup failed");

      await saveAuthData(data.token ?? null, data.user);
    } catch (err: any) {
      console.error("Signup error:", err);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON from server:", text);
        throw new Error("Server returned invalid response");
      }

      if (!res.ok) throw new Error(data.message || "Login failed");

      await saveAuthData(data.token ?? null, data.user);
    } catch (err: any) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
