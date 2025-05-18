<template>
  <div class="flex flex-col h-screen">
    <!-- Navbar -->
    <Navbar />

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <div class="flex-1 p-5 overflow-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar/index.vue";
import Sidebar from "@/components/Sidebar/index.vue";

export default {
  name: "ExampleLayout",
  components: {
    Navbar,
    Sidebar,
  },
};
</script>

<style>
.link {
  @apply px-2 cursor-pointer hover:text-red-400;
}
</style>
