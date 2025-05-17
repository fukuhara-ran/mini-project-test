<template>
  <div class="flex justify-between items-center">
    <h1 class="font-semibold text-lg">Add Product Page</h1>
  </div>

  <form action="" @submit.prevent="create">
    <div class="mb-6">
      <label for="name" class="block mb-2 text-sm font-medium text-gray-900"
        >Name <span class="text-red-600">*</span></label
      >
      <input
        v-model="formData.name"
        type="text"
        id="name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="Product Name"
        required
      />
    </div>
    <div class="mb-6">
      <label for="category" class="block mb-2 text-sm font-medium text-gray-900"
        >Category <span class="text-red-600">*</span></label
      >
      <select
        v-model="formData.category_id"
        id="category"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
      >
        <option value="" disabled selected>Select a category</option>
        <option
          v-for="category in categoryStore.categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>
    <div class="mb-6">
      <label for="price" class="block mb-2 text-sm font-medium text-gray-900"
        >Price <span class="text-red-600">*</span></label
      >
      <input
        v-model.number="formData.price"
        type="number"
        id="price"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="$0.00"
        required
      />
    </div>
    <div class="mb-6">
      <label for="picture" class="block mb-2 text-sm font-medium text-gray-900"
        >Picture</label
      >
      <input
        @change="handleFileUpload"
        type="file"
        id="picture"
        accept="image/*"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
      <div v-if="previewImage" class="mt-2">
        <img
          :src="previewImage"
          class="h-32 w-auto object-cover rounded-md"
          alt="Preview"
        />
      </div>
      <div v-if="imageUrl" class="mt-2">
        <p class="text-sm text-gray-600">Server Image URL:</p>
        <p class="text-xs text-gray-500 break-all">{{ imageUrl }}</p>
      </div>
    </div>
    <div v-if="isLoading" class="mb-6 flex items-center">
      <div
        class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"
      ></div>
      <span class="text-sm text-gray-600">Uploading image...</span>
    </div>
    <ButtonPrimary :type="'submit'" :disabled="isLoading">
      {{ isLoading ? "Processing..." : "Submit" }}
    </ButtonPrimary>
    <ButtonDanger
      @click="$router.push('/product')"
      class="ml-3"
      :disabled="isLoading"
    >
      Cancel
    </ButtonDanger>
  </form>
</template>

<script>
import { useProductStore } from "@/stores/product.store.js";
import { useCategoryStore } from "@/stores/category.store.js";

export default {
  data() {
    return {
      productStore: useProductStore(),
      categoryStore: useCategoryStore(),
      previewImage: null,
      imageUrl: null,
      isLoading: false,
      formData: {
        name: "",
        category_id: "",
        price: "",
        picture: null,
      },
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      await this.categoryStore.fetch();
    },
    async create() {
      try {
        // Validasi form terlebih dahulu
        if (
          !this.formData.name ||
          !this.formData.category_id ||
          !this.formData.price
        ) {
          console.error("Form validation failed");
          return;
        }

        this.isLoading = true;

        // Log data sebelum mengirim untuk debugging
        console.log("Sending form data:", {
          name: this.formData.name,
          category_id: this.formData.category_id,
          price: this.formData.price,
          picture: this.formData.picture
            ? this.formData.picture.name
            : "No file",
        });

        // Pastikan data yang dikirim ke server sudah sesuai
        let product = await this.productStore.add({
          name: this.formData.name,
          category_id: this.formData.category_id,
          price: Number(this.formData.price), // Pastikan price dikonversi ke number
          picture: this.formData.picture,
        });

        if (product) {
          // Jika server mengembalikan URL gambar, kita simpan di state
          if (product.data && product.data.picture_url) {
            this.imageUrl = product.data.picture_url;
          }
          setTimeout(() => {
            this.$router.push("/product");
          }, 1500);
        }
      } catch (error) {
        console.error("Error creating product:", error);
      } finally {
        this.isLoading = false;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Reset URL gambar sebelumnya jika ada
        this.imageUrl = null;

        this.formData.picture = file;
        // Buat URL preview
        this.previewImage = URL.createObjectURL(file);
      }
    },
  },
};
</script>
