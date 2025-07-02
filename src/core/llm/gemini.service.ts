import {
  GoogleGenAI,
  Content,
  FunctionDeclaration
} from '@google/genai';
import config from '../../config';
import { IHistoryEntry } from '../session/session.interface';
import { IGeminiStreamPart } from './types/gemini.types';

/**
 * Service to interact with the Google Gemini API using streaming.
 * This implementation aligns with the latest Gemini API documentation for Node.js.
 */
export class GeminiService {
  private readonly googleAI: GoogleGenAI;
  private readonly modelName = 'gemini-2.5-flash';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is missing.');
    }
    this.googleAI = new GoogleGenAI({ apiKey });
  }

  /**
   * Generates a response from the Gemini model via streaming.
   * This method is an AsyncGenerator, yielding processed chunks as they arrive.
   *
   * @param history The entire conversation history.
   * @param tools The function declarations available to the model.
   * @param systemPrompt The system-level instruction for the AI.
   * @yields {IGeminiStreamPart} A processed chunk of data.
   */
  async *generateStream(
    history: IHistoryEntry[],
    tools: FunctionDeclaration[],
    systemPrompt: string,
  ): AsyncGenerator<IGeminiStreamPart> {
    try {
      const contents: Content[] = history as Content[];

      const result = await this.googleAI.models.generateContentStream({
        model: this.modelName,
        contents,
        config: {
          tools: [{ functionDeclarations: tools }],
          systemInstruction: systemPrompt,
          temperature: 0.7,
          topP: 1,
          topK: 1,
          maxOutputTokens: 4096,
        },
      });

      // Iteramos sobre cada chunk del stream
      for await (const chunk of result) {
        // Cedemos el texto si existe
        const chunkText = chunk.text;
        if (chunkText) {
          yield { text: chunkText };
        }

        // Cedemos las llamadas a función si existen
        const functionCalls = chunk.functionCalls;
        if (functionCalls && functionCalls.length > 0) {
          for (const funcCall of functionCalls) {
            console.log(`[GeminiService] Yielding function call: ${funcCall.name}`);
            yield { functionCall: funcCall };
          }
        }
      }
    } catch (error) {
      console.error('[GeminiService] Error during content streaming:', error);
      throw new Error('Failed to stream response from Gemini API.');
    }
  }
}

export const geminiService = new GeminiService(config.geminiApiKey);
