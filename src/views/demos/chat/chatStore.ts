import { defineStore } from "pinia";
import type { Message, User , clist } from "./chatTypes";

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
  id: "123",
  user: Ai,
  text: "hi",
  timestamp: ""
}

const ss :Message[] = []
ss.push(history)

const historys:clist = {
  id_name: "123",
  history: ss,
  ai:Ai,
  me:You
}


export const useChatStore = defineStore({
  id: "rpgchat",
  state: () => ({
    apiKey: "",
    chatHistory: historys,
    newchatDialog: false,
    Sidebar: true,
    nowchat: "",
    isChatting: false,
    showSetting: true,

    Max_Tokens: 1000,
    TOP_P: 0.5,
    Temperature: 1,
    Presence: 0.3,
    Frequency: 0.3,
    Penalty: 400,
    tau:3.0,
    rate:0.1,
    SamplerType: "Nucleus",

    Model: "",
  }),

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ["chatHistory", "nowchat"],
      },
    ],
  },

  getters: {
    getChatHistory() {
      return this.chatHistory;
    },
  },
  actions: {

    setSettings() {
      this.showSetting = !this.showSetting;
    },

    addToHistory(payload: Message) {
      this.chatHistory.history.push(payload);
    },
    startHistory(payload: Message,me:User,ai:User) {
      this.chatHistory.history = [];
      this.chatHistory.history.push(payload);
      this.chatHistory.ai = ai;
      this.chatHistory.me = me;
    },
    setHistory(his: clist) {
      console.log(this.chatHistory)
      this.chatHistory.history= his.history;
      this.chatHistory.ai =his.ai;
      this.chatHistory.me = his.me;

      },
    setnowchat(nowchatid: string) {
      this.nowchat = nowchatid;
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
      this.chatHistory.history.pop();
    },
    removeOtherMessage(timestamp: number) {
      const history = this.chatHistory.history;
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].timestamp >= timestamp) {
          history.splice(i, 1);
        } else {
          // 由于历史记录是按时间排序的，
          // 一旦遇到不满足条件的记录就可以停止循环
          break;
        }
      }
      console.log(history);
    },


    changeLatestMessage(msg: string) {
      let newmsg = this.chatHistory.history[this.chatHistory.history.length - 1];

      this.chatHistory[this.chatHistory.history.length];
      //console.log(newmsg);
      newmsg["text"] = msg;
      this.chatHistory.history.splice([this.chatHistory.history.length - 1], 1, newmsg);
    },
    getLatestMessage() {
      return this.chatHistory.history[this.chatHistory.history.length - 1];
    },
    deleteMessage(id: string) {

      let msg = this.chatHistory.history.find((item) => item.id === id);
      //获取 msg的 index
      let index = this.chatHistory.history.indexOf(msg);
      if(index==0){return}
      if (msg.user.id === 1) {
        this.chatHistory.history.splice(index, 2);
      }
      if (msg.user.id === 2) {
        this.chatHistory.history.splice(index - 1, 2);
      }
    },
  },
});
