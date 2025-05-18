<template>
  <div class="w-64 bg-gray-800 text-white h-full">
    <div class="p-4">
      <div class="flex items-center justify-center mb-6 pt-2">
        <i class="ri-store-2-line text-2xl mr-2"></i>
        <span class="text-lg font-semibold">Menu Navigasi</span>
      </div>

      <nav class="mt-8">
        <router-link
          to="/"
          class="nav-item"
          :class="{ 'bg-gray-700': $route.path === '/' }"
        >
          <i class="ri-home-line mr-3"></i>
          Home
        </router-link>

        <router-link
          to="/product"
          class="nav-item"
          :class="{ 'bg-gray-700': $route.path.includes('/product') }"
        >
          <i class="ri-shopping-bag-line mr-3"></i>
          Produk
        </router-link>

        <router-link
          to="/transaction/list"
          class="nav-item"
          :class="{ 'bg-gray-700': $route.path.includes('/transaction') }"
        >
          <i class="ri-file-list-line mr-3"></i>
          Pesanan Saya
        </router-link>

        <!-- Shopping Cart moved to sidebar -->
        <router-link
          to="/cart"
          class="nav-item relative"
          :class="{ 'bg-gray-700': $route.path.includes('/cart') }"
        >
          <i class="ri-shopping-cart-2-line mr-3"></i>
          Keranjang
          <span
            v-if="cartStore.totalItems > 0"
            class="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center absolute right-3"
          >
            {{ cartStore.totalItems }}
          </span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store.js";
import { useCartStore } from "@/stores/cart.store.js";

export default {
  name: "Sidebar",
  data() {
    return {
      authStore: useAuthStore(),
      cartStore: useCartStore(),
    };
  },
};
</script>

<style scoped>
.nav-item {
  @apply flex items-center py-3 px-4 rounded-lg mb-2 transition-all duration-200 hover:bg-gray-700;
  display: flex;
}

.router-link-active {
  @apply bg-gray-700;
}
</style>
