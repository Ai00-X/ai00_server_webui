import { defineStore } from "pinia";
import type  * as types from "./ai00Type";

const apis :(types.Ai00ApiPostType | types.Ai00ApiGetType)[] = [
  {
    apiurl: "/api/adapters",
    method: "GET",
    readme:"得到运行设备的列表"
  },
  {
    apiurl: "/api/files/unzip",
    method: "POST",
    send_body: {},
    test: {
      target_dir:"assets/temp/",
      zip_path:"assets/www/index.zip",
    },
    readme: "解压ZIP文件"
  },
  {
    apiurl: "/api/files/dir",
    otherurl:"/api/files/ls",
    method: "POST",
    send_body: {},
    test: {
      path: "assets/www/",
      is_sha: true,
    },
    readme: "等待补充"
  },
  {
    apiurl: "/api/models/list",
    method: "GET",
    readme: "等待补充"
  },
  {
    apiurl: "/api/models/load",
    method: "POST",
    send_body: {},
    test: {
      model_path: "assets/models/RWKV-4-World-0.4B-v1-20230529-ctx4096.st",
      quant: 0,
      token_chunk_size: 128,
      max_runtime_batch: 8,
      max_batch: 16,
      embed_layer: 8,
      tokenizer_path: "assets/tokenizer/rwkv_vocab_v20230424.json",
      adapter: {AUTO:{}},
    },
    readme: "等待补充"
  },
  {
    apiurl: "/api/models/save",
    method: "POST",
    send_body: {},
    test: {
      model_path: "xxxx.prefab"
    },
    readme: "等待补充"
  },
  {
    apiurl: "/api/models/info",
    method: "GET",
    readme: "等待补充"
  },
  {
    apiurl: "/api/oai/models",
    otherurl:"/api/oai/v1/models",
    method: "GET",
    readme: "等待补充"
  },
  {
    apiurl: "/api/oai/completions",
    otherurl:"/api/oai/v1/completions",
    method: "POST",
    send_body: {},
    test: {
      prompt: [],
      max_tokens: 256,
      stop: [],
      stream: true,
      temperature: 1.0,
      top_p: 0.5,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
      penalty_decay: 0.95,
    },
    readme: "等待补充"
  },
  {
    apiurl: "/api/oai/chat/completions",
    otherurl:"/api/oai/v1/chat/completions",
    method: "POST",
    send_body: {},
    test: {
      messages: ["你好"],
      max_tokens: 256,
      stop: ["\n\n","\nUser:","User:"],
      stream: true,
      temperature: 1.0,
      top_p: 0.5,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
      penalty_decay: 0.95,
    },
    readme: "等待补充"
  },
  {
    apiurl: "/api/oai/embeddings",
    otherurl:"/api/oai/v1/embeddings",
    method: "POST",
    send_body: {},
    test: {
      input : "啊哈哈哈哈哈哈哈是是是是是"
    },
    readme: "等待补充"
  },

];

export const useAi00Store = defineStore({
  id: "Ai00",
  state: () => ({
    apis: apis,
    server: "https://127.0.0.1:65530",
    quant_type: "None",
    quant: 0,

  }),

  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['quant_type','quant'] }],
  },

  getters: {
    // If you have set up an API key, please use your own key. If not, please use the one I provided.
    // getApiKey: (state) => state.apiKey || import.meta.env.VITE_OPENAI_API_KEY,
    //getApis: (state) => state.apiKey,
  },
  actions: {
    updatePropmpt() { },
    updateModel(model: string) {
      this.model = model;
    },
    setserverip(ip: string){
      this.server = ip;
    },
  },
});
