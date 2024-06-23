
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
  state?: string;
  max_tokens: number;
  stop: any[];
  stream: boolean;
  bnf_schema?: string;
  sampler_override?: MirostatType | NucleusType | TypicalType;
}

export interface OaiChatCompletionsType {
  messages: any[];
  names: chatHistoryNameType;
  state?: string;
  max_tokens: number;
  stop: any[];
  stream: boolean;
  bnf_schema?: string;
  sampler_override?: MirostatType | NucleusType | TypicalType;
}

export interface MirostatType {
  type: string;
  tau: number;
  rate: number;
}

export interface NucleusType {
  type: string;
  top_p: number;
  top_k: number;
  temperature: number;
  presence_penalty: number;
  frequency_penalty: number;
  penalty_decay: number;
}

export interface TypicalType {
  type: string;
  tau: number;
  top_k: number;
  temperature: number;
  presence_penalty: number;
  frequency_penalty: number;
  penalty_decay: number;
}


export interface chatHistoryNameType {
  user: string;
  assistant: string;
}


export interface OaiEmbeddingsType {
  input: string;
}

export interface ModelSaveType {
  model_path: string;
}

