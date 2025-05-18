<template>
  <div>
    <h1 class="font-semibold text-2xl mb-6">Checkout</h1>

    <div v-if="cartStore.totalItems === 0" class="text-center py-8">
      <i class="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">Tidak ada produk untuk checkout</p>
      <ButtonPrimary @click="$router.push('/product')" class="mt-4">
        Belanja Sekarang
      </ButtonPrimary>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Form Checkout -->
      <div class="md:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">Informasi Pengiriman</h2>

          <form @submit.prevent="submitCheckout" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  for="nama"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Nama Lengkap</label
                >
                <input
                  type="text"
                  id="nama"
                  v-model="shippingDetails.fullName"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Email</label
                >
                <input
                  type="email"
                  id="email"
                  v-model="shippingDetails.email"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label
                for="telepon"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Nomor Telepon</label
              >
              <input
                type="tel"
                id="telepon"
                v-model="shippingDetails.phone"
                class="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label
                for="alamat"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Alamat</label
              >
              <textarea
                id="alamat"
                v-model="shippingDetails.address"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md"
                required
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  for="kota"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Kota</label
                >
                <input
                  type="text"
                  id="kota"
                  v-model="shippingDetails.city"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  for="provinsi"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Provinsi</label
                >
                <input
                  type="text"
                  id="provinsi"
                  v-model="shippingDetails.province"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  for="kodepos"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Kode Pos</label
                >
                <input
                  type="text"
                  id="kodepos"
                  v-model="shippingDetails.postalCode"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label
                for="metode-pengiriman"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Metode Pengiriman</label
              >
              <select
                id="metode-pengiriman"
                v-model="shippingDetails.shippingMethod"
                class="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Pilih metode pengiriman</option>
                <option
                  v-for="method in shippingMethods"
                  :key="method.id"
                  :value="method.id"
                >
                  {{ method.name }} - {{ formatPrice(method.price) }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="metode-pembayaran"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Metode Pembayaran</label
              >
              <select
                id="metode-pembayaran"
                v-model="shippingDetails.paymentMethod"
                class="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Pilih metode pembayaran</option>
                <option
                  v-for="method in paymentMethods"
                  :key="method.id"
                  :value="method.id"
                >
                  {{ method.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="catatan"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Catatan (opsional)</label
              >
              <textarea
                id="catatan"
                v-model="shippingDetails.notes"
                rows="3"
                class="w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <ButtonPrimary
                type="submit"
                class="bg-green-600 hover:bg-green-700"
              >
                <i class="ri-secure-payment-line mr-2"></i>Selesaikan Pembelian
              </ButtonPrimary>
            </div>
          </form>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="md:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>

          <div class="space-y-4">
            <div
              v-for="item in cartStore.itemsWithDetails"
              :key="item.id"
              class="flex items-start space-x-3 pb-4 border-b"
            >
              <div class="h-16 w-16 flex-shrink-0">
                <img
                  :src="item.picture_url"
                  :alt="item.name"
                  class="h-full w-full object-cover rounded-md"
                />
              </div>
              <div class="flex-grow">
                <h3 class="text-sm font-medium">{{ item.name }}</h3>
                <p class="text-sm text-gray-500">
                  {{ item.quantity }} x {{ formatPrice(item.price) }}
                </p>
                <p class="text-sm font-medium">
                  {{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>
            </div>

            <div class="space-y-2 pt-2">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Pengiriman</span>
                <span>{{ selectedShippingPrice }}</span>
              </div>
              <div
                class="flex justify-between pt-2 border-t border-gray-200 font-semibold"
              >
                <span>Total</span>
                <span>{{ formatPrice(totalPriceWithShipping) }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <ButtonPrimary
              @click="$router.push('/cart')"
              class="w-full bg-gray-600 hover:bg-gray-700"
            >
              <i class="ri-arrow-left-line mr-2"></i>Kembali ke Keranjang
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "@/stores/cart.store.js";
import { useTransactionStore } from "@/stores/transaction.store.js";

export default {
  name: "CheckoutView",
  data() {
    return {
      cartStore: useCartStore(),
      transactionStore: useTransactionStore(),
      shippingDetails: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        province: "",
        postalCode: "",
        shippingMethod: "",
        paymentMethod: "",
        notes: "",
      },
      shippingMethods: [
        { id: "regular", name: "Reguler (2-3 hari)", price: 20000 },
        { id: "express", name: "Express (1 hari)", price: 40000 },
        { id: "same-day", name: "Same Day", price: 60000 },
      ],
      paymentMethods: [
        { id: "transfer", name: "Transfer Bank" },
        { id: "ewallet", name: "E-Wallet" },
        { id: "cod", name: "Cash on Delivery" },
      ],
    };
  },
  computed: {
    selectedShippingPrice() {
      const selectedMethod = this.shippingMethods.find(
        (method) => method.id === this.shippingDetails.shippingMethod
      );
      return selectedMethod ? this.formatPrice(selectedMethod.price) : "Rp 0";
    },
    totalPriceWithShipping() {
      const selectedMethod = this.shippingMethods.find(
        (method) => method.id === this.shippingDetails.shippingMethod
      );
      const shippingPrice = selectedMethod ? selectedMethod.price : 0;
      return this.cartStore.totalPrice + shippingPrice;
    },
  },
  methods: {
    formatPrice(price) {
      return "Rp " + Number(price).toLocaleString("id-ID");
    },
    submitCheckout() {
      // Validasi form (bisa diperluas)
      if (!this.validateForm()) {
        return;
      }

      try {
        // Buat transaksi baru
        const transactionId = this.transactionStore.createTransaction({
          ...this.shippingDetails,
          totalShipping:
            this.shippingMethods.find(
              (method) => method.id === this.shippingDetails.shippingMethod
            )?.price || 0,
        });

        // Arahkan ke halaman konfirmasi dengan ID transaksi
        this.$router.push(`/transaction/confirmation/${transactionId}`);
      } catch (error) {
        this.$swal({
          title: "Error",
          text: "Terjadi kesalahan saat memproses transaksi",
          icon: "error",
        });
        console.error("Checkout error:", error);
      }
    },
    validateForm() {
      // Validasi sederhana, bisa diperluas sesuai kebutuhan
      if (!this.shippingDetails.shippingMethod) {
        this.$swal({
          title: "Perhatian",
          text: "Silakan pilih metode pengiriman",
          icon: "warning",
        });
        return false;
      }

      if (!this.shippingDetails.paymentMethod) {
        this.$swal({
          title: "Perhatian",
          text: "Silakan pilih metode pembayaran",
          icon: "warning",
        });
        return false;
      }

      return true;
    },
  },
  created() {
    // Jika keranjang kosong, redirect ke halaman keranjang
    if (this.cartStore.totalItems === 0) {
      this.$router.push("/cart");
    }
  },
};
</script>
