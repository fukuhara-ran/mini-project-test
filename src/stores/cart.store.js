import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
  }),
  getters: {
    totalItems: (state) => state.items.length,
    totalPrice: (state) => {
      return state.items.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
      );
    },
    itemsWithDetails: (state) => state.items,
  },
  actions: {
    addToCart(product) {
      const existingItem = this.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Jika produk sudah ada di keranjang, tambahkan quantity
        existingItem.quantity += 1;
      } else {
        // Jika produk belum ada di keranjang, tambahkan sebagai item baru
        this.items.push({
          ...product,
          quantity: 1,
        });
      }
    },
    removeFromCart(productId) {
      const index = this.items.findIndex((item) => item.id === productId);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find((item) => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart() {
      this.items = [];
    },
  },
  persist: true,
});
