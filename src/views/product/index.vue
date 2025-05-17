<template>
  <div class="flex justify-between items-center">
    <h1 class="font-semibold text-lg">Dashboard Produk</h1>
    <div class="flex items-center space-x-3">
      <div class="flex items-center">
        <label for="categoryFilter" class="mr-2 text-sm font-medium"
          >Filter:</label
        >
        <select
          id="categoryFilter"
          v-model="productStore.filterCategoryId"
          @change="filterProducts"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
        >
          <option value="">All Categories</option>
          <option
            v-for="category in categoryStore.categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <ButtonPrimary
        @click="clearFilter"
        v-if="productStore.filterCategoryId"
        class="py-2 px-3 text-xs"
      >
        Clear Filter
      </ButtonPrimary>
    </div>
    <ButtonPrimary @click="$router.push('/product/create')">
      Add Product
    </ButtonPrimary>
  </div>
  <div class="relative overflow-x-auto mt-5">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">Gambar</th>
          <th scope="col" class="px-6 py-3">Nama Produk</th>
          <th scope="col" class="px-6 py-3">Kategori</th>
          <th scope="col" class="px-6 py-3">Harga</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <th
            scope="row"
            class="px-6 py-4 font-medium border border-gray-300 whitespace-nowrap"
          >
            <img
              :src="product.picture_url"
              alt="Gambar Produk"
              class="w-16 h-16 object-cover"
            />
          </th>
          <td class="px-4 py-2 text-left border border-gray-300">
            {{ product.name }}
          </td>
          <td class="px-4 py-2 text-left border border-gray-300">
            {{ getCategoryName(product.category_id) }}
          </td>
          <td class="px-4 py-2 text-left border border-gray-300">
            {{ product.price }}
          </td>
          <td class="px-6 py-4 border border-gray-300 space-x-2">
            <ButtonPrimary @click="updateData(product)">
              <i class="ri-edit-box-line"></i>
            </ButtonPrimary>
            <ButtonDanger class="ml-2" @click="deleteData(product.id)">
              <i class="ri-delete-bin-line"></i>
            </ButtonDanger>
            <ButtonPrimary @click="addToCart(product)" class="bg-green-600 hover:bg-green-700">
              <i class="ri-shopping-cart-add-line"></i>
            </ButtonPrimary>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useProductStore } from "@/stores/product.store.js";
import { useCategoryStore } from "@/stores/category.store.js";
import { useCartStore } from '@/stores/cart.store.js';

export default {
  data() {
    return {
      productStore: useProductStore(),
      categoryStore: useCategoryStore(),
      cartStore: useCartStore(),
    };
  },
  computed: {
    filteredProducts() {
      if (!this.productStore.filterCategoryId) {
        return this.productStore.products;
      }
      return this.productStore.products.filter(
        (product) => product.category_id === this.productStore.filterCategoryId
      );
    },
  },
  mounted() {
    this.productStore.fetch();
    this.categoryStore.fetch();
  },
  methods: {
    filterProducts() {},
    clearFilter() {
      this.productStore.filterCategoryId = "";
    },
    getCategoryName(categoryId) {
      const category = this.categoryStore.categories.find(
        (cat) => cat.id === categoryId
      );
      return category ? category.name : "Unknown Category";
    },
    async deleteData(id) {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.productStore.delete(id);

          this.userStore.fetch();
        }
      });
    },
    updateData(product) {
      this.productStore.products = product;

      // this.$router.push("/user/update");
    },
    addToCart(product) {
      this.cartStore.addToCart(product);
      this.$swal({
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },
  },
};
</script>
