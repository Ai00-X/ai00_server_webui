import type { ChatMessage } from "./chatTypes";

export async function chat(messageList: ChatMessage[], apiKey: string, serverip: string, max_tokens: number,temperature:number,top_p:number,presence_penalty:number,frequency_penalty:number,penalty_decay:number) {

    const result = await fetch("http://"+serverip+"/api/v1/chat/completions", {
      method: "post",
      // signal: AbortSignal.timeout(8000),
      // 开启后到达设定时间会中断流式输出
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: messageList,
        stop: ["\n\n","\nUser:","User:"],
        max_tokens: max_tokens,
        temperature: temperature,
        top_p: top_p,
        presence_penalty: presence_penalty,
        frequency_penalty: frequency_penalty,
        penalty_decay: penalty_decay
      }),
    });
    return result;

}
