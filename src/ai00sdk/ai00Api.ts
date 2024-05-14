import { useAi00Store } from "./ai00Store";
import * as ai00Type from "./ai00Type";
import {useChatStore} from "@/views/demos/chat/chatStore";
import {useTodoStore} from "@/views/demos/newchat/Store";

module Ai00Api {
  // ...
  /*
  内部函数 send_api 发送api

  */
  let controller: AbortController;

  let eventData: string = '';
  async function send_api(
    apiurl: string,
    method: string,
    bodys?: any,
    onmessage?: Function
  ) {
    const ai00Store = useAi00Store();

    controller = new AbortController();
    // 创建AbortController实例


    if(window.location.host == "localhost:4399"){
      ai00Store.setserverip("https://127.0.0.1:65530");
    }else{
      ai00Store.setserverip(window.location.origin)
    }

    if (method == "POST") {
      const response = await fetch(ai00Store.server + apiurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiurl}`,
        },
        body: JSON.stringify(bodys),
        signal: controller.signal,

      })
      const { body, status } = response;
      if (bodys.stream && body) {
        const reader = body.getReader();
        const decoder = new TextDecoder("utf-8");
        const readStream = async (
          reader: ReadableStreamDefaultReader<Uint8Array>,
          status: number
        ) => {
          let partialLine = "";
          let contentscache = "";
          eventData = "";
          let temp = 0;
          while (true) {
            // eslint-disable-next-line no-await-in-loop
            const { value, done } = await reader.read();
            if (done) break;

            const decodedText = decoder.decode(value, { stream: true });

            if (status !== 200) {
              const json = JSON.parse(decodedText); // start with "data: "
              const content = json.error.message ?? decodedText;
              this.onmessage(content);
              return;
            }
            //console.log(decodedText)
            const chunk = partialLine + decodedText;
            const newLines = chunk.split(/\r?\n/);

            partialLine = newLines.pop() ?? "";
            //console.log(newLines)
            const SSE_COMMENT_PREFIX = ":";
            const DATA_DONE_1 = "data: [DONE]";
            const DATA_DONE_2 = "data:[DONE]";
            for (const line of newLines) {
              if (line.length === 0) continue; // ignore empty message
              if (line.startsWith(SSE_COMMENT_PREFIX)) continue; // ignore sse comment message
              if (line === DATA_DONE_1) break; //
              if (line === DATA_DONE_2) break; //

              const json = JSON.parse(line.substring(5)); // start with "data: "
              const content =
                status === 200
                  ? json.choices[0].delta.content ?? ""
                  : json.error.message;
              // console.log(content)

              if ((content == "User" || content == "Question" ||  content == "Q" ) && temp == 0) {
                temp = 1;
              //  console.log("Key found",content)
                continue;
              }

              if (temp == 1 && content == ":") {
                // console.log("break",content)
                break;
               } else if (temp == 1) {
                temp = 0;
               // console.log("go",content)
              }

              contentscache += content;
              eventData+= content;
              if (temp == 0) {
                if (onmessage) {
                  onmessage(contentscache);
                }
              }
            }
          }
        };
        await readStream(reader, status);
      } else {
        console.log(status);
        console.log(body);
        if (status === 200) {

          if (onmessage) {
            try {
              const responseBody = await response.json();
              onmessage(responseBody);
              return responseBody;
            } catch (error) {
              onmessage(response.statusText);
              return response.statusText;
            }


          }
        } else {
          if (onmessage) {
            onmessage("something wrong");
          }
          return "something wrong";
        }




      }
    } else if (method == "GET") {
      const response = await fetch(ai00Store.server + apiurl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiurl}`,
        },
      });
      const responseBody = await response.json();
      if (responseBody) {
        if (onmessage) {
          onmessage(responseBody);
        }

        return responseBody;
      } else {
        if (onmessage) {
          onmessage("出错了");
        }
        return "出错了";
      }
    }
  }
  export function cancelSend() {
    controller.abort();
    useChatStore().changeLatestMessage(eventData);
    useChatStore().setChatting(false);
  }
  export function cancelSendNew() {
    controller.abort();
    useTodoStore().setChatting(false);
  }
  /*
  API :  /api/adapters
  */
  export async function adapters(run?: Function) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/adapters";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);

    if (foundApi) {
      const method = foundApi.method;

      await send_api(apiurl, method, null, (date: any) => {
        if (run) {
          run(date);
        }
      });
    } else {
      console.log("找不到匹配的API");
    }
  }

  /*
  API :  /api/oai/chat/completions
  */
  export async function oai_chat_completions(
    body: ai00Type.OaiChatCompletionsType,
    run: Function
  ) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/oai/chat/completions";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);

    if (foundApi) {

      const method = foundApi.method;
      await send_api(apiurl, method, body, (date: any) => {
        run(date);
      });
    } else {
      console.log("找不到匹配的API");
    }
  }

  /*
  API :  /api/oai/completions
  */
  export async function oai_completions(
    body: ai00Type.OaiCompletionsType,
    run: Function
  ) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/oai/completions";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);

    if (foundApi) {
      const method = foundApi.method;
      await send_api(apiurl, method, body, (date: any) => {
        run(date);
      });
    } else {
      console.log("找不到匹配的API");
    }
  }

  /*
  API :  /api/oai/embeddings
  */
  export async function oai_embeddings(
    body: ai00Type.OaiEmbeddingsType,
    run: Function
  ) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/oai/embeddings";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);

    if (foundApi) {
      const method = foundApi.method;
      await send_api(apiurl, method, body, (date: any) => {
        run(date);
      });
    } else {
      console.log("找不到匹配的API");
    }
  }

  /*
  API :  /api/oai/models
  */
  export async function oai_models(run: Function) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/oai/models";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);

    if (foundApi) {
      const method = foundApi.method;

      await send_api(apiurl, method, null, (date: any) => {
        if (run) {
          run(date);
        }
      });
    } else {
      console.log("找不到匹配的API");
    }
  }

  /*
  API :  /api/models/info
  */
  export async function models_info(run: Function) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/models/info";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);

    if (foundApi) {
      const method = foundApi.method;

      await send_api(apiurl, method, null, (date: any) => {
        if (run) {
          run(date);
        }
      });
    } else {
      console.log("找不到匹配的API");
    }
  }

  /*
  API :  /api/models/list
  */
  export async function models_list(run: Function) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/models/list";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);

    if (foundApi) {
      const method = foundApi.method;

      await send_api(apiurl, method, null, (date: any) => {
        if (run) {
          run(date);
        }
      });
    } else {
      console.log("找不到匹配的API");
    }
  }


  /*
  API :  /api/models/load
  */
  export async function models_load(body: ai00Type.ModelsLoadType,run: Function) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/models/load";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);

    if (foundApi) {
      const method = foundApi.method;

      await send_api(apiurl, method, body, (date: any) => {
        ai00Store.quant = body.quant;
        ai00Store.quant_type = body.quant_type;
        if (run) {
          run(date);
        }
      });
    } else {
      console.log("找不到匹配的API");
    }
  }

  /*
  API :  /api/models/save
  */
  export async function models_save(body: ai00Type.ModelSaveType,run: Function) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/models/save";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);

    if (foundApi) {
      const method = foundApi.method;

      await send_api(apiurl, method, body, (date: any) => {
        if (run) {
          run(date);
        }
      });
    } else {
      console.log("找不到匹配的API");
    }
  }

  /*
  API :  /api/files/dir
  */
  export async function files_dir(body: ai00Type.FilesDirType,run: Function) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/files/dir";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);
    if (foundApi) {
      const method = foundApi.method;
      await send_api(apiurl, method, body, (date: any) => {
        if (run) {
          run(date);
        }
      });
    } else {
      console.log("找不到匹配的API");
    }
  }

  /*
  API :  /api/files/unzip
  */
  export async function files_unzip(body: ai00Type.FilesUnzipType,run: Function) {
    const ai00Store = useAi00Store();
    const apiurl = "/api/files/unzip";
    const foundApi = ai00Store.apis.find((api) => api.apiurl === apiurl);
    if (foundApi) {
      const method = foundApi.method;
      await send_api(apiurl, method, body, (date: any) => {
        if (run) {
          run(date);
        }
      });
    } else {
      console.log("找不到匹配的API");
    }
  }


//module Ai00Api end
}



export default Ai00Api;
