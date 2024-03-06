/**
 * main.js
 *
 */

// Components



import App from "./App.vue";

// Composables
import  Ai00Api  from "@/ai00sdk/ai00Api";
import { createApp } from "vue";
import vuetify from "./plugins/vuetify";
import MasonryWall from "@yeger/vue-masonry-wall";
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import VueApexCharts from "vue3-apexcharts";
import piniaPersist from "pinia-plugin-persist";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import "@/styles/main.scss";
import router from "./router";
import i18n from "./plugins/i18n";
import "vue3-lottie/dist/style.css";
import Vue3Lottie from "vue3-lottie";



const pinia = createPinia();
pinia.use(piniaPersist);
const app = createApp(App);

declare global {
    interface Window {
      Ai00Api: typeof Ai00Api;
    }
  }
//app.config.globalProperties.$Ai00Api = Ai00Api;
window.Ai00Api = Ai00Api; 

app.use(router);
app.use(PerfectScrollbar);
app.use(MasonryWall);
app.use(VueVirtualScroller);
app.use(VueApexCharts);
app.use(pinia);
app.use(i18n);
app.use(Vue3Lottie, { name: "LottieAnimation" });
app.use(vuetify);
app.mount("#app");


