// src/utils/vertexai.ts
import { PredictionServiceClient, helpers } from '@google-cloud/aiplatform';

export interface ModelConfig {
  endpointId: string;
  deployedModelId: string;
}

export class ChatService {
  private client: PredictionServiceClient;
  private projectId: string;
  private location: string;
  private modelConfig: ModelConfig;

  constructor(
    projectId: string,
    location: string,
    modelConfig: ModelConfig,
    keyFilename?: string
  ) {
    this.client = new PredictionServiceClient({
      apiEndpoint: `${location}-aiplatform.googleapis.com`,
      keyFilename
    });
    this.projectId = projectId;
    this.location = location;
    this.modelConfig = modelConfig;
  }

  async generateResponse(content: string) {
    try {
      const endpoint = `projects/${this.projectId}/locations/${this.location}/endpoints/${this.modelConfig.endpointId}`;

      const instance = helpers.toValue({
        inputs: content
      });

      const request = {
        endpoint,
        instances: [instance]
      };

      console.log('Sending request:', JSON.stringify(request, null, 2));

      const [response] = await this.client.predict(request);
      
      console.log('Received response:', JSON.stringify(response, null, 2));

      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
}