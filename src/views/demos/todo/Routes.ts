export default [
  {
    path: "",
    redirect: "/demos/todo/main",
  },
  {
    path: "main",
    name: "demos-todo-tasks",
    component: () =>
      import(
        /* webpackChunkName: "demos-todo-tasks" */ "@/views/demos/todo/pages/main.vue"
      ),
  },
  {
    path: "completed",
    name: "demos-todo-completed",
    component: () =>
      import(
        /* webpackChunkName: "demos-todo-completed" */ "@/views/demos/todo/pages/completed.vue"
      ),
  },
  {
    path: "label/:id",
    name: "demos-todo-label",
    component: () =>
      import(
        /* webpackChunkName: "demos-todo-label" */ "@/views/demos/todo/pages/label.vue"
      ),
  },
];
