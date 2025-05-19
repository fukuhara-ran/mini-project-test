<template>
  <div class="w-full h-24 bg-blue-600 flex items-center px-40 text-white">
    <div class="flex-1">
      <h1 class="text-xl font-bold">MASPOS</h1>
    </div>
    <div class="flex items-center">
      <div class="flex items-center">
        <span class="mr-2">{{ authStore.user?.username || "Taufik00" }}</span>
        <div
          class="bg-white rounded-full h-8 w-8 flex items-center justify-center text-blue-600"
        >
          <i class="ri-user-line"></i>
        </div>
        <div
          class="link ml-4 cursor-pointer hover:text-blue-200"
          @click="authStore.logout()"
        >
          <div class="flex items-center">
            <i class="ri-logout-box-line text-xl mr-1"></i>
          </div>
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
