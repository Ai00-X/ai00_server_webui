<!--
* @Component: ToolbarNotifications
* @Maintainer: AI00
* @Description:
-->
<script setup lang="ts">

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();

const authStore = useAuthStore();
const handleLogout = () => {
  authStore.logout();
  console.log("---");
  console.log(router);
};

 

const navs = [
  {
    title: "注册用户",
    key: "menu.profileDetails",
    link: "/profile",
    icon: "mdi-account-box-outline",
  },
  {
    title: "用户登录",
    key: "menu.plansAndBilling",
    link: "/plans-and-billing",
    icon: "mdi-credit-card-outline",
  },
];
</script>

<template>
 
  <v-menu :close-on-content-click="false" location="bottom right" transition="slide-y-transition">
    <!-- ---------------------------------------------- -->
    <!-- Activator Btn -->
    <!-- ---------------------------------------------- -->
    <template  v-if="!authStore.isLoggedIn" v-slot:activator >
      <v-btn class="mx-2" icon @click="authStore.configDialog = true;">
        <v-avatar size="40">
          <v-img src="/tou/user.jpg"></v-img>
        </v-avatar>
      </v-btn>
    </template>
    <template v-else v-slot:activator="{ props }" >
      <v-btn class="mx-2" icon v-bind="props">
        <v-avatar size="40">
          <v-img src="/tou/user.jpg"></v-img>
        </v-avatar>
      </v-btn>
    </template>
    <v-card max-width="300">
      <v-list lines="three" density="compact">
        <!-- ---------------------------------------------- -->
        <!-- Profile Area -->
        <!-- ---------------------------------------------- -->
        <v-list-item >
          <template v-slot:prepend>
            <v-avatar size="40">
              <v-img src="/tou/user.jpg"></v-img>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-primary">
            未注册用户
          </v-list-item-title>
          <v-list-item-subtitle>
            <!-- {{ $store.state.user.email  }} -->
            xxxxx@gmail.com
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-divider />
      <!-- ---------------------------------------------- -->
      <!-- Menu Area -->
      <!-- ---------------------------------------------- -->
      <v-list variant="flat" elevation="0" :lines="false" density="compact">
        <v-list-item color="primary" v-for="(nav, i) in navs" :key="i"   link density="compact">
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>{{ nav.icon }}</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2">{{
              nav.title
            }}</v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
      <v-divider />
      <!-- ---------------------------------------------- -->
      <!-- Logout Area -->
      <!-- ---------------------------------------------- -->
      <v-list variant="flat" elevation="0" :lines="false" density="compact">
        <v-list-item color="primary" to="nav.link" link density="compact">
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>mdi-lifebuoy</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2">
              Help Center
            </v-list-item-subtitle>
          </div>
        </v-list-item>
        <v-list-item color="primary" link @click="handleLogout" density="compact">
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>mdi-logout</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2">
              Logout
            </v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped lang="scss">
// ::v-deep .v-list-item__append,
// ::v-deep .v-list-item__prepend {
//   height: 100%;
// }
</style>
