<template>
  <div>
    <h1 class="font-semibold text-2xl mb-6">Riwayat Transaksi</h1>

    <div
      v-if="transactionStore.totalTransactions === 0"
      class="text-center py-8"
    >
      <i class="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">Belum ada transaksi</p>
      <ButtonPrimary @click="$router.push('/product')" class="mt-4">
        Belanja Sekarang
      </ButtonPrimary>
    </div>

    <div v-else>
      <!-- Filter dan Pencarian -->
      <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div class="flex items-center space-x-2">
          <label for="status-filter" class="text-sm text-gray-600"
            >Filter Status:</label
          >
          <select
            id="status-filter"
            v-model="filterStatus"
            class="p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu Pembayaran</option>
            <option value="processing">Diproses</option>
            <option value="shipped">Dikirim</option>
            <option value="delivered">Terkirim</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>

        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari transaksi..."
            class="w-full md:w-64 p-2 pl-10 border border-gray-300 rounded-md text-sm"
          />
          <i
            class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>

      <!-- Daftar Transaksi -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th class="px-6 py-3 text-left">ID Transaksi</th>
                <th class="px-6 py-3 text-left">Tanggal</th>
                <th class="px-6 py-3 text-center">Total Item</th>
                <th class="px-6 py-3 text-right">Total Harga</th>
                <th class="px-6 py-3 text-center">Status</th>
                <th class="px-6 py-3 text-center">Pembayaran</th>
                <th class="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="transaction in filteredTransactions"
                :key="transaction.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap font-medium">
                  {{ transaction.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="px-6 py-4 text-center">
                  {{ countItems(transaction.items) }}
                </td>
                <td class="px-6 py-4 text-right">
                  {{ formatPrice(transaction.totalAmount) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="{
                      'px-3 py-1 text-xs font-medium rounded-full': true,
                      'bg-yellow-100 text-yellow-800':
                        transaction.status === 'pending',
                      'bg-blue-100 text-blue-800':
                        transaction.status === 'processing',
                      'bg-indigo-100 text-indigo-800':
                        transaction.status === 'shipped',
                      'bg-green-100 text-green-800':
                        transaction.status === 'delivered',
                      'bg-red-100 text-red-800':
                        transaction.status === 'cancelled',
                    }"
                    class="whitespace-nowrap"
                  >
                    {{ formatStatus(transaction.status) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="{
                      'px-3 py-1 text-xs font-medium rounded-full': true,
                      'bg-green-100 text-green-800':
                        transaction.paymentStatus === 'paid',
                      'bg-yellow-100 text-yellow-800':
                        transaction.paymentStatus === 'pending' ||
                        transaction.paymentStatus === 'unpaid',
                      'bg-red-100 text-red-800':
                        transaction.paymentStatus === 'failed',
                    }"
                    class="whitespace-nowrap"
                  >
                    {{ formatPaymentStatus(transaction.paymentStatus) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <button
                      @click="viewTransaction(transaction.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Lihat Detail"
                    >
                      <i class="ri-eye-line text-lg"></i>
                    </button>
                    <button
                      v-if="
                        transaction.status === 'pending' &&
                        transaction.paymentStatus !== 'paid'
                      "
                      @click="payTransaction(transaction.id)"
                      class="text-green-600 hover:text-green-900"
                      title="Bayar"
                    >
                      <i class="ri-bank-card-line text-lg"></i>
                    </button>
                    <button
                      v-if="canCancelTransaction(transaction)"
                      @click="cancelTransaction(transaction.id)"
                      class="text-red-600 hover:text-red-900"
                      title="Batalkan"
                    >
                      <i class="ri-close-circle-line text-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredTransactions.length === 0" class="py-8 text-center">
          <p class="text-gray-500">
            Tidak ada transaksi yang sesuai dengan filter
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTransactionStore } from "@/stores/transaction.store.js";

export default {
  name: "TransactionListView",
  data() {
    return {
      transactionStore: useTransactionStore(),
      filterStatus: "",
      searchQuery: "",
    };
  },
  computed: {
    filteredTransactions() {
      let result = [...this.transactionStore.transactions];

      // Filter berdasarkan status
      if (this.filterStatus) {
        result = result.filter(
          (transaction) => transaction.status === this.filterStatus
        );
      }

      // Filter berdasarkan pencarian
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter((transaction) => {
          return (
            transaction.id.toLowerCase().includes(query) ||
            transaction.shippingDetails.fullName?.toLowerCase().includes(query)
          );
        });
      }

      // Urutkan berdasarkan tanggal terbaru
      return result.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    countItems(items) {
      return items.reduce((total, item) => total + item.quantity, 0);
    },
    viewTransaction(transactionId) {
      this.$router.push(`/transaction/confirmation/${transactionId}`);
    },
    payTransaction(transactionId) {
      // Simulasi pembayaran
      this.$swal({
        title: "Proses Pembayaran",
        text: "Apakah Anda ingin melanjutkan pembayaran untuk transaksi ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, lanjutkan",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          // Dalam aplikasi sebenarnya, di sini akan mengarahkan ke halaman payment gateway
          this.transactionStore.updatePaymentStatus(transactionId, "paid");
          this.transactionStore.updateTransactionStatus(
            transactionId,
            "processing"
          );

          this.$swal({
            title: "Pembayaran Berhasil",
            text: "Pembayaran telah berhasil diproses",
            icon: "success",
          });
        }
      });
    },
    cancelTransaction(transactionId) {
      this.$swal({
        title: "Batalkan Transaksi",
        text: "Apakah Anda yakin ingin membatalkan transaksi ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, batalkan",
        cancelButtonText: "Tidak",
        confirmButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          const success =
            this.transactionStore.cancelTransaction(transactionId);

          if (success) {
            this.$swal({
              title: "Transaksi Dibatalkan",
              text: "Transaksi berhasil dibatalkan",
              icon: "success",
            });
          } else {
            this.$swal({
              title: "Gagal",
              text: "Tidak dapat membatalkan transaksi ini",
              icon: "error",
            });
          }
        }
      });
    },
    canCancelTransaction(transaction) {
      // Transaksi hanya bisa dibatalkan jika status pending atau processing
      return ["pending", "processing"].includes(transaction.status);
    },
  },
};
</script>
