// src/utils/vertexai.ts
import { helpers, PredictionServiceClient } from "@google-cloud/aiplatform";

interface ChatParameters {
  max_new_tokens: number;
  temperature: number;
  top_p: number;
  top_k: number;
}

interface ChatMessage {
  system: string;
  user: string;
}

export class ChatService {
  private client: PredictionServiceClient;
  private projectId: string;
  private location: string;
  private endpointId: string;

  constructor(
    projectId: string,
    location: string,
    endpointId: string,
    keyFilename?: string
  ) {
    this.client = new PredictionServiceClient({
      apiEndpoint: `${location}-aiplatform.googleapis.com`,
      keyFilename,
    });
    this.projectId = projectId;
    this.location = location;
    this.endpointId = endpointId;
  }

  formatPrompt(message: ChatMessage): string {
    return `<|begin_of_text|><|start_header_id|>system<|end_header_id|>${message.system}<|eot_id|><|start_header_id|>user<|end_header_id|>${message.user}<|eot_id|><|start_header_id|>assistant<|end_header_id|>`;
  }

  async generateResponse(message: ChatMessage, parameters: ChatParameters) {
    try {
      const endpoint = `projects/${this.projectId}/locations/${this.location}/endpoints/${this.endpointId}`;

      const instance = helpers.toValue({
        inputs: this.formatPrompt(message),
        parameters: {
          max_new_tokens: parameters.max_new_tokens,
          temperature: parameters.temperature,
          top_p: parameters.top_p,
          top_k: parameters.top_k,
        },
      });

      const request = {
        endpoint,
        instances: [instance],
      };

      console.log("Sending request:", JSON.stringify(request, null, 2));

      const [response] = await this.client.predict(request);

      console.log("Received response:", JSON.stringify(response, null, 2));

      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}
