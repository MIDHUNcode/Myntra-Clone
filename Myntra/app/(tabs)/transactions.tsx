import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import TransactionCard from "@/src/components/transactions/TransactionCard";
import { Transaction } from "@/types/transaction.types";
import { ThemeContext } from "@/src/context/ThemeContext";

const BASE_TRANSACTIONS: Omit<Transaction, "_id" | "paymentMode">[] = [
  { amount: 499, type: "PAYMENT", status: "SUCCESS", createdAt: "2024-12-01T10:30:00Z" },
  { amount: 299, type: "PAYMENT", status: "PENDING", createdAt: "2024-12-03T14:15:00Z" },
  { amount: 199, type: "REFUND", status: "SUCCESS", createdAt: "2024-12-05T09:00:00Z" },
  { amount: 750, type: "PAYMENT", status: "SUCCESS", createdAt: "2024-12-06T16:45:00Z" },
  { amount: 120, type: "REFUND", status: "PENDING", createdAt: "2024-12-07T11:20:00Z" },
];

const getRandomPaymentMode = () => (Math.random() > 0.5 ? "ONLINE" : "COD");

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const dummyTransactions: Transaction[] = BASE_TRANSACTIONS.map((t, index) => ({
      _id: (index + 1).toString(),
      paymentMode: getRandomPaymentMode(),
      ...t,
    }));
    setTransactions(dummyTransactions);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TransactionCard item={item} />}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No transactions found
          </Text>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  emptyText: { textAlign: "center", marginTop: 50 },
});
