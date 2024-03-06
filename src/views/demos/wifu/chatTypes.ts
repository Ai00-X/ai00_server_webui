export interface User {
  id: number;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: number | string;
}


export interface clist {
  id_name: string;
  title: string;
  tou: string;
  history:[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
