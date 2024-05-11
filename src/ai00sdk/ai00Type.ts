
export interface Ai00ApiPostType {
  method: string;
  apiurl:string;
  otherurl?:string;
  send_body: any;
  test?:any;
  readme?:string;
}

export interface Ai00ApiGetType {
  method: string;
  apiurl:string;
  otherurl?:string;
  readme?:string;
}

export interface FilesUnzipType {
  target_dir: string;
  zip_path: string;
}

export interface FilesDirType {
  target_dir: string;
  zip_path: string;
}

export interface ModelsLoadType {
 model_path: string;
 quant: number;
 quant_type: string;
 token_chunk_size: number;
 max_batch: number;
 embed_device: string;
 tokenizer_path: string;
 adapter: any;
 bnf?: any;
 lora?: any;
 state?: any;
 precision?: string;
}

export interface OaiCompletionsType {
  prompt: any[];
  max_tokens: number;
  stop: any[];
  stream: boolean;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  penalty_decay?: number;
  tau?: number;
  rate?: number;
  bnf_schema?: string;
  state?: string;
}

export interface OaiChatCompletionsType {
  messages: any[];
  max_tokens: number;
  stop: any[];
  stream: boolean;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  penalty_decay?: number;
  tau?: number;
  rate?: number;
  names: chatHistoryNameType;
  state?: string;
}

export interface chatHistoryNameType {
  user: string;
  assistant: string;
}


export interface OaiEmbeddingsType {
  input: string;
}

