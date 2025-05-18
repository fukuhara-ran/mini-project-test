<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
      ></div>
    </div>

    <div v-else-if="!transaction" class="text-center py-8">
      <i class="ri-error-warning-line text-6xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">Transaksi tidak ditemukan</p>
      <ButtonPrimary @click="$router.push('/product')" class="mt-4">
        Belanja Sekarang
      </ButtonPrimary>
    </div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-2xl font-semibold">Konfirmasi Pembelian</h1>
          <p class="text-gray-600">Terima kasih atas pesanan Anda</p>
        </div>
        <div class="bg-green-100 text-green-800 px-4 py-2 rounded-md">
          <p class="text-sm font-medium">
            Status: {{ formatStatus(transaction.status) }}
          </p>
        </div>
      </div>

      <!-- Transaction Details -->
      <div class="mb-6 p-4 bg-gray-50 rounded-md">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Nomor Transaksi</p>
            <p class="font-medium">{{ transaction.id }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tanggal Pemesanan</p>
            <p class="font-medium">{{ formatDate(transaction.date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status Pembayaran</p>
            <p
              :class="{
                'font-medium': true,
                'text-green-600': transaction.paymentStatus === 'paid',
                'text-yellow-600': transaction.paymentStatus === 'pending',
                'text-red-600': transaction.paymentStatus === 'failed',
              }"
            >
              {{ formatPaymentStatus(transaction.paymentStatus) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Metode Pembayaran</p>
            <p class="font-medium">
              {{
                formatPaymentMethod(transaction.shippingDetails.paymentMethod)
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Shipping Details -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-3">Informasi Pengiriman</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <p class="text-sm text-gray-600">Nama Penerima</p>
            <p class="font-medium">
              {{ transaction.shippingDetails.fullName }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Email</p>
            <p class="font-medium">{{ transaction.shippingDetails.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Nomor Telepon</p>
            <p class="font-medium">{{ transaction.shippingDetails.phone }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Metode Pengiriman</p>
            <p class="font-medium">
              {{
                formatShippingMethod(transaction.shippingDetails.shippingMethod)
              }}
            </p>
          </div>
        </div>
        <div class="mb-3">
          <p class="text-sm text-gray-600">Alamat Pengiriman</p>
          <p class="font-medium">
            {{ transaction.shippingDetails.address }},
            {{ transaction.shippingDetails.city }},
            {{ transaction.shippingDetails.province }},
            {{ transaction.shippingDetails.postalCode }}
          </p>
        </div>
        <div v-if="transaction.shippingDetails.notes">
          <p class="text-sm text-gray-600">Catatan</p>
          <p class="font-medium">{{ transaction.shippingDetails.notes }}</p>
        </div>
      </div>

      <!-- Order Items -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-3">Produk yang Dibeli</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-700">
              <tr>
                <th class="py-3 px-4 text-left">Produk</th>
                <th class="py-3 px-4 text-center">Jumlah</th>
                <th class="py-3 px-4 text-right">Harga</th>
                <th class="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in transaction.items" :key="item.id">
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-3">
                    <img
                      :src="item.picture_url"
                      :alt="item.name"
                      class="h-12 w-12 object-cover rounded"
                    />
                    <span class="font-medium">{{ item.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-center">{{ item.quantity }}</td>
                <td class="py-3 px-4 text-right">
                  {{ formatPrice(item.price) }}
                </td>
                <td class="py-3 px-4 text-right">
                  {{ formatPrice(item.price * item.quantity) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="mb-6 border-t pt-4">
        <h2 class="text-lg font-semibold mb-3">Ringkasan Pembayaran</h2>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Subtotal</span>
          <span>{{ formatPrice(calculateSubtotal) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Biaya Pengiriman</span>
          <span>{{
            formatPrice(transaction.shippingDetails.totalShipping)
          }}</span>
        </div>
        <div
          class="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2 mt-2"
        >
          <span>Total</span>
          <span>{{ formatPrice(transaction.totalAmount) }}</span>
        </div>
      </div>

      <!-- Payment Instructions -->
      <div
        v-if="transaction.paymentStatus !== 'paid'"
        class="mb-6 p-4 bg-yellow-50 rounded-md"
      >
        <h2 class="text-lg font-semibold mb-2">Instruksi Pembayaran</h2>
        <div v-if="transaction.shippingDetails.paymentMethod === 'transfer'">
          <p class="mb-2">Silakan transfer pembayaran ke rekening berikut:</p>
          <ul class="list-disc list-inside mb-3 space-y-1">
            <li>Bank BCA: 1234567890 a/n PT Example Shop</li>
            <li>Bank Mandiri: 0987654321 a/n PT Example Shop</li>
          </ul>
          <p class="text-sm">
            Setelah melakukan pembayaran, mohon konfirmasi dengan mengirimkan
            bukti transfer ke email support@exampleshop.com
          </p>
        </div>
        <div
          v-else-if="transaction.shippingDetails.paymentMethod === 'ewallet'"
        >
          <p class="mb-2">
            Silakan scan QR code berikut untuk melakukan pembayaran:
          </p>
          <div
            class="w-48 h-48 bg-gray-300 mx-auto my-3 flex items-center justify-center"
          >
            <p class="text-gray-600 text-sm">QR Code Pembayaran</p>
          </div>
          <p class="text-sm">
            Pembayaran akan otomatis terverifikasi setelah Anda menyelesaikan
            transaksi
          </p>
        </div>
        <div v-else-if="transaction.shippingDetails.paymentMethod === 'cod'">
          <p>
            Silakan siapkan uang tunai sebesar
            {{ formatPrice(transaction.totalAmount) }} yang akan dibayarkan
            kepada kurir saat pesanan tiba.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap justify-between items-center">
        <ButtonPrimary
          @click="$router.push('/product')"
          class="mb-2 sm:mb-0 bg-gray-600 hover:bg-gray-700"
        >
          <i class="ri-arrow-left-line mr-2"></i>Lanjutkan Belanja
        </ButtonPrimary>

        <div class="flex space-x-4">
          <ButtonPrimary
            @click="printInvoice"
            class="bg-blue-600 hover:bg-blue-700"
          >
            <i class="ri-printer-line mr-2"></i>Cetak Invoice
          </ButtonPrimary>

          <ButtonPrimary
            @click="trackOrder"
            class="bg-green-600 hover:bg-green-700"
          >
            <i class="ri-map-pin-line mr-2"></i>Lacak Pesanan
          </ButtonPrimary>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTransactionStore } from "@/stores/transaction.store.js";

export default {
  name: "TransactionConfirmationView",
  data() {
    return {
      transactionStore: useTransactionStore(),
      transaction: null,
      loading: true,
    };
  },
  computed: {
    calculateSubtotal() {
      if (!this.transaction) return 0;

      return this.transaction.items.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
      );
    },
  },
  methods: {
    formatPrice(price) {
      return "Rp " + Number(price).toLocaleString("id-ID");
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    },
    formatStatus(status) {
      const statusMap = {
        pending: "Menunggu Pembayaran",
        processing: "Diproses",
        shipped: "Dikirim",
        delivered: "Terkirim",
        cancelled: "Dibatalkan",
      };
      return statusMap[status] || status;
    },
    formatPaymentStatus(status) {
      const statusMap = {
        paid: "Sudah Dibayar",
        unpaid: "Belum Dibayar",
        pending: "Menunggu Verifikasi",
        failed: "Gagal",
      };
      return statusMap[status] || status;
    },
    formatShippingMethod(method) {
      const methodMap = {
        regular: "Reguler (2-3 hari)",
        express: "Express (1 hari)",
        "same-day": "Same Day",
      };
      return methodMap[method] || method;
    },
    formatPaymentMethod(method) {
      const methodMap = {
        transfer: "Transfer Bank",
        ewallet: "E-Wallet",
        cod: "Cash on Delivery",
      };
      return methodMap[method] || method;
    },
    loadTransaction() {
      const transactionId = this.$route.params.id;

      if (!transactionId) {
        this.loading = false;
        return;
      }

      this.transaction =
        this.transactionStore.getTransactionById(transactionId);
      this.loading = false;
    },
    printInvoice() {
      this.$swal({
        title: "Print Invoice",
        text: "Fitur cetak invoice sedang dalam pengembangan",
        icon: "info",
      });
    },
    trackOrder() {
      this.$swal({
        title: "Lacak Pesanan",
        text: "Fitur pelacakan pesanan sedang dalam pengembangan",
        icon: "info",
      });
    },
  },
  created() {
    this.loadTransaction();
  },
};
</script>
