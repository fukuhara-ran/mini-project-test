<template>
  <div>
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow-sm">
        <div class="grid grid-cols-12 p-4 border-b text-gray-700">
          <div class="col-span-6">Product</div>
          <div class="col-span-3 text-center">Qty</div>
          <div class="col-span-3 text-right">Sub Total</div>
        </div>

        <div v-if="cartStore.totalItems === 0" class="text-center py-8">
          <i class="ri-shopping-cart-line text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Keranjang Anda kosong</p>
          <ButtonPrimary @click="$router.push('/')" class="mt-4">
            Belanja Sekarang
          </ButtonPrimary>
        </div>

        <div v-else>
          <div
            v-for="(item, index) in cartStore.itemsWithDetails"
            :key="item.id"
            class="border-b"
          >
            <div class="grid grid-cols-12 items-center p-4">
              <div class="col-span-6 flex items-center">
                <div class="text-gray-500 mr-4">{{ index + 1 }}.</div>
                <div class="w-24 h-24 mr-4">
                  <img
                    :src="item.picture_url"
                    :alt="item.name"
                    class="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div>
                  <div class="font-medium">{{ item.name }}</div>
                  <div class="text-gray-600">
                    Rp. {{ formatPrice(item.price) }}
                  </div>
                </div>
              </div>

              <div class="col-span-3">
                <div class="flex items-center justify-center">
                  <button
                    @click="decreaseQuantity(item)"
                    class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <i class="ri-subtract-line"></i>
                  </button>
                  <span class="mx-4 text-center w-6">{{ item.quantity }}</span>
                  <button
                    @click="increaseQuantity(item)"
                    class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <i class="ri-add-line"></i>
                  </button>
                </div>
              </div>

              <div class="col-span-3 flex justify-between items-center">
                <div class="font-medium text-right flex-grow">
                  Rp. {{ formatPrice(item.price * item.quantity) }}
                </div>
                <button
                  @click="removeItem(item.id)"
                  class="bg-red-600 text-white text-sm py-1 px-2 ml-4 rounded hover:bg-red-700 transition-colors"
                >
                  Remove Item
                </button>
              </div>
            </div>
          </div>

          <div class="p-4 flex justify-end gap-40 items-center font-medium">
            <div class="text-lg">Total</div>
            <div class="text-lg">
              Rp. {{ formatPrice(cartStore.totalPrice) }}
            </div>
          </div>

          <div class="p-4 flex justify-end space-x-4">
            <button
              @click="$router.push('/')"
              class="border border-blue-600 text-blue-600 py-2 px-6 rounded hover:bg-blue-50 transition-colors"
            >
              Back to Home
            </button>
            <button
              @click="payBill"
              class="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors"
            >
              Pay Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "@/stores/cart.store.js";

export default {
  name: "CartView",
  data() {
    return {
      cartStore: useCartStore(),
      totalPaid: 0,
    };
  },
  methods: {
    formatPrice(price) {
      return Number(price).toLocaleString("id-ID");
    },
    increaseQuantity(item) {
      this.cartStore.updateQuantity(item.id, item.quantity + 1);
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        this.cartStore.updateQuantity(item.id, item.quantity - 1);
      } else {
        this.removeItem(item.id);
      }
    },
    removeItem(productId) {
      this.$swal({
        title: "Hapus produk?",
        text: "Produk ini akan dihapus dari keranjang Anda",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          this.cartStore.removeFromCart(productId);
        }
      });
    },
    clearCart() {
      this.$swal({
        title: "Kosongkan keranjang?",
        text: "Semua produk akan dihapus dari keranjang Anda",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, kosongkan!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          this.cartStore.clearCart();
        }
      });
    },
    payBill() {
      // Simpan total pembayaran sebelum keranjang dikosongkan
      this.totalPaid = this.cartStore.totalPrice;

      // Gunakan SweetAlert untuk menampilkan pembayaran berhasil
      this.$swal({
        title: "Payment Successful",
        text: `Rp. ${this.formatPrice(this.totalPaid)}`,
        icon: "success",
        confirmButtonText: "Back to Home",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push("/");
        }
      });

      // Reset keranjang
      this.cartStore.clearCart();
    },
    backToHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>
