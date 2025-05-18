<template>
  <div
    class="w-full h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm"
  >
    <div class="flex-1">
      <h1 class="text-xl font-bold text-gray-800">Toko Online</h1>
    </div>
    <div class="flex items-center">
      <!-- Logout button added to navbar -->
      <div class="link cursor-pointer" @click="authStore.logout()">
        <div class="flex items-center">
          <i class="ri-logout-box-line text-xl mr-1"></i>
          <span>Logout</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store.js";

export default {
  name: "Navbar",
  data() {
    return {
      authStore: useAuthStore(),
    };
  },
};
</script>

<style scoped>
.link {
  @apply px-2 cursor-pointer hover:text-red-400;
}
</style>
