import { defineStore } from "pinia";
import * as ai00Type from "@/ai00sdk/ai00Type";


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
    Model:"",
    AIimg:"",
    Max_Tokens:1000,
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
    stateid: "",
    statename: "",
    bnf_schema:"",
    stop:"[\\n\\n],[\\nQ:],[\\nUser:],[\\nQuestion:],[\\n\\nQ:],[\\n\\nUser:],[\\n\\nQuestion:],[Q:],[User:],[Question:]",
    state: "",
    state_name:"",

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
    createBody(messages:string) {
      if (this.stop.endsWith(",")) {
        // 去除最后一个分隔符
        this.stop = this.stop.slice(0, -1);
    }
      let body: ai00Type.OaiCompletionsType = {
        prompt: [messages],
        stop: this.stop.replace(/\[|\]/g, '').replaceAll("\\n", "\n").split(","),
        stream: true,
        state: this.state,
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
