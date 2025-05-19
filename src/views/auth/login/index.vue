<template>
  <div class="flex flex-col min-h-screen">
    <!-- Top half blue, bottom half white background -->
    <div class="absolute inset-0 bg-blue-600 h-1/2"></div>
    <div class="absolute inset-0 top-1/2 bg-white h-1/2"></div>

    <!-- Content with relative position -->
    <div class="relative flex flex-col min-h-screen">
      <!-- Header -->
      <header class="p-4 flex justify-between items-center">
        <div class="text-white text-xl font-bold">MAS POS</div>
        <div class="text-white text-sm">Call Us +62 817-1902-092</div>
      </header>

      <!-- Main Content with Centered Login Form -->
      <main class="flex-grow flex justify-center items-center">
        <div class="bg-white rounded-lg shadow-lg py-8 px-12 w-full max-w-lg h-[25rem]">
          <h1 class="text-center text-xl font-medium mb-6">Login</h1>

          <form action="" @submit.prevent="login" class="h-5/6 flex flex-col justify-center gap-4">
            <div class="mb-4">
              <label for="email" class="block text-sm mb-2">Email</label>
              <input
                v-model="formData.email"
                type="text"
                id="email"
                class="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                required
              />
            </div>

            <div class="mb-6">
              <label for="password" class="block text-sm mb-2">Password</label>
              <div class="relative">
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  class="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      v-if="showPassword"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="w-full flex justify-center">
              <button
                type="submit"
                class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors w-2/6"
              >
                Login
              </button>  
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth.store.js";

export default {
  data() {
    return {
      authStore: useAuthStore(),
      formData: {
        email: "",
        password: "",
      },
      showPassword: false,
    };
  },
  methods: {
    login() {
      this.authStore.login(this.formData);
    },
  },
};
</script>
