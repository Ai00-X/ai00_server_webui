import { createRouter, createWebHistory , createWebHashHistory} from "vue-router";

import AppsRoutes from "./apps.routes";


export const routes = [
  {
    path: "/",
    redirect: "/index",
    meta: {},
  } as any,
  {
    path: "/index",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "SYSTEM",
      title: "Home",
    },
    component: () => import("@/views/pages/DashBoard.vue"),
  },
  {
    path: "/settings",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "SYSTEM",
      title: "Settings",
    },
    component: () => import("@/views/pages/Settings.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error",
    meta: {
      requiresAuth: true,
      layout: "ui",
    },
    component: () =>
      import(/* webpackChunkName: "error" */ "@/views/errors/NotFoundPage.vue"),
  },

  ...AppsRoutes,
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [];

const router = createRouter({
  history: createWebHashHistory(),
  // hash模式：createWebHashHistory，history模式：createWebHistory
  // process.env.NODE_ENV === "production"

  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});
console.log(routes)
export default router;