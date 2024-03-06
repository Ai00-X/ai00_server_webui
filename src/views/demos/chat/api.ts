export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}
export async function chat(messageList: ChatMessage[], apiKey: string) {
 
    const result = await fetch('http://127.0.0.1:3000/v1/chat/completions', {
      method: 'post',
      // signal: AbortSignal.timeout(8000),
      // 开启后到达设定时间会中断流式输出
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: messageList,
      }),
    })
    return result
 
}
