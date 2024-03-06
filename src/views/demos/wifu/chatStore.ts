import { defineStore } from "pinia";
import type { Message, User } from "./chatTypes";
const Ai:User = {
  id: 2,
  name: "Assistant",
  avatar: "/tou/0.png"
}

const You:User = {
  id: 1,
  name: "User",
  avatar: "/tou/8.png"
}

const history: Message = {
  id: "",
  user: Ai,
  text: "",
  timestamp: ""
}

const historys = [];
historys.push(history)

export const useChatStore = defineStore({
  id: "chat2",
  state: () => ({
    apiKey: "",
    chatHistory: historys,
    apiKeyDialog: false,
    Sidebar: true,
    nowchat: "",
    isChatting: false,
    settings: true,
    serverip: "127.0.0.1:3000",
    Max_Tokens: 1000,
    TOP_P: 0.5,
    Temperature: 1,
    Presence: 0.3,
    Frequency: 0.3,
    Penalty: 400,
    Model: "",
    AIimg: "",
    AIname: "",
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ["chatHistory", "nowchat", "isWenda", "serverip", "serverport"],
      },
    ],
  },

  getters: {
    getChatHistory() {
      return this.chatHistory;
    },
    // If you have set up an API key, please use your own key. If not, please use the one I provided.
  },
  actions: {
    getSettings() {
      return this.settings;
    },
    setSettings() {
      this.settings = !this.settings;
    },
    getserverip() {
      return this.serverip;
    },
    getserverport() {
      return this.serverport;
    },
    setserverip(ip: string) {
      this.serverip = ip;
    },
    setserverport(port: string) {
      this.serverport = port;
    },
    getiswenda() {
      return this.isWenda;
    },
    setiswenda(bb: boolean) {
      this.isWenda = bb;
    },
    addToHistory(payload: Message) {
      this.chatHistory.push(payload);
    },
    startHistory(payload: Message) {
      this.chatHistory = [];
      this.chatHistory.push(payload);
    },
    setHistory(his) {
      this.chatHistory = [];
      this.chatHistory = his;
    },
    setnowchat(nowchatid: string) {
      this.nowchat = nowchatid;
    },
    getnowchat() {
      return this.nowchat;
    },
    getChatting() {
      return this.isChatting;
    },
    getHistory() {
      return this.chatHistory;
    },
    setChatting(b: boolean) {
      this.isChatting = b;
    },
    clearHistory2() {
      this.chatHistory = [];
    },
    clearHistory() {
      this.chatHistory = [];
    },
    // 移除最后一条临时信息
    removeLatestMessage() {
      this.chatHistory.pop();
    },
    changeLatestMessage(msg: string) {
      let newmsg = this.chatHistory[this.chatHistory.length - 1];

      this.chatHistory[this.chatHistory.length];
      //console.log(newmsg);
      newmsg["text"] = msg;
      this.chatHistory.splice([this.chatHistory.length - 1], 1, newmsg);
    },
    getLatestMessage() {
      return this.chatHistory[this.chatHistory.length - 1];
    },
    deleteMessage(id: string) {
 
      let msg = this.chatHistory.find((item) => item.id === id);
      //获取 msg的 index
      let index = this.chatHistory.indexOf(msg);
      if(index==0){return}
      if (msg.user.id === 1) {
        this.chatHistory.splice(index, 2);
      }
      if (msg.user.id === 2) {
        this.chatHistory.splice(index - 1, 2);
      }
    },
  },
});
