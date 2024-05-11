import { defineStore } from "pinia";



export const useTodoStore = defineStore({
  id: "todo",
  state: () => ({
    text:"# Hello Editor",
    apiKey: "",
    chatHistory: [],
    apiKeyDialog: false,
    Sidebar:true,
    nowchat:"",
    isChatting:false,
    settings:true,
    serverip:"127.0.0.1:3000",
    Max_Tokens:1000,
    TOP_P:0.5,
    Temperature:1,
    Presence:0.3,
    Frequency:0.3,
    Penalty:400,
    tau:3.0,
    rate:0.1,
    Model:"",
    AIimg:"",
    SamplerType:"Nucleus",
    bnf_schema:"",
    state: "",

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

  },
  actions: {
    // Add new todo
    setChatting(b: boolean) {
      this.isChatting = b;
    },
  },
});
