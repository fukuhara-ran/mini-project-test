<template>
  <div class="w-full h-[75px] bg-blue-200 flex justify-center items-center px-10">
    <div class="flex items-center flex-1 justify-end w-6/12">
      <router-link to="/" class="link">Home</router-link>
      <router-link to="/product" class="link">Product</router-link>
      <!-- <router-link to="/user" class="link">User</router-link> -->
    </div>
    <div class="flex items-center justify-start gap-4 w-6/12">
      <router-link to="/cart" class="link relative ml-4">
        <div class="flex items-center">
          <i class="ri-shopping-cart-2-line text-xl"></i>
          <span
            v-if="cartStore.totalItems > 0"
            class="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center absolute -top-2 -right-2"
          >
            {{ cartStore.totalItems }}
          </span>
        </div>
      </router-link>
      <div class="link" @click="authStore.logout()">Logout</div>
    </div>
  </div>
  <div class="p-5">
    <slot />
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store.js";
import { useCartStore } from "../stores/cart.store";

export default {
  name: "ExampleLayout",
  data() {
    return {
      authStore: useAuthStore(),
      cartStore: useCartStore(),
    };
  },
};
</script>

<style>
.link {
  @apply px-2 cursor-pointer hover:text-red-400;
}
</style>
