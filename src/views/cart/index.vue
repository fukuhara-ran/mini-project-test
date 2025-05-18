<template>
  <div>
    <h1 class="font-semibold text-2xl mb-6">Keranjang Belanja</h1>

    <div v-if="cartStore.totalItems === 0" class="text-center py-8">
      <i class="ri-shopping-cart-line text-6xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">Keranjang Anda kosong</p>
      <ButtonPrimary @click="$router.push('/product')" class="mt-4">
        Belanja Sekarang
      </ButtonPrimary>
    </div>

    <div v-else>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg mb-6">
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Produk</th>
              <th scope="col" class="px-6 py-3">Nama</th>
              <th scope="col" class="px-6 py-3">Harga</th>
              <th scope="col" class="px-6 py-3 text-center">Jumlah</th>
              <th scope="col" class="px-6 py-3 text-center">Total</th>
              <th scope="col" class="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in cartStore.itemsWithDetails"
              :key="item.id"
              class="bg-white border-b hover:bg-gray-50"
            >
              <td class="px-6 py-4 border-r-[1px]">
                <img
                  :src="item.picture_url"
                  alt="Gambar Produk"
                  class="w-16 h-16 object-cover"
                />
              </td>
              <td
                class="px-6 py-4 text-gray-900 whitespace-nowrap border-r-[1px]"
              >
                {{ item.name }}
              </td>
              <td class="px-6 py-4 border-r-[1px]">
                {{ formatPrice(item.price) }}
              </td>
              <td class="px-6 py-4 w-8 border-r-[1px]">
                <div class="flex items-center space-x-3">
                  <button
                    @click="decreaseQuantity(item)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-l"
                  >
                    -
                  </button>
                  <span class="px-2">{{ item.quantity }}</span>
                  <button
                    @click="increaseQuantity(item)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded-r"
                  >
                    +
                  </button>
                </div>
              </td>
              <td class="px-7 py-4 font-medium text-center border-r-[1px]">
                {{ formatPrice(item.price * item.quantity) }}
              </td>
              <td class="px-6 py-4 text-center">
                <ButtonDanger @click="removeItem(item.id)" class="py-1 px-2">
                  <i class="ri-delete-bin-line"></i>
                </ButtonDanger>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="font-semibold text-gray-900">
              <td colspan="4" class="px-6 py-3 text-right">Total Belanja:</td>
              <td class="px-6 py-3">
                {{ formatPrice(cartStore.totalPrice) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="flex justify-between mt-6">
        <ButtonPrimary
          @click="$router.push('/product')"
          class="bg-gray-600 hover:bg-gray-700"
        >
          <i class="ri-arrow-left-line mr-2"></i>Lanjutkan Belanja
        </ButtonPrimary>
        <div class="flex space-x-4">
          <ButtonDanger @click="clearCart">
            <i class="ri-delete-bin-line mr-2"></i>Kosongkan Keranjang
          </ButtonDanger>
          <ButtonPrimary
            @click="checkout"
            class="bg-green-600 hover:bg-green-700"
          >
            <i class="ri-shopping-bag-line mr-2"></i>Checkout
          </ButtonPrimary>
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
    checkout() {
      this.$router.push("/checkout");
    },
  },
};
</script>
