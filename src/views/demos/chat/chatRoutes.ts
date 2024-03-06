export default [
  {
    path: "",
    redirect: "/demos/chat/main",
  },
  {
    path: "main",
    component: () =>
      import(
       "@/views/demos/chat/pages/main.vue"
      ),
  },
  //   {
  //     path: "channel/:id",
  //     name: "apps-chat-channel",
  //     component: () =>
  //       import(
  //         /* webpackChunkName: "apps-chat-channel" */ "@/views/app/chat/pages/ChatPage.vue"
  //       ),
  //   },
];
