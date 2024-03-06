<!--
* @Component:
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
import ToolbarLanguage from "./ToolbarLanguage.vue";
import ToolbarNotifications from "./ToolbarNotifications.vue";
import ToolbarUser from "./ToolbarUser.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import ToolbarColor from "./ToolbarColor.vue";
import { Icon } from "@iconify/vue";

const { mdAndUp } = useDisplay();

const customizeTheme = useCustomizeThemeStore();
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!--App Bar -->
  <!-- ---------------------------------------------- -->
  <v-app-bar :density="mdAndUp ? 'default' : 'compact'">
    <!-- ---------------------------------------------- -->
    <!-- search input mobil -->
    <!-- ---------------------------------------------- -->
    <div class="px-2 d-flex align-center justify-space-between w-100">
      <!-- ---------------------------------------------- -->
      <!-- NavIcon -->
      <!-- ---------------------------------------------- -->
      <v-app-bar-nav-icon
        @click="customizeTheme.mainSidebar = !customizeTheme.mainSidebar"
      ></v-app-bar-nav-icon>
      <div></div>
      <Breadcrumb />
      <v-spacer></v-spacer>

      <div class="d-flex">
        <ToolbarColor />
        <v-btn
          @click="customizeTheme.darkTheme = !customizeTheme.darkTheme"
          icon
          color="primary"
          v-if="customizeTheme.darkTheme"
        >
          <Icon width="30" icon="line-md:moon-filled-loop" />
        </v-btn>

        <v-btn
          @click="customizeTheme.darkTheme = !customizeTheme.darkTheme"
          icon
          color="primary"
          v-else
        >
          <Icon
            width="30"
            icon="line-md:moon-filled-alt-to-sunny-filled-loop-transition"
          />
        </v-btn>
        <ToolbarLanguage />
        <v-divider vertical thickness="2" inset class="ml-5 mr-1" color="primary"></v-divider>
        <ToolbarNotifications />
        
        <v-divider vertical thickness="2" inset class="ml-5 mr-1" color="primary"></v-divider>
        <ToolbarUser />
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss"></style>
