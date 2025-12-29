export type Transaction = {
  _id: string;
  amount: number;
  paymentMode: "ONLINE" | "COD";
  type: "PAYMENT" | "REFUND";
  status: "SUCCESS" | "FAILED" | "PENDING";
  createdAt: string;
};
