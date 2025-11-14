declare module 'openai' {
  export interface ResponseResult {
    output_text: string;
  }

  export default class OpenAI {
    constructor(config: { apiKey: string });
    responses: {
      create(args: {
        model: string;
        input: string;
        max_output_tokens?: number;
      }): Promise<ResponseResult>;
    };
  }
}
