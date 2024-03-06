export default [
  {
    path: "",
    redirect: "/demos/lunwen/main",
  },
  {
    path: "main",
    name: "demos-lunwen-main",
    component: () =>
      import(
        /* webpackChunkName: "demos-newchat-main" */ "@/views/demos/lunwen/pages/main.vue"
      ),
  },
];
