<script setup lang="ts">

import MainSidevar from "@/components/navigation/MainSidebar.vue";
import MainAppbar from "@/components/toolbar/MainAppbar.vue";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
const customizeTheme = useCustomizeThemeStore();

// import GlobalLoading from "@/components/GlobalLoading.vue";
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Main Sidebar -->
  <!-- ---------------------------------------------- -->
  <MainSidevar />
  <!-- ---------------------------------------------- -->
  <!---Top AppBar -->
  <!-- ---------------------------------------------- -->
  <MainAppbar />
  <!-- ---------------------------------------------- -->
  <!---MainArea -->
  <!-- ---------------------------------------------- -->

  <v-main
    v-touch="{
      left: () => (customizeTheme.mainSidebar = false),
      right: () => (customizeTheme.mainSidebar = true),
    }"
    class="main-container"
  >
    <!-- <GlobalLoading /> -->

    <div class="">
      <slot></slot>
    </div>
  </v-main>
</template>

<style scoped>
.scrollnav {
  height: calc(100vh - 326px);
}

.main-container {
  height: calc(100vh - 326px);
  display: flex;
  flex-direction: column;
}
</style>
