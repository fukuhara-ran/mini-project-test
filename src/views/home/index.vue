<template>
  <div class="flex">
    <h1 class="font-semibold text-lg mb-5">Dashboard</h1>
  </div>
  <div>
    <table>
      <thead>
        <tr>
          <th class="px-4 py-2 text-left border border-gray-300">
            Nama Produk
          </th>
          <th class="px-4 py-2 text-left border border-gray-300">Harga</th>
          <th class="px-4 py-2 text-left border border-gray-300">Gambar</th>
          <th scope="col" class="px-6 py-3 border border-gray-300">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in productStore.products" :key="product.id">
          <td class="px-4 py-2 text-left border border-gray-300">
            {{ product.name }}
          </td>
          <td class="px-4 py-2 text-left border border-gray-300">
            {{ product.price }}
          </td>
          <td class="px-4 py-2 text-left border border-gray-300">
            {{ product.picture_url }}
          </td>
          <td class="px-6 py-4 border border-gray-300">
            <ButtonPrimary @click="updateData(product)">
              <i class="ri-edit-box-line"></i>
            </ButtonPrimary>
            <ButtonDanger class="ml-2" @click="deleteData(product.id)">
              <i class="ri-delete-bin-line"></i>
            </ButtonDanger>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useProductStore } from "@/stores/product.store.js";

export default {
  data() {
    return {
      productStore: useProductStore(),
    };
  },
  mounted() {
    this.productStore.fetch();
  },
  methods: {
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
  },
};
</script>
