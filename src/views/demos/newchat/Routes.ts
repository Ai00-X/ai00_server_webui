export default [
  {
    path: "",
    redirect: "/demos/newchat/main",
  },
  {
    path: "main",
    name: "demos-newchat-main",
    component: () =>
      import(
        /* webpackChunkName: "demos-newchat-main" */ "@/views/demos/newchat/pages/main.vue"
      ),
  },

];
