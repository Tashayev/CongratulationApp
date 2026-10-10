export interface IStreamChunk {
  text: string;
  done: boolean;
}

export interface ILLMClient {
  streamGreeting(
    prompt: string,
    onChunk: (chunk: IStreamChunk) => void,
    signal?: AbortSignal,
  ): Promise<string>;
}

export class LLMError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'LLMError';
  }
}