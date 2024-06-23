import { defineStore } from "pinia";
import type { Message, User, clist } from "./chatTypes";
import i18n from "@/plugins/i18n";
import * as ai00Type from "@/ai00sdk/ai00Type";
const Ai: User = {
  id: 2,
  name: "Assistant",
  avatar: "/tou/0.png",
};

const You: User = {
  id: 1,
  name: "User",
  avatar: "/tou/8.png",
};

// const history: Message = {
//   id: "123",
//   user: Ai,
//   text: "hi",
//   timestamp: ""
// }

// const history: Message = {
//   id: "_" + Math.random().toString(36).substring(2, 11),
//   user: Ai,
//   // @ts-ignore
//   text:i18n.global.t("chat.hello"),
//   timestamp: new Date().getTime(),
// };
// const ss :Message[] = []
// ss.push(history)

const historys: clist = {
  id_name: "123",
  history: [],
  ai: Ai,
  me: You,
};

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
    SamplerType: "Nucleus",
    Sampler_Nucleus:{
      type: "Nucleus",
      top_p: 0.5,
      top_k: 128,
      temperature: 1,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
      penalty: 400,
      penalty_decay:0.99654026,
    },
    Sampler_Mirostat:{
      type: "Mirostat",
      tau: 3.0,
      rate: 0.1,
    },
    Sampler_Typical:{
      type: "Typical",
      tau: 0.5,
      top_k: 128,
      temperature: 1,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
      penalty: 400,
      penalty_decay: 0.99654026,
    },
    Model: "",
    stateid: "",
    statename: "",
    bnf_schema:"",
    stop:"[\\n\\nUser:],[\\nUser:],[User:]",
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
    startHistory(payload: Message, me: User, ai: User) {
      this.chatHistory.history = [];
      this.chatHistory.history.push(payload);
      this.chatHistory.ai = ai;
      this.chatHistory.me = me;
    },
    setHistory(his: clist) {
      console.log(this.chatHistory);
      this.chatHistory.history = his.history;
      this.chatHistory.ai = his.ai;
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
        if (history[i].timestamp > timestamp) {
          history.splice(i, 1);
        } else {
          // 由于历史记录是按时间排序的，
          // 一旦遇到不满足条件的记录就可以停止循环
          break;
        }
      }
      console.log(history);
    },

    changeLatestMessage(msg: string,tokens:number) {

      //console.log(newmsg);
      this.chatHistory.history[this.chatHistory.history.length - 1].text = msg;
      this.chatHistory.history[this.chatHistory.history.length - 1].tokens = tokens;
      this.chatHistory.history[this.chatHistory.history.length - 1].endtime = new Date().getTime();

    },
    getLatestMessage() {
      return this.chatHistory.history[this.chatHistory.history.length - 1];
    },
    starttime() {
      this.chatHistory.history[this.chatHistory.history.length - 1].starttime = new Date().getTime();
    },
    deleteMessage(id: string) {
      let msg = this.chatHistory.history.find((item) => item.id === id);
      //获取 msg的 index
      let index = this.chatHistory.history.indexOf(msg);
      if (index == 0) {
        return;
      }
      if (msg.user.id === 1) {
        this.chatHistory.history.splice(index, 2);
      }
      if (msg.user.id === 2) {
        this.chatHistory.history.splice(index - 1, 2);
      }
    },
    createBody(messages:string[]) {
      if (this.stop.endsWith(",")) {
        // 去除最后一个分隔符
        this.stop = this.stop.slice(0, -1);
    }
      let stops = this.stop+",[\n\nHuman:],[\nHuman:],[Human:],[\n\nUser:],[\nUser:],[User:]"
      let body: ai00Type.OaiChatCompletionsType = {
        messages: messages,
        state: this.stateid,
        names: {
          user: this.chatHistory.me.name,
          assistant: this.chatHistory.ai.name,
        },
        stop: stops.replace(/\[|\]/g, '').replaceAll("\\n", "\n").split(","),
        stream: true,
        bnf_schema: this.bnf_schema,
        max_tokens: this.Max_Tokens,
      };

      switch (this.SamplerType){
        case "Nucleus":
          body.sampler_override = this.Sampler_Nucleus;
          break;

        case "Mirostat":
          body.sampler_override = this.Sampler_Mirostat;
          break;

        case "Typical":
          body.sampler_override = this.Sampler_Typical;
          break;

      }
      if (
        body.bnf_schema == "" ||
        body.bnf_schema == null ||
        body.bnf_schema == "NULL"
      ) {
        delete body.bnf_schema;
      }
      if (body.state == "" || body.state == null || body.state == "NULL") {
        delete body.state;
      }
      return body;

    },
  },
});
