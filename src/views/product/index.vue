<template>
  <div>
    <!-- Action buttons -->
    <div class="flex justify-end items-center mb-6 gap-4">
      <button
        @click="openCategoryModal"
        class="bg-sky-200 hover:bg-sky-300 text-[#185cb8] font-bold py-2 px-4 rounded"
      >
        + Add Category
      </button>
      <button
        @click="openProductModal"
        class="bg-sky-200 hover:bg-sky-300 text-[#185cb8] font-bold py-2 px-4 rounded"
      >
        + Add Products
      </button>
      <router-link
        to="/cart"
        class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        Cart
        <span
          v-if="cartStore.totalItems > 0"
          class="ml-2 bg-yellow-500 text-blue-900 rounded-full h-5 w-5 flex items-center justify-center text-xs"
        >
          {{ cartStore.totalItems }}
        </span>
      </router-link>
    </div>

    <!-- Cart Total Popup -->
    <transition name="fade">
      <div
        v-if="cartStore.totalItems > 0 && showCartPopup"
        class="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg p-4 z-50 border-l-4 border-blue-600"
      >
        <div class="flex items-center justify-between">
          <div class="mr-6">
            <h3 class="text-sm font-medium text-gray-700">Cart Total:</h3>
            <p class="text-lg font-bold text-blue-800">
              Rp. {{ formatPrice(cartStore.totalPrice) }}
            </p>
            <p class="text-xs text-gray-500">
              {{ cartStore.totalItems }} item(s)
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <router-link
              to="/cart"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
            >
              View Cart
            </router-link>
            <button
              @click="showCartPopup = false"
              class="text-gray-500 hover:text-gray-700 text-xs"
            >
              Hide
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Category Tabs with Arrow Navigation -->
    <div class="relative border-b border-gray-300 mb-4">
      <div class="flex items-center">
        <!-- Left Arrow -->
        <button
          @click="scrollCategories('left')"
          class="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-l text-gray-700 z-10"
          :disabled="scrollPosition <= 0"
          :class="{ 'opacity-50 cursor-not-allowed': scrollPosition <= 0 }"
        >
          <i class="ri-arrow-left-s-line"></i>
        </button>

        <!-- Categories Container -->
        <div
          class="overflow-x-hidden flex-1 relative"
          ref="categoriesContainer"
        >
          <div
            class="flex space-x-2 transition-transform duration-300 ease-in-out px-1"
            :style="{ transform: `translateX(-${scrollPosition}px)` }"
            ref="categoriesWrapper"
          >
            <div
              v-for="category in categoryStore.categories"
              :key="category.id"
              class="py-2 px-4 cursor-pointer rounded-t-lg transition-colors duration-200 whitespace-nowrap"
              :class="{
                'bg-blue-100 text-blue-800 font-medium border-b-2 border-blue-600':
                  selectedCategoryId === category.id,
                'hover:bg-gray-100': selectedCategoryId !== category.id,
              }"
              @click="filterByCategory(category.id)"
            >
              {{ category.name }}
            </div>
          </div>
        </div>

        <!-- Right Arrow -->
        <button
          @click="scrollCategories('right')"
          class="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-r text-gray-700 z-10"
          :disabled="scrollPosition >= maxScroll"
          :class="{
            'opacity-50 cursor-not-allowed': scrollPosition >= maxScroll,
          }"
        >
          <i class="ri-arrow-right-s-line"></i>
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-5 gap-x-12 gap-y-10 mt-8">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded shadow-xl overflow-hidden"
      >
        <div class="relative">
          <img
            :src="product.picture_url"
            :alt="product.name"
            class="w-full h-48 object-cover"
          />
        </div>
        <div class="p-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg">{{ product.name }}</h3>
            <button
              @click="deleteProduct(product.id)"
              class="bg-red-500 hover:bg-red-700 text-white p-2 rounded-md text-xs"
              title="Delete product"
            >
              Delete
            </button>
          </div>
          <p class="font-bold text-lg mt-1">
            Rp. {{ formatPrice(product.price) }}
          </p>
          <div class="w-full flex items-center justify-center mt-8">
            <button
              @click="addToCart(product)"
              class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-[60%]"
            >
              <span>+ Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="text-center mb-6">
          <h2 class="text-xl font-medium text-gray-900">Add Category</h2>
        </div>

        <form @submit.prevent="createCategory">
          <div class="mb-6">
            <label
              for="categoryName"
              class="block mb-2 text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              v-model="newCategory.name"
              type="text"
              id="categoryName"
              class="bg-white border border-gray-300 text-gray-900 text-sm rounded w-full p-2.5 focus:outline-none focus:border-blue-500"
              placeholder="Category name"
              required
            />
          </div>

          <div class="flex justify-center space-x-3">
            <button
              @click="closeCategoryModal"
              type="button"
              class="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-6 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
            >
              {{ isLoading ? "Saving..." : "Confirm" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Product Modal -->
    <div
      v-if="showProductModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg py-8 px-20 w-full max-w-3xl h-[60vh] overflow-y-auto flex flex-col"
      >
        <div class="mb-6">
          <h2 class="text-xl font-medium text-gray-900">Add Product</h2>
        </div>

        <form @submit.prevent="createProduct" class="flex-1 flex flex-col">
          <div class="flex-1">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Left Column - Image Upload -->
              <div class="w-full md:w-1/3">
                <div
                  class="bg-blue-100 rounded-lg p-6 h-40 flex flex-col items-center justify-center cursor-pointer"
                  @click="$refs.fileInput.click()"
                >
                  <div v-if="!previewImage" class="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-10 w-10 mx-auto text-blue-500 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p class="text-xs text-blue-500">Upload Image</p>
                  </div>
                  <img
                    v-else
                    :src="previewImage"
                    class="h-full w-full object-contain"
                    alt="Product preview"
                  />
                </div>
                <input
                  ref="fileInput"
                  @change="handleFileUpload"
                  type="file"
                  id="picture"
                  accept="image/*"
                  class="hidden"
                />
              </div>

              <!-- Right Column - Form Fields -->
              <div class="w-full md:w-2/3 space-y-4 pl-10">
                <!-- Product Name -->
                <div>
                  <label
                    for="name"
                    class="block mb-2 text-sm font-medium text-gray-700"
                    >Product Name</label
                  >
                  <input
                    v-model="productForm.name"
                    type="text"
                    id="name"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Product Name"
                    required
                  />
                </div>

                <!-- Price -->
                <div>
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-700"
                    >Price</label
                  >
                  <input
                    v-model.number="productForm.price"
                    type="number"
                    id="price"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Input price"
                    required
                  />
                </div>

                <!-- Category -->
                <div>
                  <label
                    for="category"
                    class="block mb-2 text-sm font-medium text-gray-700"
                    >Select Category</label
                  >
                  <div class="relative">
                    <select
                      v-model="productForm.category_id"
                      id="category"
                      class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white pr-8"
                      required
                    >
                      <option value="" disabled selected>
                        Select category
                      </option>
                      <option
                        v-for="category in categoryStore.categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                    <div
                      class="absolute top-0 right-0 h-full flex items-center pr-2 pointer-events-none"
                    >
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading indicator -->
          <div
            v-if="isProductLoading"
            class="flex items-center justify-center mt-6"
          >
            <div
              class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"
            ></div>
            <span class="text-sm text-gray-600">Processing...</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-8">
            <button
              type="button"
              @click="closeProductModal"
              class="px-4 py-2 w-[8rem] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none"
              :disabled="isProductLoading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 w-[8rem] text-sm font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none"
              :disabled="isProductLoading"
            >
              {{ isProductLoading ? "Processing..." : "Confirm" }}
            </button>
          </div>
        </form>
      </div>
    </div>
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
      selectedCategoryId: null,
      showCategoryModal: false,
      showProductModal: false,
      isLoading: false,
      isProductLoading: false,
      newCategory: { name: "" },
      productForm: {
        name: "",
        category_id: "",
        price: "",
        picture: null,
      },
      previewImage: null,
      scrollPosition: 0,
      maxScroll: 0,
      showCartPopup: false,
      popupTimeout: null,
    };
  },

  computed: {
    filteredProducts() {
      if (!this.selectedCategoryId) {
        return this.productStore.products;
      }
      return this.productStore.products.filter(
        (product) => product.category_id === this.selectedCategoryId
      );
    },
  },

  mounted() {
    this.productStore.fetch();
    this.categoryStore.fetch();
    this.updateMaxScroll();
    window.addEventListener("resize", this.updateMaxScroll);

    // Watch for cart changes to show popup
    this.$watch(
      () => this.cartStore.totalItems,
      (newVal, oldVal) => {
        if (newVal > oldVal) {
          this.showCartPopup = true;

          // Clear existing timeout to prevent multiple timeouts
          if (this.popupTimeout) {
            clearTimeout(this.popupTimeout);
          }

          // Auto-hide popup after 5 seconds
          this.popupTimeout = setTimeout(() => {
            this.showCartPopup = false;
          }, 5000);
        }
      }
    );
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateMaxScroll);
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
    }
  },

  watch: {
    "categoryStore.categories": {
      handler() {
        this.$nextTick(() => {
          this.updateMaxScroll();
        });
      },
      deep: true,
    },
  },

  methods: {
    filterByCategory(categoryId) {
      this.selectedCategoryId =
        this.selectedCategoryId === categoryId ? null : categoryId;
    },

    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    addToCart(product) {
      this.cartStore.addToCart(product);
      this.showCartPopup = true;

      // Clear existing timeout
      if (this.popupTimeout) {
        clearTimeout(this.popupTimeout);
      }

      // Auto-hide popup after 5 seconds
      this.popupTimeout = setTimeout(() => {
        this.showCartPopup = false;
      }, 5000);

      this.$swal({
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    },

    deleteProduct(id) {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.productStore.delete(id);
          this.productStore.fetch();
        }
      });
    },

    // Category modal methods
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

    // Product modal methods
    openProductModal() {
      this.showProductModal = true;
      this.resetProductForm();
    },

    closeProductModal() {
      this.showProductModal = false;
      this.resetProductForm();
    },

    resetProductForm() {
      this.productForm = {
        name: "",
        category_id: "",
        price: "",
        picture: null,
      };
      this.previewImage = null;
    },

    async createProduct() {
      if (
        !this.productForm.name ||
        !this.productForm.category_id ||
        !this.productForm.price
      ) {
        this.$swal({
          title: "Error!",
          text: "Please fill all required fields",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      try {
        this.isProductLoading = true;

        const product = await this.productStore.add({
          name: this.productForm.name,
          category_id: this.productForm.category_id,
          price: Number(this.productForm.price),
          picture: this.productForm.picture,
        });

        if (product) {
          await this.productStore.fetch();
          this.$swal({
            title: "Success!",
            text: "Product has been added successfully",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          this.closeProductModal();
        }
      } catch (error) {
        this.$swal({
          title: "Error!",
          text: "Failed to add product",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        this.isProductLoading = false;
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.productForm.picture = file;
        this.previewImage = URL.createObjectURL(file);
      }
    },

    // Category scrolling methods
    scrollCategories(direction) {
      const scrollAmount = 200;

      if (direction === "left") {
        this.scrollPosition = Math.max(0, this.scrollPosition - scrollAmount);
      } else {
        this.scrollPosition = Math.min(
          this.maxScroll,
          this.scrollPosition + scrollAmount
        );
      }
    },

    updateMaxScroll() {
      this.$nextTick(() => {
        if (this.$refs.categoriesWrapper && this.$refs.categoriesContainer) {
          const containerWidth = this.$refs.categoriesContainer.clientWidth;
          const wrapperWidth = this.$refs.categoriesWrapper.scrollWidth;
          this.maxScroll = Math.max(0, wrapperWidth - containerWidth);
        }
      });
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
