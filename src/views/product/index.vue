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
      <ButtonDanger
        @click="clearFilter"
        v-if="productStore.filterCategoryId"
        class="py-2 px-3 text-xs"
      >
        Clear Filter
      </ButtonDanger>
      <ButtonPrimary
        @click="openCategoryModal"
        class="bg-yellow-500 hover:bg-yellow-600 py-2 px-3 text-xs"
      >
        Add Category
      </ButtonPrimary>
    </div>
    <ButtonPrimary @click="$router.push('/product/create')">
      Add Product
    </ButtonPrimary>
  </div>

  <!-- Modal untuk menambah kategori baru -->
  <div
    v-if="showCategoryModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">Add New Category</h2>
        <button
          @click="closeCategoryModal"
          class="text-gray-400 hover:text-gray-600"
        >
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>

      <form @submit.prevent="createCategory">
        <div class="mb-4">
          <label
            for="categoryName"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Category Name <span class="text-red-600">*</span>
          </label>
          <input
            v-model="newCategory.name"
            type="text"
            id="categoryName"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter category name"
            required
          />
        </div>

        <div class="flex justify-end space-x-2">
          <ButtonDanger @click="closeCategoryModal" type="button">
            Cancel
          </ButtonDanger>
          <ButtonPrimary type="submit" :disabled="isLoading">
            {{ isLoading ? "Saving..." : "Save Category" }}
          </ButtonPrimary>
        </div>
      </form>
    </div>
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
          <td class="px-6 py-4 border border-gray-300 space-x-2 w-96">
            <ButtonPrimary @click="updateData(product)">
              <i class="ri-edit-box-line"></i>
            </ButtonPrimary>
            <ButtonDanger class="ml-2" @click="deleteData(product.id)">
              <i class="ri-delete-bin-line"></i>
            </ButtonDanger>
            <ButtonPrimary
              @click="addToCart(product)"
              class="bg-green-400 hover:bg-green-600"
            >
              <i class="ri-shopping-cart-line"></i>
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
import { useCartStore } from "@/stores/cart.store.js";

export default {
  data() {
    return {
      productStore: useProductStore(),
      categoryStore: useCategoryStore(),
      cartStore: useCartStore(),
      showCategoryModal: false,
      isLoading: false,
      newCategory: {
        name: "",
      },
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
    openCategoryModal() {
      this.showCategoryModal = true;
      this.newCategory.name = "";
    },
    closeCategoryModal() {
      this.showCategoryModal = false;
    },
    async createCategory() {
      if (!this.newCategory.name.trim()) {
        this.$swal({
          title: "Error!",
          text: "Category name is required",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      try {
        this.isLoading = true;

        const result = await this.categoryStore.add({
          name: this.newCategory.name.trim(),
        });

        if (result) {
          // Refresh daftar kategori
          await this.categoryStore.fetch();

          this.$swal({
            title: "Success!",
            text: "Category has been added successfully",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          this.closeCategoryModal();
        }
      } catch (error) {
        console.error("Error adding category:", error);
        this.$swal({
          title: "Error!",
          text: "Failed to add category",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
