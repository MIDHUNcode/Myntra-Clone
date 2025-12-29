import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Transaction } from "@/types/transaction.types";

type Props = {
  item?: Transaction;
};

export default function TransactionCard({ item }: Props) {
  if (!item) return null;

  return (
    <View style={styles.card}>

      <View style={styles.header}>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={[styles.status, item.status === "SUCCESS" ? styles.success : styles.pending]}>
          {item.status}
        </Text>
      </View>

      <Text style={styles.amount}>₹{item.amount}</Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Mode: {item.paymentMode}</Text>
        <Text style={styles.footerText}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
  success: { color: "#28A745" },
  pending: { color: "#FFC107" },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
