<template>
  <div class="flex flex-col h-screen">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <div class="flex-1 overflow-auto py-5 px-40">
      <slot />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar/index.vue";

export default {
  name: "ExampleLayout",
  components: {
    Navbar,
  },
};
</script>

<style>
.link {
  @apply px-2 cursor-pointer hover:text-red-400;
}
</style>
