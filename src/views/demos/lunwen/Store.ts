import { defineStore } from "pinia";



export const useLunwenStore = defineStore({
  id: "lunwen",
  state: () => ({
 
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
    Model:"",
    AIimg:"",
    title:"",
    tigang:"",
    tigangs:[]
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

  },
});
