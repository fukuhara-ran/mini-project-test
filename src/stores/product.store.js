import { defineStore } from "pinia";
import { axiosWrapper } from "@/helper/axios-wrapper.js";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const useProductStore = defineStore({
  id: "product",
  state: () => ({
    products: [],
    product: null,
    filterCategoryId: "",
  }),
  actions: {
    async fetch() {
      let url = `${baseUrl}/product`;

      const products = await axiosWrapper.get(url);
      if (products) {
        this.products = products.data;
      }
    },
    async add(data) {
      const formData = new FormData();

      // Menambahkan setiap field ke FormData
      if (data.name) formData.append("name", data.name);
      if (data.category_id) formData.append("category_id", data.category_id);
      if (data.price) formData.append("price", data.price.toString());

      // Jika ada file gambar, tambahkan ke FormData
      if (data.picture && data.picture instanceof File) {
        formData.append("picture", data.picture);
      }

      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // Mengirim dengan header multipart/form-data (diatur oleh axiosWrapper)
      const product = await axiosWrapper.post(
        `${baseUrl}/product`,
        formData,
        true,
        "multipart/form-data"
      );

      this.product = product.data;

      return product;
    },
    async update(id, data) {
      if (data instanceof FormData) {
        return await axiosWrapper.put(`${baseUrl}/product/${id}`, data, true);
      } else {
        // Jika ada file yang diupdate
        const formData = new FormData();

        // Menambahkan data ke FormData
        Object.keys(data).forEach((key) => {
          if (data[key] !== null) {
            if (key === "picture" && data[key] instanceof File) {
              formData.append(key, data[key]);
            } else if (key === "price") {
              formData.append(key, data[key].toString());
            } else {
              formData.append(key, data[key]);
            }
          }
        });

        return await axiosWrapper.put(
          `${baseUrl}/product/${id}`,
          formData,
          true
        );
      }
    },
    async delete(id) {
      return await axiosWrapper.delete(`${baseUrl}/product/${id}`, {}, true);
    },
  },
});
