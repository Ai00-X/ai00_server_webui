 
import chatRoutes from "@/views/demos/chat/chatRoutes";
import todoRoutes from "@/views/demos/todo/Routes";
import newchatRoutes from "@/views/demos/newchat/Routes";
import wifuRoutes from "@/views/demos/wifu/Routes";
import lunwenRoutes from "@/views/demos/lunwen/Routes";

export default [
  {
    path: "/demos/chat",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "DEMOS",
      title: "Chat",
    },
    component: () =>
      import("@/views/demos/chat/App.vue"),
    children: [...chatRoutes],
  },
  {
    path: "/demos/todo",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "DEVELOPER",
      title: "Todo",
    },
    component: () =>
      import("@/views/demos/todo/App.vue"),
    children: [...todoRoutes],
  },  
  {
    path: "/demos/newchat",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "DEMOS",
      title: "Write",
    },
    component: () =>
      import("@/views/demos/newchat/App.vue"),
    children: [...newchatRoutes],
  },
  {
    path: "/demos/lunwen",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "DEMOS",
      title: "Lunwen",
    },
    component: () =>
      import("@/views/demos/lunwen/App.vue"),
    children: [...lunwenRoutes],
  },
  /*
  {
    path: "/demos/wifu",
    meta: {
      requiresAuth: true,
      layout: "ui",
      category: "DEMOS",
      title: "Wifu",
    },
    component: () =>
      import("@/views/demos/wifu/App.vue"),
    children: [...wifuRoutes],
  },*/
]; 
