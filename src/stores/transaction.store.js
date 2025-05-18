import { defineStore } from "pinia";
import { useCartStore } from "./cart.store.js";

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    transactions: [],
    currentTransaction: null,
    transactionStatuses: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ],
  }),
  getters: {
    getTransactionById: (state) => (id) => {
      return state.transactions.find((transaction) => transaction.id === id);
    },
    totalTransactions: (state) => state.transactions.length,
    pendingTransactions: (state) => {
      return state.transactions.filter(
        (transaction) => transaction.status === "pending"
      );
    },
    completedTransactions: (state) => {
      return state.transactions.filter(
        (transaction) => transaction.status === "delivered"
      );
    },
  },
  actions: {
    createTransaction(shippingDetails) {
      const cartStore = useCartStore();

      // Generate unique transaction ID (in real app, this would come from backend)
      const transactionId = "TRX-" + Date.now();

      const newTransaction = {
        id: transactionId,
        date: new Date().toISOString(),
        items: JSON.parse(JSON.stringify(cartStore.itemsWithDetails)), // Deep copy to prevent reference issues
        totalAmount: cartStore.totalPrice,
        status: "pending",
        shippingDetails: shippingDetails,
        paymentStatus: "unpaid",
      };

      this.transactions.push(newTransaction);
      this.currentTransaction = newTransaction;

      // Clear cart after successful transaction creation
      cartStore.clearCart();

      return transactionId;
    },

    updateTransactionStatus(transactionId, newStatus) {
      const transaction = this.getTransactionById(transactionId);
      if (transaction && this.transactionStatuses.includes(newStatus)) {
        transaction.status = newStatus;
        return true;
      }
      return false;
    },

    updatePaymentStatus(transactionId, status) {
      const transaction = this.getTransactionById(transactionId);
      if (transaction) {
        transaction.paymentStatus = status;
        return true;
      }
      return false;
    },

    cancelTransaction(transactionId) {
      const transaction = this.getTransactionById(transactionId);
      if (transaction && transaction.status !== "delivered") {
        transaction.status = "cancelled";
        return true;
      }
      return false;
    },
  },
  persist: true,
});
