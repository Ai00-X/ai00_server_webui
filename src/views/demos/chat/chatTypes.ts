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
  tokens: number;
  starttime: number | string;
  endtime: number | string;
}


export interface clist {
  id_name: string;
  history:Message[];
  ai:User;
  me:User;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
