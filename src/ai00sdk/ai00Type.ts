
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
 /// Specify layers that needs to be quantized.
 quant: number;
 quant_type: string;
 /// Maximum tokens to be processed in parallel at once.
 token_chunk_size: number;
 /// The chunk size for each split of the head matrix.
 max_runtime_batch: number;
 /// Number of states that are cached on GPU.
 max_batch: number;
 /// the (reversed) number of layer at which the output is as embedding.
 embed_device: string;
 /// Path to the tokenizer.
 tokenizer_path: string;
 /// Adapter selection.
 adapter: any;
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
}

export interface chatHistoryNameType {
  user: string;
  assistant: string;
}


export interface OaiEmbeddingsType {
  input: string;
}

