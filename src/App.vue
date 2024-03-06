<template>
  <v-app :theme="customizeTheme.darkTheme ? 'dark' : 'light'">
    <component :is="currentLayout" v-if="isRouterLoaded">
      <router-view> </router-view>
    </component>
 
    <BackToTop />
    <Snackbar />
    <LoginDialog />
  </v-app>
</template>

<script setup lang="ts">
import UILayout from "@/layouts/UILayout.vue";
import LandingLayout from "@/layouts/LandingLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
//import CustomizationMenu from "@/components/CustomizationMenu.vue";
import { useCustomizeThemeStore } from "@/stores/customizeTheme";
import BackToTop from "@/components/common/BackToTop.vue";
import Snackbar from "@/components/common/Snackbar.vue";
import LoginDialog from "@/components/LoginDialog.vue";


import { useAi00Store } from "@/ai00sdk/ai00Store";

const ai00Store = useAi00Store();

if(window.location.host == "localhost:4399"){
  ai00Store.setserverip("127.0.0.1:65530");

}else{
  ai00Store.setserverip(window.location.host)
}

const customizeTheme = useCustomizeThemeStore();
const route = useRoute();

const isRouterLoaded = computed(() => {
  if (route.name !== null) return true;
  return false;
});

const layouts = {
  default: DefaultLayout,
  ui: UILayout,
  landing: LandingLayout,
  auth: AuthLayout,
};

type LayoutName = "default" | "ui" | "landing" | "auth" | "error";

const currentLayout = computed(() => {
  const layoutName = route.meta.layout as LayoutName;
  if (!layoutName) {
    return DefaultLayout;
  }
  return layouts[layoutName];
});
</script>

<style scoped></style>
