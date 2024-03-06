import { defineStore } from "pinia";
import { Todo } from "./Types";

const todos = [
  {
    id: 1,
    title: "兼容OpenAI的API接口",
    detail: "让chatGPT的前端，稍微改造就可以使用AI00 server！",
    completed: true,
    tags: ["Backend","API"],
  },
  {
    id: 2,
    title: "Readme编写",
    detail: "多语种的Readme编写，介绍AI00。",
    completed: true,
    tags: ["Hardwork"],
  },
  {
    id: 3,
    title: "基本的前端调用示例",
    detail: "你现在看到的就是！！：））",
    completed: true,
    tags: ["Frontend"],
  },
  {
    id: 4,
    title: "并行推理",
    detail: "Batch serve并行推理,让推理速度飞起来！",
    completed: true,
    tags: ["Backend","Hardwork"],
  },
  {
    id: 5,
    title: "INT8量化支持",
    detail: "INT8量化支持，使小显存的显卡使用7B RWKV模型成为可能！",
    completed: true,
    tags: ["Backend"],
  },
  {
    id: 6,
    title: "NF4量化支持",
    detail: "NF4量化支持，使更小显存的显卡使用14B RWKV模型成为可能！",
    completed: false,
    tags: ["Backend"],
  },
  {
    id: 7,
    title: "LoRA模型支持",
    detail: "支持LoRA模型加载！让你微调的LoRA跑起来！",
    completed: false,
    tags: ["Backend"],
  },
  {
    id: 8,
    title: "LoRA模型热加载",
    detail: "LoRA模型热加载，随意切换使用LoRA模型，像SD那样！",
    completed: false,
    tags: ["Backend"],
  },
  {
    id: 9,
    title: "HTTP服务器多zip文件支持",
    detail: "加载多个ZIP打包的HTTP文件夹，为WEB插件做准备",
    completed: false,
    tags: ["Backend"],
  },
  {
    id: 10,
    title: "文本向量化处理",
    detail: "把文本变成向量化数组，方便向量化数据库存储和查询",
    completed: false,
    tags: ["Backend", "API"],
  },
  {
    id: 11,
    title: "向量化数据库",
    detail: "向量化数据库，LLM配合的神器！",
    completed: false,
    tags: ["Backend"],
  },
  {
    id: 12,
    title: "RWKV V5模型 支持",
    detail: "RWKV V5模型正在训练中，能力暴增！！我们提前做好准备！",
    completed: false,
    tags: ["Backend"],
  },    
];

export const useTodoStore = defineStore({
  id: "todo",
  state: () => ({
    todList: todos,
    currentLabel: "Backend",
    labels: [
      {
        id: "Backend",
        title: "Backend",
        color: "orange",
      },
      {
        id: "API",
        title: "API",
        color: "green",
      },
      {
        id: "Frontend",
        title: "Frontend",
        color: "blue",
      },
      {
        id: "Hardwork",
        title: "Hardwork",
        color: "red",
      },
    ],
  }),

  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       storage: localStorage,
  //       paths: ["todoList"],
  //     },
  //   ],
  // },

  getters: {
    // Full list of todos
    getTodoList() {
      return this.todList.filter((todo: Todo) => !todo.completed);
    },

    // Completed todos
    getCompletedTodos() {
      return this.todList.filter((todo: Todo) => todo.completed);
    },

    // Specific Label todos
    getLabelTodos() {
      return this.todList.filter(
        (todo: Todo) =>
          todo.tags && todo.tags.includes(this.currentLabel) && !todo.completed
      );
    },
  },
  actions: {
    // Add new todo
    addNewTodo(todo: Todo) {
      todo.id = "_" + Math.random().toString(36).substring(2, 11);
      this.todList.push(todo);
    },
    // update todo
    updateTodo(todo: Todo) {
      const index = this.todList.findIndex((item: Todo) => item.id === todo.id);
      this.todList.splice(index, 1, todo);
    },

    // Delete todo By Id
    deleteTodoById(todoId: string) {
      const index = this.todList.findIndex((todo: Todo) => todo.id === todoId);
      this.todList.splice(index, 1);
    },
  },
});
